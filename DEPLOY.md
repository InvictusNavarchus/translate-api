# Deno Deploy Configuration

This API is designed to be deployed on Deno Deploy as a serverless function.

## Deployment Steps

1. **Connect Repository**
   - Link your GitHub repository to Deno Deploy
   - Select this repository

2. **Configure Project**
   - Project Name: `translate-api`
   - Entry Point: `main.ts`
   - Environment: Production

3. **Deploy**
   - Deno Deploy will automatically build and deploy your API
   - The API will be available at: `https://your-project-name.deno.dev`

## Environment Variables

No environment variables are required for basic functionality.

## Permissions

The API requires the following permissions:
- `--allow-net`: For making HTTP requests to the Copilot API
- `--allow-env`: For reading environment variables (if needed in future)

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
