# MiniKit Integration Setup Guide

## Environment Variables Required

Add these environment variables to your `.env.local` file and deployment platform:

### Required Variables

```bash
# MiniKit Configuration
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME="Fundable"
NEXT_PUBLIC_URL="https://your-deployed-app-url.com"
NEXT_PUBLIC_CDP_API_KEY="your_coinbase_developer_platform_api_key"

# Farcaster Account Association (Generated via `npx create-onchain --manifest`)
FARCASTER_HEADER=""
FARCASTER_PAYLOAD=""
FARCASTER_SIGNATURE=""
```

### Optional Variables for Enhanced Appearance

```bash
NEXT_PUBLIC_APP_ICON="https://your-app-domain.com/imgs/fundable_logo.png"
NEXT_PUBLIC_APP_SUBTITLE="A decentralized funding application"
NEXT_PUBLIC_APP_DESCRIPTION="Fundable enables decentralized funding and distribution through blockchain technology"
NEXT_PUBLIC_APP_SPLASH_IMAGE="https://your-app-domain.com/imgs/fundable_logo.png"
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR="#000000"
NEXT_PUBLIC_APP_PRIMARY_CATEGORY="utility"
NEXT_PUBLIC_APP_HERO_IMAGE="https://your-app-domain.com/imgs/fundable_logo.png"
NEXT_PUBLIC_APP_TAGLINE="Decentralized funding made simple"
NEXT_PUBLIC_APP_OG_TITLE="Fundable - Decentralized Funding"
NEXT_PUBLIC_APP_OG_DESCRIPTION="Fundable enables decentralized funding and distribution through blockchain technology"
NEXT_PUBLIC_APP_OG_IMAGE="https://your-app-domain.com/imgs/fundable_logo.png"
```

## Setup Steps

1. **Deploy Your App**: Deploy to Vercel or another platform with HTTPS
2. **Get CDP API Key**: Sign up at [Coinbase Developer Platform](https://portal.cdp.coinbase.com/)
3. **Configure Environment Variables**: Add the required variables to your `.env.local` and deployment platform
4. **Generate Manifest**: Run `npx create-onchain --manifest` to generate Farcaster association credentials
5. **Test**: Visit `https://your-domain.com/.well-known/farcaster.json` to verify the manifest

## Testing Your MiniKit Integration

1. Create a cast with your app's URL in Farcaster
2. Verify the preview displays your hero image and launch button
3. Test the launch experience by clicking the button
4. Use the [Farcaster Manifest Validator](https://farcaster.xyz/~/developers/mini-apps/manifest) to validate your setup

## Available MiniKit Hooks

Your app now has access to these MiniKit hooks:

- `useMiniKit()` - Main context and frame readiness
- `useNotification()` - Send notifications to users
- `useAddFrame()` - Allow users to save your app
- `useClose()` - Close the mini app frame
- `useOpenUrl()` - Open external URLs
- `usePrimaryButton()` - Configure primary button
- `useViewProfile()` - Navigate to user profiles
- `useAuthenticate()` - Handle Farcaster authentication

## Next Steps

1. Update your environment variables with actual values
2. Deploy your app with HTTPS enabled
3. Run the manifest generation command
4. Test your Mini App in Farcaster
5. Add more MiniKit functionality as needed 