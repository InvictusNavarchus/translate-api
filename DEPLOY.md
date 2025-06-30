# Deno Deploy Serverless Configuration

This API is designed as a true serverless function for Deno Deploy.

## Serverless Architecture

The `main-single.ts` file exports a default handler function with all dependencies inline:
```typescript
export default async function handler(req: Request): Promise<Response> {
  // Translation logic with all utilities included
}
```

This single-file approach avoids import resolution issues that can cause `ISOLATE_INTERNAL_FAILURE` errors on Deno Deploy.

## Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Deno Deploy
   - Select this repository

2. **Configure Project**
   - Project Name: `translate-api`
   - Entry Point: `main-single.ts` (important: use the single-file version)
   - Environment: Production

3. **Deploy**
   - Deno Deploy will automatically build and deploy your API
   - The API will be available at: `https://your-project-name.deno.dev`

## File Structure

- `main-single.ts` - Single-file serverless handler (use this for deployment)
- `main.ts` - Modular version (may have import issues on Deno Deploy)
- `dev.ts` - Development server for modular version
- `dev-single.ts` - Development server for single-file version

## Troubleshooting

If you encounter `ISOLATE_INTERNAL_FAILURE`:
1. Use `main-single.ts` as entry point (all dependencies inline)
2. Ensure the handler function is exported as default
3. Check that all external API calls use proper error handling

## Automatic Deployments

Configure automatic deployments by:
1. Enabling GitHub integration
2. Setting up branch protection (optional)
3. Deno Deploy will automatically redeploy on code changes

## Custom Domain (Optional)

You can configure a custom domain in the Deno Deploy dashboard:
1. Go to your project settings
2. Add your custom domain
3. Configure DNS records as instructed

## Monitoring

Monitor your API through the Deno Deploy dashboard:
- View logs
- Monitor performance
- Check deployment status
- View usage statistics
