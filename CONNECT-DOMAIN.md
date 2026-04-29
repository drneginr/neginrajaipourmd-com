# Connect neginrajaipourmd.com to Netlify

## Quick Steps (2 minutes)

### 1. Add Domain in Netlify

**Go to:** https://app.netlify.com/sites/neginrajaipourmd/settings/domain

1. Click **"Add custom domain"**
2. Enter: `neginrajaipourmd.com`
3. Click **"Verify"**
4. Click **"Add domain"**

### 2. Configure DNS

Netlify will show you DNS settings. You have 2 options:

#### Option A: Use Netlify DNS (Recommended - Automatic)
1. Click **"Use Netlify DNS"**
2. Follow the prompts to transfer DNS management
3. Update nameservers at GoDaddy to Netlify's nameservers
4. Done! (Propagation takes 5-30 minutes)

#### Option B: Keep GoDaddy DNS (Manual)
1. Go to GoDaddy DNS settings: https://dcc.godaddy.com/manage/neginrajaipourmd.com/dns
2. Add these records:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
TTL: 600
```

**CNAME Record:**
```
Type: CNAME  
Name: www
Value: neginrajaipourmd.netlify.app
TTL: 600
```

3. Delete any existing A or CNAME records for @ and www
4. Save changes
5. Propagation takes 5-30 minutes

### 3. Enable HTTPS

Once DNS propagates:
1. Go back to Netlify domain settings
2. Netlify will automatically provision SSL certificate
3. Enable "Force HTTPS" redirect

---

## Current URLs

- **Netlify staging (LIVE NOW):** https://neginrajaipourmd.netlify.app
- **Custom domain (NOT YET CONNECTED):** https://neginrajaipourmd.com

---

## Quick Check

After DNS updates, check propagation:
```bash
dig neginrajaipourmd.com
```

Should show: `75.2.60.5`

---

**Start here:** https://app.netlify.com/sites/neginrajaipourmd/settings/domain
