# Stackable Crafting ![Pack Icon](packs/RP/pack_icon.png)
Hypixel Skyblock crafting style like. Using entity, block and scripting API.

## 📦 Crafting Recipes Documentation

Below describes the custom crafting recipes used in the Minecraft server system. It supports both shaped `symbolic recipes` and `direct ingredient recipes`.

### You can choose to use TS or JS:

* [Setup for TypeScript](#-setup)
* Or download the .mcaddon if you want to use JS.

### 🧩 `shapedRecipe(...)` Format
The `shapedRecipe` function allows you to define **grid-based** (3x3) crafting recipes using symbolic keys. Useful when creating complex crafting shapes in a more readable format.

#### Example:

```ts
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
  }
})
```

#### 🔑 Key Explanation:

|Symbol   |Item         |Amount  |
|---------|-------------|--------|
|x        |*(empty)*   |1       |
|o    |minecraft:diamond_block   |32   |
|g        |minecraft:gold_block   |32   |

This pattern creates an Enchanted Diamond Block when the input grid is matched exactly.

### 🛠️ Direct Ingredient Recipe

Used when crafting doesn't rely on specific slot positions. Items are just required in the inventory crafting grid, in any order.

#### Example:

```ts
{
  ingredient: [
    { item: "minecraft:oak_log", amount: 16 },
    { item: "minecraft:stick", amount: 8 }
  ],
  result: () => {
    const item = new ItemStack("minecraft:bow");
    item.nameTag = "§r§aHunter's Bow";
    item.amount = 1;
    return item;
  }
}
```

#### Required Materials:
* 16x Oak Log
* 8x Stick

This recipe will create a Hunter's Bow when both ingredients are present in sufficient quantity.

### ✨ Result Format
Each recipe has a `result()` function that returns a `ItemStack`, Ofc you can modify the item by using property and method. [See documentation here.](https://stirante.com/script/server/1.18.0/classes/ItemStack.html)

#### Example:

```ts
{
  // ...
  result: () => {
    const item = new ItemStack("minecraft:stick");
    item.nameTag = "§r§aMidas Stick";
    item.amount = 1;
    item.setLore(["It said that this stick can make you rich"]);
    return item;
  }
}
```

### 📝 Notes
`"empty"` can be used in shaped recipes to represent empty slot.

## 🚀 Setup

This setup is for developers.


### 1. Requirements
- [Regolith](https://github.com/Bedrock-OSS/regolith/)
- [Node js/npm](https://nodejs.org/en)
- [Typescript](https://www.npmjs.com/package/typescript)

### 2. Clone repo

```
git clone https://github.com/abcdavk/stackable-crafting.git
cd stackable-crafting
```

### 3. Install dependencies
Install all dependencies for this project.
- `regolith install-all`
- `npm install`

### 4. Test/Run
You can simply run in terminal `npm run dev`, it will export the `/packs` folder to `com.mojang`.

If you're using linux you must add environtment variable to `~/.profile` or `~/.zshrc` (depend on your terminal), for example:

```bash
export COM_MOJANG="/home/abcdave/.var/app/io.mrarm.mcpelauncher/data/mcpelauncher/games/com.mojang"
```