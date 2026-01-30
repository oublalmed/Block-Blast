# 🪟 Windows - Fix Vite Import Error

If you see a dependency error like `Failed to resolve import`, follow these steps:

---

## 🔧 Quick Fix (Recommended)

**Option 1: Use the batch script**

1. Double-click `fix-windows.bat`
2. Wait for it to complete
3. Run `npm run dev`

**Option 2: Manual commands**

Open PowerShell or CMD in the project folder and run:

```bash
# Stop any running servers (press Ctrl+C if server is running)

# Delete node_modules
rmdir /s /q node_modules

# Delete Vite cache
rmdir /s /q .vite

# Delete package-lock.json
del package-lock.json

# Reinstall everything
npm install

# Start the server
npm run dev
```

---

## ✅ Verify the Fix

After reinstalling, you should see:

```
VITE v7.3.0  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

✅ **No errors!**

---

## 🎮 Open the Game

Visit: http://localhost:5173

---

## 🔍 Why This Happens

On Windows, Vite sometimes doesn't recognize new packages added to `package.json` without clearing its cache. This is a known issue with Vite on Windows.

---

## 💡 Alternative: Use WSL2 (Optional)

For better development experience on Windows, consider using WSL2 (Windows Subsystem for Linux):

1. Install WSL2: https://docs.microsoft.com/en-us/windows/wsl/install
2. Install Node.js in WSL2
3. Run the project from WSL2 terminal

---

## 🆘 Still Having Issues?

If the error persists:

1. **Check Node version**: `node --version` (should be 18+)
2. **Check npm version**: `npm --version` (should be 9+)
3. **Try clearing npm cache**: `npm cache clean --force`
4. **Reinstall Node.js** from https://nodejs.org

---

**The game should work perfectly after following these steps! 🎮**
