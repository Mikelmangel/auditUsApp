---
name: capacitor-android-build
description: Monitor, debug, and verify Capacitor/Android builds. Use when building the mobile app, diagnosing build failures, checking APK output, or syncing Capacitor plugins. Triggers: "build my android app", "check the android build", "why did the android build fail", "run the mobile build", "sync capacitor android".
allowed-tools:
  - Bash(node -e *)
  - Bash(find *)
  - Bash(ls *)
  - Bash(du *)
  - Bash(df *)
  - Bash(cd *)
  - Bash(npm *)
  - Bash(npx *)
  - Bash(./gradlew *)
---

# Capacitor Android Build

Diagnose, run, and verify Capacitor/Android builds for this project.

## When to Use This Skill

- "build my android app" / "run the mobile build"
- "check the android build" / "why did the android build fail"
- "sync capacitor android" / "cap sync failed"
- "verify the APK" / "android build complete?"
- Gradle task stuck, slow, or cancelled

## Live Project Snapshot

Auto-detect at start of every session:
!`node -e "const fs=require('fs');if(!fs.existsSync('package.json'))process.exit(0);const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));const out=[];for(const [name,cmd] of Object.entries(pkg.scripts||{})){if(['build:mobile','build','sync','cap:sync'].includes(name))out.push('scripts.'+name+'='+cmd)}const caps=['@capacitor/android','@capacitor/cli','@capacitor/core'];for(const [name,version] of Object.entries(pkg.dependencies||{})){if(caps.includes(name))out.push('dependencies.'+name+'='+version)}console.log(out.join('\n'))"`

Check if APK already exists from a previous build:
!`find android/app/build/outputs/apk -name "*.apk" 2>/dev/null | head -5`

Check Gradle version and JVM args:
!`cat android/gradle/wrapper/gradle-wrapper.properties 2>/dev/null | grep distributionUrl && cat android/gradle.properties 2>/dev/null | grep jvmargs`

## Procedures

### Step 1: Assess Build State

1. Check if APK already exists (may exist from partial previous build):
   ```bash
   ls -lh android/app/build/outputs/apk/debug/ 2>/dev/null || echo "No APK dir"
   ```

2. Check disk space on the partition hosting the project:
   ```bash
   df -h /home/miguel-angel/Escritorio/Proyectos/AuditUs/android/
   ```

3. If disk space < 500MB free on any partition likely hosting Gradle caches, warn immediately.

### Step 2: Run the Mobile Build

Always run from project root:
```bash
npm run build:mobile
```

This runs `CAPACITOR_BUILD=true next build && npx cap sync android` followed by the Gradle assemble.

If the build was cancelled mid-flight (user cancelled), clean first:
```bash
cd android && ./gradlew clean && cd ..
npm run build:mobile
```

### Step 3: Interpret Build Output

#### Gradle `packageDebug` failure

Common causes and diagnostics:

| Error / Warning | Likely Cause | Fix |
|-----------------|--------------|-----|
| `Build cancelled while executing task :app:packageDebug` | User cancelled OR OOM kill | Clean + restart Gradle daemon |
| `No space left on device` | Disk full | Clear Gradle caches: `rm -rf ~/.gradle/caches/transforms-*` |
| `Execution failed for task ':app:packageDebug'` | Resource exhaustion | Increase `org.gradle.jvmargs` in `android/gradle.properties` (currently `-Xmx4g`, try `-Xmx6g` or `-Xmx8g`) |
| `AGPBI: {"kind":"warning","text":"Using flatDir should be avoided..."}` | Non-fatal warning, ignore | Not the cause of failure |
| Kotlin version mismatch | `force 'org.jetbrains.kotlin:kotlin-stdlib:1.8.22'` in app/build.gradle may conflict with AGP 8.9.2 | AGP 8.9.2 requires Kotlin 2.1+; remove the `force` lines or update Kotlin version |
| `compileDebugJavaWithJavac` errors | JDK version incompatibility | Project uses AGP 8.9.2 + Gradle 8.11.1, requires JDK 17+ (current: 17 — OK) |

#### Next.js build errors

If `CAPACITOR_BUILD=true next build` fails first:
- Check `next.config.ts` for `output: "export"` requirement
- Check for server-only imports (no `cookies()`, `headers()` in client components)
- Verify `trailingSlash: true` and `images.unoptimized: true` are set

#### Capacitor sync errors

If `npx cap sync android` reports missing plugins or mismatched versions:
```bash
npx cap doctor
```

### Step 4: Verify APK Output

On success, confirm the APK exists and report its size:
```bash
ls -lh android/app/build/outputs/apk/debug/app-debug.apk
```

Expected output format:
```
-rw-r----- 1 user user 42M android/app/build/outputs/apk/debug/app-debug.apk
```

A valid Capacitor debug APK should be non-empty (typically 20MB+).

### Step 5: Gradle Daemon Management

If builds appear stuck or hanging:
```bash
cd android && ./gradlew --stop
```

Then retry the build. This clears cached daemon state that can cause phantom hangs.

## Common Issues Reference

### `packageDebug` Cancelled After Long Build

This usually means the Gradle daemon was killed by the OS (OOM) or user cancelled. The build itself completed all preceding tasks (all 160 tasks reported UP-TO-DATE or executed). **Key indicator:** `160 actionable tasks: 2 executed, 158 up-to-date` — almost nothing actually ran, meaning the previous build did complete all work. The APK may already exist.

**Action:** Check for APK first. If it exists, it's valid. If not, clean and rebuild with more JVM heap:
```
# Increase heap in android/gradle.properties:
org.gradle.jvmargs=-Xmx6g
```

### Kotlin/AGP Version Mismatch

AGP 8.9.2 requires Kotlin 2.1+. The `force 'org.jetbrains.kotlin:kotlin-stdlib:1.8.22'` in `android/app/build.gradle` overrides this and causes runtime conflicts. The build may appear to succeed but crash at startup.

**Action:** Remove or update the `configurations.all { resolutionStrategy { force ... }}` block in `android/app/build.gradle`.

### flatDir Warning

Non-fatal. Ignore. Does not cause build failure.

## Key File References

| File | Purpose |
|------|---------|
| `android/app/build.gradle` | App-level build config, Kotlin version forces |
| `android/build.gradle` | AGP version (8.9.2), Google Services |
| `android/gradle.properties` | JVM args (`-Xmx4g`), parallel builds |
| `android/gradle/wrapper/gradle-wrapper.properties` | Gradle 8.11.1 |
| `package.json` scripts.build:mobile | `CAPACITOR_BUILD=true next build && npx cap sync android` |
| `capacitor.config.ts` | Capacitor plugin options |
| `next.config.ts` | Static export config |
