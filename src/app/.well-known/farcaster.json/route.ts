export async function GET() {
  // Temporary redirect (307) to Farcaster Hosted Manifest
  const hostedManifestUrl = "https://api.farcaster.xyz/miniapps/hosted-manifest/0199b3e5-59ed-40c9-c545-6a7faef649c4";
  
  return Response.redirect(hostedManifestUrl, 307);
} 