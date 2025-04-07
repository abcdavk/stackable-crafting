import { ItemStack, system, world } from "@minecraft/server"
import { recipes } from "./recipes";
let CRAFTING_ENTITY_ID: string = "dave:stackable_crafting"

interface Ingredient {
    item: string;
    amount: number;
}



export default interface Recipe {
    ingredient: Ingredient[];
    result(): ItemStack;
}

world.afterEvents.playerPlaceBlock.subscribe(({
    block, dimension, player
}) => {
    const { x, y, z} = block.location
    if (block.typeId === "dave:stackable_crafting") {
        let stackableCrafting = dimension.spawnEntity(CRAFTING_ENTITY_ID, block.center());
        stackableCrafting.nameTag = "§u§i§1§r§fStackable Crafting";
        let inv = stackableCrafting.getComponent("minecraft:inventory")?.container;
        stackableCrafting.setDynamicProperty('crafting:startSlot', 11);
    }
})


// Remove banned item from the world
world.afterEvents.entitySpawn.subscribe(({
    entity
}) => {
    if (entity.typeId == "minecraft:item" && entity.getComponent("minecraft:item")?.itemStack?.getLore().includes("§b§a§n§i§t§e§m")) {
        entity.remove();
    }
})

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        const dimension = world.getDimension(player.dimension.id);
        const nearbyEntities = dimension.getEntities({
            location: player.location,
            maxDistance: 6
        });

        // Remove banned item from inventory
        let playerInventory = player.getComponent("minecraft:inventory")?.container
        if(playerInventory) { for (let i = 0; i < playerInventory?.size; i++) {
            let getItemPlayer = playerInventory.getItem(i)
            if (getItemPlayer?.getLore().includes("§b§a§n§i§t§e§m")) {
                playerInventory.setItem(i, undefined)
            }
        }}

        nearbyEntities.forEach(entity => {
            if (entity?.typeId !== CRAFTING_ENTITY_ID) return;
            
            entity.nameTag = "§u§i§1§r§fStackable Crafting";

            const inventory = entity.getComponent("minecraft:inventory")?.container;
            if (!inventory) return;

            // Recipes system
            const maxRecipeSlots = 9;
            let startSlot = entity.getDynamicProperty('crafting:startSlot') as number || 11;

            // Step 1: Deteksi jika tombol ditekan (slot kosong padahal sebelumnya ada)
            if (inventory.getItem(20) === undefined && entity.getDynamicProperty("crafting:leftButtonWasPresent") === true) {
                startSlot = Math.max(11, startSlot - maxRecipeSlots); // prevent < 11
                entity.setDynamicProperty("crafting:startSlot", startSlot);
            }
            if (inventory.getItem(21) === undefined && entity.getDynamicProperty("crafting:rightButtonWasPresent") === true) {
                // prevent overflow
                const maxStart = Math.floor((recipes.length - 1) / maxRecipeSlots) * maxRecipeSlots + 11;
                startSlot = Math.min(maxStart, startSlot + maxRecipeSlots);
                entity.setDynamicProperty("crafting:startSlot", startSlot);
            }

            // Step 2: Render recipes
            for (let i = 0; i < maxRecipeSlots; i++) {
                const recipeIndex = i + (startSlot - 11);
                if (recipes[recipeIndex]) {
                    const recipeItem: ItemStack = recipes[recipeIndex].result();
                    const ingredients: string[] = [" ", "§r§9Recipes:"];
                    for (const ingr of recipes[recipeIndex].ingredient) {
                        ingredients.push(`§r§7${ingr.item} §ox${ingr.amount}`);
                    }
                    ingredients.push(" ", `§r§9Result: §7${recipeItem.typeId} §ox${recipeItem.amount}`);
                    recipeItem.setLore(ingredients);
                    inventory.setItem(11 + i, recipeItem);
                } else {
                    inventory.setItem(11 + i, undefined); // Kosongkan jika tidak ada resep
                }
            }

            // Step 3: Render tombol (hanya jika kosong)
            if (inventory.getItem(20) === undefined) {
                const backButton = new ItemStack("dave:left_arrow");
                backButton.setLore([
                    "§r§e[Shift + Right Click]/[Q] §7to craft",
                    "§b§a§n§i§t§e§m",
                    `Current Page: ${Math.floor((startSlot - 11) / maxRecipeSlots) + 1}`
                ]);
                inventory.setItem(20, backButton);
            }
            if (inventory.getItem(21) === undefined) {
                const nextButton = new ItemStack("dave:right_arrow");
                nextButton.setLore([
                    "§r§e[Shift + Right Click]/[Q] §7to craft",
                    "§b§a§n§i§t§e§m",
                    `Current Page: ${Math.floor((startSlot - 11) / maxRecipeSlots) + 1}`
                ]);
                inventory.setItem(21, nextButton);
            }

            // Step 4: Tandai tombol sudah dipasang (untuk deteksi di loop berikutnya)
            entity.setDynamicProperty("crafting:leftButtonWasPresent", inventory.getItem(20) !== undefined);
            entity.setDynamicProperty("crafting:rightButtonWasPresent", inventory.getItem(21) !== undefined);



            // Crafting system
            const gridSlots = [];
            for (let i = 0; i <= 8; i++) {
                gridSlots.push(inventory.getItem(i))
            }
            if (inventory.getItem(10) === undefined) {
                const craftButton = new ItemStack("minecraft:crafting_table");
                craftButton.nameTag = "§r§eCraft";
                craftButton.setLore(["§r§e[Shift + Right Click]/[Q] §7to craft","§b§a§n§i§t§e§m"]);
                inventory.setItem(10, craftButton);
                
                for (const recipe of recipes) {
                    let matched = true;

                    for (const ingredient of recipe.ingredient) {
                        const found = gridSlots.find(item =>
                            item?.typeId === ingredient.item &&
                            item.amount >= ingredient.amount
                        );
                        if (!found) {
                            matched = false;
                            break;
                        }
                    }
                    if (matched) {
                        const outputSlot = inventory.getItem(9);
                    
                        // If the output slot is empty 
                        const isOutputEmpty = !outputSlot;
                        const resultItem = recipe.result();
                        // If the output can still be added
                        const isSameItemAndNotFull = outputSlot?.typeId === resultItem.typeId &&
                                                      outputSlot.amount < outputSlot.maxAmount
                    
                        // Don't craft if can't
                        if (!isOutputEmpty && !isSameItemAndNotFull) {
                            return; // Stop crafting cause full
                        }
                    
                        if (isOutputEmpty) {
                            inventory.setItem(9, resultItem);
                        } else if (isSameItemAndNotFull) {
                            const newAmount = outputSlot.amount + resultItem.amount;
                        
                            if (newAmount <= outputSlot.maxAmount) {
                                const newResult = resultItem;
                                newResult.amount = newAmount;
                                inventory.setItem(9, newResult);
                            } else {
                                const newResult = resultItem;
                                const remainsResult = resultItem;
                                const remainsAmount = newAmount - outputSlot.maxAmount;
                                remainsResult.amount = remainsAmount;
                                newResult.amount = outputSlot.maxAmount;
                                inventory.setItem(9, newResult);
                                world.getDimension(player.dimension.id).spawnItem(remainsResult, player.location)
                            }
                        }
                    
                        // Reducing ingredient
                        for (const ingredient of recipe.ingredient) {
                            for (let i = 0; i < gridSlots.length; i++) {
                                const item = gridSlots[i];
                                if (item?.typeId === ingredient.item && item.amount >= ingredient.amount) {
                                    let subtItemAmount = item.amount - ingredient.amount;
                                    item.amount = subtItemAmount !== 0 ? subtItemAmount : item.amount;
                                    inventory.setItem(i, subtItemAmount > 0 ? item : undefined);
                                    break;
                                }
                            }
                        }
                    
                        break; // stop setelah satu recipe
                    }                    
                }
            }
        });
    });
});



world.afterEvents.playerInteractWithEntity.subscribe(({
    player,
    target
}) => {
    const entity = target;
    const dimension = entity.dimension;
    if (entity?.typeId === CRAFTING_ENTITY_ID) {
        if (!player.isSneaking) {
        } else {
            const item = new ItemStack("minecraft:crafting_table", 1)
            let block = dimension.getBlock(entity.location)?.setType("minecraft:air")
            dimension.spawnItem(item, entity.location)
            entity.kill()
            console.warn("test")
        }
    }
})