import { ItemStack, system, Vector3, world } from "@minecraft/server"
import { CRAFTING_ENTITY_ID } from "./var"


interface Buttons {
    craft: {
        slot: number[]
        icon: string
        title: string
    }
}

interface Ingredient {
    item: string
    amount: number
}

interface Recipe {
    ingredient: Ingredient[]
    result: ItemStack
}

let recipes: Recipe[] = [
    {
        ingredient: [
            {
                item: "minecraft:oak_log",
                amount: 10
            }
        ],
        result: new ItemStack("minecraft:coal")
    }
]

let buttons: Buttons = {
    craft: {
        slot: [10],
        icon: "minecraft:mace",
        title: "§r§eRun Craft\n§r§7[Click to craft]",
    }
}

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        if (player) {
            world.getDimension(player.dimension.id).getEntities({
                location: player.location,
                maxDistance: 6
            }).forEach(e => {
                if (e?.typeId == CRAFTING_ENTITY_ID) {
                    e.nameTag = "§u§i§1§r§fStackable Crafting";
                    let inv = e.getComponent("minecraft:inventory")?.container;
                    let grids = [
                        inv?.getItem(1),
                        inv?.getItem(2),
                        inv?.getItem(3),
                        inv?.getItem(4),
                        inv?.getItem(5),
                        inv?.getItem(6),
                        inv?.getItem(7),
                        inv?.getItem(8),
                        inv?.getItem(9),
                    ];
                    (Object.keys(buttons) as (keyof Buttons)[]).forEach(buttonType => {
                        let button = buttons[buttonType];
                        button.slot.forEach(slotId => {
                            let icon = new ItemStack(button.icon);
                            icon.nameTag = button.title;
                            icon.setLore([
                                "§b§a§n§i§t§e§m", 
                            ]);
                            inv?.setItem(slotId, icon);
                        });
                    });
                    
                    grids.forEach(grid => {
                        if (grid?.typeId !== undefined) {
                            recipes.forEach(recipe => {
                                recipe.ingredient.forEach(i => {
                                    if (grid?.typeId === i.item && grid.amount >= i.amount) {
                                        if (inv?.getItem(9) === undefined) inv?.setItem(9, recipe.result)
                                        else if (inv?.getItem(9)?.typeId === recipe.result.typeId) {
                                            const result = new ItemStack(recipe.result.typeId);
                                            result.amount += 1
                                            inv?.setItem(9, result)
                                                
                                        }
                                    }
                                });
                            })
                        } else {
                            // no item
                        }
                    })
                }
            })
        }
    })
})

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