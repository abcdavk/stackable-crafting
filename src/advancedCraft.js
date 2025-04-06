import {
    world,
    system,
    ItemStack
} from "@minecraft/server"

world.afterEvents.playerPlaceBlock.subscribe(({
    block, dimension, player
}) => {
    const { x, y, z} = block.location
    if (block.typeId === "dave:advanced_crafting") {
        let advancedCraft = dimension.spawnEntity("dave:advanced_crafting", block.center());
        advancedCraft.nameTag = "§u§i§1§r§fAdvanced Craft";
        let inv = advancedCraft.getComponent("minecraft:inventory").container;
    }
})

world.afterEvents.entitySpawn.subscribe(({
    entity
}) => {
    if (entity.typeId == "minecraft:item") {
        const item = entity.getComponent("item").itemStack;
        if (item?.getLore()[0] == "§b§a§n§i§t§e§m") {
            entity.remove();
        }
    }
})

system.runInterval(() => {
    world.getAllPlayers().forEach(player => {
        if (player) {
            world.getDimension(player.dimension.id).getEntities({
                location: player.location,
                maxDistance: 6
            }).forEach(e => {
                if (e?.typeId == "dave:advanced_crafting") {
                    let inv = e.getComponent("minecraft:inventory").container;
                    let grids = [
                        inv.getItem(1),
                        inv.getItem(2),
                        inv.getItem(3),
                        inv.getItem(4),
                        inv.getItem(5),
                        inv.getItem(6),
                        inv.getItem(7),
                        inv.getItem(8),
                        inv.getItem(9),
                    ];
                    let buttons = {
                        craft: {
                            slot: [10],
                            icon: "dave:copper_hammer",
                            title: "§r§eRun Craft\n§r§7[Click to craft]",
                        }
                    }
                    let result = 16
                    Object.keys(buttons).forEach(buttonType => {
                        let button = buttons[buttonType];
                        button.slot.forEach(slotId => {
                            let icon = new ItemStack(button.icon);
                            icon.nameTag = button.title;
                            icon.setLore([
                                "§b§a§n§i§t§e§m", 
                            ]);
                            inv.setItem(slotId, icon);
                        })
                    });
                    
                    
                    grids.forEach(grid => {
                        if (grid?.typeId !== undefined) {
                            // has item in grid
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
    if (entity?.typeId === "dave:advanced_crafting") {
        if (!player.isSneaking) {
        } else {
            const item = new ItemStack("dave:advanced_crafting", 1)
            let block = dimension.getBlock(entity.location)
                .setType("minecraft:air")
            dimension.spawnItem(item, entity.location)
            entity.kill()
            console.warn("test")
        }
    }
})