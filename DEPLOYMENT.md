# Deployment Guide

## 1. Create GitHub Repository

```bash
# Option A: Using GitHub CLI (if installed)
gh repo create neginrajaipourmd-com --private --source=. --remote=origin --push

# Option B: Manual via GitHub.com
# 1. Go to https://github.com/new
# 2. Repository name: neginrajaipourmd-com
# 3. Set to Private
# 4. Do NOT initialize with README
# 5. Click "Create repository"
# 6. Then run:
git remote add origin git@github.com:Neginr1/neginrajaipourmd-com.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Netlify

### Via Netlify UI (Recommended for first deployment)

1. Go to https://app.netlify.com/
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize access
4. Select the `neginrajaipourmd-com` repository
5. Configure build settings:
   - **Build command:** (leave empty)
   - **Publish directory:** `public`
   - **Functions directory:** `netlify/functions`
6. Add environment variables:
   - `RESEND_API_KEY`: `your_resend_api_key_here`
   - `RESEND_AUDIENCE_ID`: (leave empty if not using audience)
7. Click "Deploy site"

### Via Netlify CLI (Alternative)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site (run from project directory)
cd /Users/dr.rajaipour/Desktop/neginrajaipourmd-com
netlify init

# Follow prompts:
# - Create & configure a new site
# - Choose your team
# - Site name: neginrajaipourmd-com (or custom)
# - Build command: (leave empty)
# - Publish directory: public

# Set environment variables
netlify env:set RESEND_API_KEY your_resend_api_key_here

# Deploy
netlify deploy --prod
```

## 3. Configure Custom Domain (Optional)

### In Netlify Dashboard:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter: `neginrajaipourmd.com`
4. If domain is on GoDaddy:
   - Netlify will detect it
   - Click "Use Netlify DNS" or configure manually
   - Follow GoDaddy DNS configuration steps

### GoDaddy DNS Records (if not using Netlify DNS):
```
Type: A
Name: @
Value: 75.2.60.5 (Netlify's load balancer)

Type: CNAME
Name: www
Value: [your-site-name].netlify.app
```

## 4. Test the Site

Once deployed, test:
1. Visit the staging URL: `https://[site-name].netlify.app`
2. Navigate to `/private-inquiry.html`
3. Submit a test form with your email
4. Verify email is received via Resend
5. Check Netlify Functions logs for any errors

## 5. Enable HTTPS & Security Headers

Netlify automatically provisions SSL certificates. Verify:
- Site Settings → Domain management → HTTPS
- Force HTTPS redirect should be enabled

Security headers are already configured in `netlify.toml`.

## 6. Set Up Email Drip Sequence

The 6-email templates are in `email-drip-sequence.md`. Options:

### Option A: Manual sending via Resend
1. Log into Resend dashboard
2. Create Broadcasts for each email
3. Schedule manually based on the timing in the templates

### Option B: Zapier automation
1. Create Zap: Webhook → Delay → Resend
2. Trigger from private inquiry form submission
3. Set up 6-step sequence with delays

### Option C: Custom scheduler (advanced)
Build Netlify scheduled functions to send drip emails automatically.

## Troubleshooting

### Function errors
Check Netlify Functions logs:
```bash
netlify functions:logs private-inquiry
```

### Email not sending
1. Verify `RESEND_API_KEY` is set correctly in Netlify env vars
2. Check Resend dashboard for sending domain verification
3. Review Netlify function logs

### Build/deploy issues
```bash
# Test functions locally
netlify dev

# Check build logs in Netlify dashboard
```

---

Once deployed, your staging URL will be available immediately. Custom domain setup can be done separately.
