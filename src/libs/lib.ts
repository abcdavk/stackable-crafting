import { ItemStack } from "@minecraft/server";
import { Recipe } from "../main";

function getRandomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomAmount(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface RandomRecipeOptions {
  ingredient?: {
    total?: [number, number]; 
    amount?: [number, number];
  };
  result?: {
    item?: string[];
    amount?: [number, number];
    prefix?: string;
    suffix?: string;
    lore?: string[];
  };
}

export function randomRecipe(type: string[], options?: RandomRecipeOptions): Recipe {
  const {
    ingredient: {
      total: ingredientTotalRange = [3, 6],
      amount: ingredientAmountRange = [1, 16],
    } = {},
    result: {
      item: typePool = type,
      amount: resultAmountRange = [1, 1],
      prefix = "",
      suffix = "",
      lore = []
    } = {}
  } = options ?? {};

  const resultType = getRandomFromArray(typePool);
  const resultAmount = getRandomAmount(resultAmountRange[0], resultAmountRange[1]);

  const totalIngredients = getRandomAmount(ingredientTotalRange[0], ingredientTotalRange[1]);
  const ingredient = Array.from({ length: totalIngredients }, () => ({
    item: getRandomFromArray(type),
    amount: getRandomAmount(ingredientAmountRange[0], ingredientAmountRange[1])
  }));

  return {
    ingredient,
    result: () => {
      const item = new ItemStack(resultType);
      item.nameTag = `§r${prefix} ${formatIdToName(resultType)} ${suffix}`.trim();
      item.amount = resultAmount;
      item.setLore(lore);
      return item;
    }
  };
}

/**
 * Converts a Minecraft item type ID to a readable display name.
 * @param typeId - The Minecraft item type ID, e.g. "minecraft:diamond_block"
 * @returns A human-readable item name, e.g. "Diamond Block"
 */
export function formatIdToName(typeId: string): string {
    // Remove namespace
    const withoutNamespace = typeId.includes(":") ? typeId.split(":")[1] : typeId;
  
    // Replace underscores with spaces
    const withSpaces = withoutNamespace.replace(/_/g, " ");
  
    // Capitalize each word
    const capitalized = withSpaces.replace(/\b\w/g, (char) => char.toUpperCase());
  
    return capitalized;
  }

/**
 * Converts a simplified shaped recipe format into a complete Recipe object
 * by expanding symbolic keys into full ingredient data.
 *
 * @param shaped - An object representing a shaped crafting recipe.
 * @param shaped.key - A dictionary where each key is a symbol used in the `ingredient` array,
 * and its value is an object that defines the actual item and the required amount.
 * @param shaped.key.{string} - A symbolic key like "x" or "o" representing an ingredient in the recipe grid.
 * @param shaped.key.{string}.item - The item ID (e.g., "minecraft:diamond_block") or "empty"/"null" for blank slots.
 * @param shaped.key.{string}.amount - The number of items required for that ingredient.
 * @param shaped.ingredient - A 9-element array (3x3 grid) of symbols representing the layout of ingredients.
 * @param shaped.result - A function that returns the resulting crafted `ItemStack`.
 *
 * @returns A fully expanded `Recipe` object ready to be used in the crafting system.
 */
export function shapedRecipe(shaped: {
    key: Record<string, { item: string; amount: number }>;  // <--- I dont know what this is. But, it works! :D
    ingredient: string[];
    result: () => ItemStack;
  }) {
    const { key, ingredient, result } = shaped;
  
    if (ingredient.length !== 9) {
      throw new Error("Recipe must have exactly 9 ingredient slots (3x3 grid).");
    }
  
    const shapedIngredient = ingredient.map(symbol => {
      const resolved = key[symbol];
      if (!resolved) {
        throw new Error(`Unknown symbol '${symbol}' in recipe`);
      }
      return resolved;
    });
  
    return {
      ingredient: shapedIngredient,
      result,
    };
}