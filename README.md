# Stackable Crafting ![Pack Icon](packs/RP/pack_icon.png)
Hypixel Skyblock crafting style like. Using entity, block and scripting API.

## Setup

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

If you're using linux you must add environtment variable to `~/.profile` or `~/.zshrc` (depend on your terminal):

<<<<<<< HEAD
```export COM_MOJANG=".../$PATH"```
=======
```export COM_MOJANG=".../$PATH"```
>>>>>>> 7be32c4 (fix: fix checking item amount in the output slot)
