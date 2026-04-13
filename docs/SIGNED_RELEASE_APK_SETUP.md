# Signed Release APK Setup

This document explains how to configure signed release APKs for Android distribution using EAS Build.

## Overview

You've configured a `release` build profile in `eas.json` that produces **signed APKs** suitable for real-world distribution (Play Store, direct downloads, etc.). This replaces the previous debug APK builds.

### Key Changes

- **EAS Profile**: New `release` profile with `distribution: "generic"` and `release: true`
- **Build Type**: `apk` (produces standalone APK, not app-bundle)
- **Signing**: Automatically managed by EAS with credential storage
- **GitHub Workflow**: Updated to use `--profile release` instead of `preview`

## Android Signing Credentials

For the `release` profile to build successfully, EAS needs Android signing credentials. You have **two options**:

### Option 1: EAS Managed Credentials (Recommended for CI/CD)

EAS can generate and store your signing credentials in their secure facility. This is ideal for GitHub Actions.

**First-time setup:**

1. Run the interactive credentials setup:
   ```bash
   cd apps/mobile
   EXPO_TOKEN='your-token' npx eas-cli credentials
   ```

2. Follow the prompts to:
   - Select "Android"
   - Choose "Set up credentials for a new Android app"
   - Let EAS generate a new keystore with signing key
   - Confirm storage in EAS servers

3. These credentials are now stored in EAS and will be used automatically for all `release` profile builds (CI/CD included).

**Verify credentials are stored:**
```bash
EXPO_TOKEN='your-token' npx eas-cli credentials --platform android
```

### Option 2: Use Existing Keystore

If you already have an Android keystore file:

1. Upload it to EAS:
   ```bash
   cd apps/mobile
   EXPO_TOKEN='your-token' npx eas-cli credentials
   ```

2. Select "Android" → "Use existing credentials" → upload your `.keystore` file

3. Provide the keystore password, key alias, and key password

## Building Signed Release APK

### Locally (for testing):
```bash
cd apps/mobile
EXPO_TOKEN='your-token' npx eas-cli build --platform android --profile release --wait
```

### Via GitHub Actions (Automatic on release tags):
1. Add `EXPO_TOKEN` to GitHub repository secrets (if not already done)
2. Tag your commit:
   ```bash
   git tag mobile-v1.0.0
   git push origin mobile-v1.0.0
   ```
3. Workflow automatically triggers and builds signed APK
4. APK is attached to the GitHub Release

## Verifying the Signed APK

After build completes:

```bash
# Download the APK
curl -o edumart-signed.apk "https://eas-builds.s3.us-west-2.amazonaws.com/..."

# Verify it's signed (shows certificate info):
jarsigner -verify -verbose -certs edumart-signed.apk

# Or use apksigner (Android SDK):
apksigner verify -v --print-certs edumart-signed.apk
```

## Key Differences: Preview vs Release

| Aspect | Preview | Release |
|--------|---------|---------|
| **Build Type** | Internal debug APK | Production-ready signed APK |
| **Distribution** | Internal (QA/testing) | Generic (Play Store, downloads) |
| **Signing** | Unsigned (debug key) | Signed (release key) |
| **File Size** | Slightly larger (debug info) | Optimized |
| **Installation** | Any device | Play Store requires this for releases |
| **Use Case** | Testing | Real user distribution |

## Troubleshooting

**Build fails with "Credentials not set up":**
- Run `npx eas-cli credentials` to create/upload signing credentials
- Ensure EXPO_TOKEN is valid and has permission to your EAS project

**Build succeeds but APK won't install:**
- Verify APK signature matches installed app certificate (if upgrading)
- Check `com.edumart.mobile` package name in `app.json`

**Need to regenerate signing key:**
```bash
npx eas-cli credentials --platform android --clear
# Then follow Option 1 setup again
```

## Next Steps

1. ✅ Configure Android signing credentials (see Option 1 or 2 above)
2. ✅ Test with: `npx eas-cli build --platform android --profile release --wait`
3. ✅ Push changes: `git push origin main`
4. ✅ Create release tag to trigger GitHub Actions: `git tag mobile-v1.0.0 && git push origin mobile-v1.0.0`
5. ✅ Download signed APK from GitHub Release or EAS dashboard

All other configuration is complete. Just set up signing credentials and you're ready to distribute!
