# Deployment

## Web on Vercel

Deploy the web app from the repo root with the helper script:

```bash
pnpm deploy:web
```

If you prefer the raw command:

```bash
pnpm dlx vercel --cwd apps/web
```

The web app uses the Next.js app in `apps/web`, and Vercel picks up the app configuration from `apps/web/vercel.json`.

## Mobile APK with EAS

Build the Android APK with the mobile helper script:

```bash
pnpm build:apk
```

If you want the raw EAS command:

```bash
cd apps/mobile && eas build --platform android --profile preview
```

For CI or non-interactive runs, use:

```bash
pnpm build:apk:ci
```

The mobile app uses the `preview` EAS profile, which is configured for Android APK output in `apps/mobile/eas.json`.

Local APK builds require an active Expo/EAS login. If you are not signed in, run `eas login` first or set `EXPO_TOKEN` in your environment.

## Notes

- Keep the root `.easignore` in place so EAS upload stays focused on mobile files.
- Keep web deployments scoped to `apps/web` so Vercel only sees the Next.js app and its workspace dependencies.