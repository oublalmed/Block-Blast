# 🔧 Windows Fix Guide

Solutions for common Windows development issues with Block Blast.

---

## Issue: Build Errors

If you see build errors, try these steps:

### Step 1: Clean Installation

```bash
# Remove node_modules and package-lock
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### Step 2: Clear Cache

```bash
npm cache clean --force
```

### Step 3: Update Dependencies

```bash
npm update
```

---

## Issue: Android Build Fails

### Check Java Version

```bash
java -version
```

Should be JDK 17 or higher.

### Check Android Studio Setup

1. Open Android Studio
2. SDK Manager → SDK Tools
3. Ensure these are installed:
   - Android SDK Build-Tools
   - Android SDK Platform-Tools
   - Android Emulator

### Sync Gradle

1. Open project in Android Studio
2. File → Sync Project with Gradle Files

---

## Issue: Capacitor Sync Errors

```bash
# Clean and rebuild
npm run build
npx cap sync android
```

If still failing:

```bash
# Remove android folder and recreate
rmdir /s /q android
npx cap add android
npx cap sync android
```

---

## Issue: Permission Denied

Run Command Prompt or PowerShell as Administrator.

---

## Issue: Path Too Long

Windows has a 260 character path limit. Solutions:

1. Move project to shorter path (e.g., `C:\dev\bb`)
2. Enable long paths:
   - Run `regedit`
   - Navigate to `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\FileSystem`
   - Set `LongPathsEnabled` to `1`

---

## Issue: npm ENOENT Errors

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules
rmdir /s /q node_modules

# Reinstall
npm install
```

---

## Contact

If issues persist, check:
- Node.js version (18+)
- npm version (9+)
- Android Studio version (latest)
- JDK version (17+)

---

**Happy coding! 🎮**
