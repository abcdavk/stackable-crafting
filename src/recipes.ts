import { ItemStack } from "@minecraft/server";
import { Recipe, shapedRecipe } from "./main";

export const recipes: Recipe[] = [
  shapedRecipe({
    key: {
      x: { item: "empty", amount: 1 },
      o: { item: "minecraft:diamond_block", amount: 32 },
      g: { item: "minecraft:gold_block", amount: 32 },
    },
    ingredient: [
      "x", "o", "x",
      "o", "g", "o",
      "x", "o", "x"
    ],
    result: () => {
      const item = new ItemStack("minecraft:diamond_block");
      item.nameTag = "§r§bEnchanted Diamond Block";
      item.amount = 1;
      return item;
    },
  }),
  {
    ingredient: [
      { item: "minecraft:oak_log", amount: 16 },
      { item: "minecraft:stick", amount: 8 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:bow");
      item.nameTag = "§r§aHunter's Bow";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:iron_ingot", amount: 5 },
      { item: "minecraft:leather", amount: 2 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:shield");
      item.nameTag = "§r§bSturdy Shield";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:blaze_powder", amount: 3 },
      { item: "minecraft:ghast_tear", amount: 1 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:potion");
      item.nameTag = "§r§dPotion of Chaos";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:gold_block", amount: 2 },
      { item: "minecraft:ender_pearl", amount: 4 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:ender_eye");
      item.nameTag = "§r§eEye of the King";
      item.amount = 2;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:diamond", amount: 3 },
      { item: "minecraft:iron_ingot", amount: 6 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:diamond_sword");
      item.nameTag = "§r§9Knight's Wrath";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:nether_star", amount: 1 },
      { item: "minecraft:glass", amount: 5 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:beacon");
      item.nameTag = "§r§fMini Beacon";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:cobblestone", amount: 64 },
      { item: "minecraft:coal", amount: 8 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:furnace");
      item.nameTag = "§r§7Mega Furnace";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:obsidian", amount: 8 },
      { item: "minecraft:flint_and_steel", amount: 1 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:obsidian");
      item.nameTag = "§r§5Portable Portal";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:wheat", amount: 10 },
      { item: "minecraft:sugar", amount: 5 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:cake");
      item.nameTag = "§r§6Birthday Cake";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:end_stone", amount: 10 },
      { item: "minecraft:chorus_fruit", amount: 3 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:end_crystal");
      item.nameTag = "§r§5Crystal of Return";
      item.amount = 1;
      return item;
    },
  },
  {
    ingredient: [
      { item: "minecraft:totem_of_undying", amount: 1 },
      { item: "minecraft:phantom_membrane", amount: 3 },
    ],
    result: () => {
      const item = new ItemStack("minecraft:elytra");
      item.nameTag = "§r§bSky Glide";
      item.amount = 1;
      return item;
    },
  },
];
