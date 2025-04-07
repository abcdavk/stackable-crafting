import { ItemStack, system, world } from "@minecraft/server";
let CRAFTING_ENTITY_ID = "minecraft:cow";
const recipes = [
    {
        ingredient: [
            {
                item: "minecraft:oak_log",
                amount: 10
            },
            {
                item: "minecraft:redstone",
                amount: 10
            }
        ],
        result: (() => {
            const item = new ItemStack("minecraft:coal");
            item.nameTag = "Super coal";
            item.amount = 10;
            return item;
        })()
    }
];
system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        const dimension = world.getDimension(player.dimension.id);
        const nearbyEntities = dimension.getEntities({
            location: player.location,
            maxDistance: 6
        });
        // Remove banned item from inventory
        let playerInventory = player.getComponent("minecraft:inventory")?.container;
        if (playerInventory) {
            for (let i = 0; i < playerInventory?.size; i++) {
                let getItemPlayer = playerInventory.getItem(i);
                if (getItemPlayer?.getLore().includes("§b§a§n§i§t§e§m")) {
                    playerInventory.setItem(i, undefined);
                }
            }
        }
        nearbyEntities.forEach(entity => {
            // Remove banned item from the world!!!!!!!!!!
            if (entity?.typeId === "minecraft:item" && entity.getComponent("minecraft:item")?.itemStack.getLore().includes("§b§a§n§i§t§e§m")) {
                entity.remove();
            }
            // Crafting system
            if (entity?.typeId !== CRAFTING_ENTITY_ID)
                return;
            entity.nameTag = "§u§i§1§r§fStackable Crafting";
            const inventory = entity.getComponent("minecraft:inventory")?.container;
            if (!inventory)
                return;
            const gridSlots = Array.from({ length: 9 }, (_, i) => inventory.getItem(i));
            if (inventory.getItem(10) === undefined) {
                const craftButton = new ItemStack("minecraft:crafting_table");
                craftButton.nameTag = "§r§eCraft";
                craftButton.setLore(["§r§e[Shift + Right Click]/[Q] §7to craft", "§b§a§n§i§t§e§m"]);
                inventory.setItem(10, craftButton);
                for (const recipe of recipes) {
                    let matched = true;
                    for (const ingredient of recipe.ingredient) {
                        const found = gridSlots.find(item => item?.typeId === ingredient.item &&
                            item.amount >= ingredient.amount);
                        if (!found) {
                            matched = false;
                            break;
                        }
                    }
                    if (matched) {
                        const outputSlot = inventory.getItem(9);
                        // If the output slot is empty 
                        const isOutputEmpty = !outputSlot;
                        // If the output can still be added
                        const isSameItemAndNotFull = outputSlot?.typeId === recipe.result.typeId &&
                            outputSlot.amount < outputSlot.maxAmount;
                        // Don't craft if can't
                        if (!isOutputEmpty && !isSameItemAndNotFull) {
                            return; // Stop crafting cause full
                        }
                        if (isOutputEmpty) {
                            inventory.setItem(9, recipe.result);
                        }
                        else if (isSameItemAndNotFull) {
                            const newAmount = outputSlot.amount + recipe.result.amount;
                            player.sendMessage(`${outputSlot.amount} + ${recipe.result.amount} = ${newAmount}`);
                            player.sendMessage(`${newAmount <= outputSlot.maxAmount}`);
                            if (newAmount <= outputSlot.maxAmount) {
                                const newResult = new ItemStack(recipe.result.typeId);
                                newResult.amount = newAmount;
                                inventory.setItem(9, newResult);
                            }
                            else {
                                const newResult = new ItemStack(recipe.result.typeId);
                                const remainsResult = new ItemStack(recipe.result.typeId);
                                const remainsAmount = newAmount - outputSlot.maxAmount;
                                remainsResult.amount = remainsAmount;
                                newResult.amount = outputSlot.maxAmount;
                                inventory.setItem(9, newResult);
                                world.getDimension(player.dimension.id).spawnItem(remainsResult, player.location);
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
world.afterEvents.playerInteractWithEntity.subscribe(({ player, target }) => {
    const entity = target;
    const dimension = entity.dimension;
    if (entity?.typeId === CRAFTING_ENTITY_ID) {
        if (!player.isSneaking) {
        }
        else {
            const item = new ItemStack("minecraft:crafting_table", 1);
            let block = dimension.getBlock(entity.location)?.setType("minecraft:air");
            dimension.spawnItem(item, entity.location);
            entity.kill();
            console.warn("test");
        }
    }
});
