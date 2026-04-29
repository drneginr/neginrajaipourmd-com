# 🚀 FINAL LAUNCH STEPS - DO THIS NOW

I've opened both pages you need. Complete these steps in order:

---

## STEP 1: Add Domain in Netlify (30 seconds)

**The page is open in your browser:**  
Netlify → Domain Settings

1. Click **"Add custom domain"** button
2. Type: `neginrajaipourmd.com`
3. Click **"Verify"**
4. Click **"Add domain"**
5. You'll see a warning that DNS isn't configured yet - **that's expected**

---

## STEP 2: Configure DNS at GoDaddy (2 minutes)

**The page is open in your browser:**  
GoDaddy → DNS Management for neginrajaipourmd.com

### Delete Existing Records
1. Find and **DELETE** the existing **A record** for `@`
2. Find and **DELETE** the existing **CNAME record** for `www` (if it exists)

### Add New Records

**Add A Record:**
- Type: `A`
- Name: `@`
- Value: `75.2.60.5`
- TTL: `600` (or 10 minutes)
- Click **Save**

**Add CNAME Record:**
- Type: `CNAME`
- Name: `www`
- Value: `neginrajaipourmd.netlify.app`
- TTL: `600` (or 10 minutes)
- Click **Save**

---

## STEP 3: Wait for DNS Propagation (5-15 minutes)

DNS changes take time. Check status with:

```bash
dig neginrajaipourmd.com
```

When you see `75.2.60.5` in the response, DNS is propagated.

---

## STEP 4: Enable HTTPS (Automatic)

Once DNS propagates:
1. Go back to Netlify → Domain Settings
2. Netlify will automatically provision an SSL certificate
3. Click **"Verify DNS Configuration"** if needed
4. Enable **"Force HTTPS"** toggle

---

## Current Status

✅ **Netlify staging URL (LIVE NOW):** https://neginrajaipourmd.netlify.app  
⏳ **Custom domain (NEEDS DNS):** https://neginrajaipourmd.com

---

## Expected Timeline

- **Right now:** Netlify staging URL is fully functional
- **After DNS update:** 5-15 minutes for propagation
- **After propagation:** Automatic SSL provisioning (2-5 minutes)
- **Total time:** ~10-20 minutes from DNS update

---

## What to Expect

1. **Immediately after DNS update:** Domain may show "Site Not Found" (normal during propagation)
2. **5-15 minutes later:** Site loads but shows "Not Secure" warning
3. **2-5 minutes after that:** HTTPS kicks in, fully secure

---

## Quick Test

After DNS propagates, test both URLs:
- http://neginrajaipourmd.com
- http://www.neginrajaipourmd.com
- https://neginrajaipourmd.com (after SSL)
- https://www.neginrajaipourmd.com (after SSL)

All should redirect to: **https://neginrajaipourmd.com**

---

**The tabs are open in your browser. Start with Netlify, then move to GoDaddy.**
