# Vercel Environment Variable Setup

## Add this environment variable to your Vercel project:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add the following variable:

**Name:** `NEXT_PUBLIC_API_URL`
**Value:** `https://planit-backend-krfr.onrender.com/api`
**Environments:** Production, Preview, Development (check all)

3. After adding, **redeploy your application** for the changes to take effect.

## Quick Steps:
1. Open your Vercel dashboard
2. Select your project: plan-it-delta
3. Go to Settings → Environment Variables
4. Click "Add New"
5. Enter the variable name and value above
6. Save
7. Trigger a new deployment (or just push a commit)

The fallback URL is already in the code, but setting the environment variable is the proper way to configure it.
