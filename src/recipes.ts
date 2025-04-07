import { ItemStack } from "@minecraft/server";
import Recipe from "./main";

export const recipes: Recipe[] = [
    {
        ingredient: [
            { item: "minecraft:oak_log", amount: 10 },
            { item: "minecraft:redstone", amount: 10 }
        ],
        result: () => {
            const item = new ItemStack("minecraft:coal");
            item.nameTag = "Super coal";
            item.amount = 10;
            return item;
        }
    },
    {
        ingredient: [
            { item: "minecraft:emerald_block", amount: 10 },
            { item: "minecraft:diamond_block", amount: 10 },
            { item: "minecraft:iron_block", amount: 10 }
        ],
        result: () => {
            const item = new ItemStack("minecraft:netherite_block");
            item.nameTag = "Super Steel";
            item.amount = 1;
            return item;
        }
    }
];
