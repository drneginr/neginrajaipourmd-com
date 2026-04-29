# Quick Start Guide

## Immediate Next Steps

### 1. Create GitHub Repository (2 minutes)

**Visit:** https://github.com/new

**Settings:**
- Repository name: `neginrajaipourmd-com`
- Visibility: **Private**
- Do NOT initialize with README (already exists)

**Click "Create repository"**

Then run these commands in Terminal:
```bash
cd /Users/dr.rajaipour/Desktop/neginrajaipourmd-com

git remote add origin git@github.com:Neginr1/neginrajaipourmd-com.git
git push -u origin main
```

---

### 2. Deploy to Netlify (3 minutes)

**Visit:** https://app.netlify.com/start

1. Click **"Import an existing project"**
2. Choose **"Deploy with GitHub"**
3. Authorize Netlify to access your GitHub
4. Select **`Neginr1/neginrajaipourmd-com`**
5. Build settings (use these exact values):
   ```
   Build command: (leave EMPTY)
   Publish directory: public
   Functions directory: netlify/functions
   ```
6. Click **"Add environment variables"**:
   ```
   RESEND_API_KEY = your_resend_api_key_here
   ```
7. Click **"Deploy neginrajaipourmd-com"**

**Your site will be live in ~30 seconds at:**
`https://[random-name].netlify.app`

---

### 3. Test the Form (1 minute)

Once deployed:
1. Visit your Netlify URL
2. Click "Private Inquiry" in the navigation
3. Fill out the form with your email: `nrajaipour@gmail.com`
4. Submit
5. Check your inbox for 2 emails:
   - Confirmation to you
   - Notification to yourself

---

### 4. Rename Site (Optional, 30 seconds)

In Netlify dashboard:
1. Site settings → General → Site details
2. Click "Change site name"
3. Enter: `neginrajaipourmd` (or any available name)
4. Save

New URL: `https://neginrajaipourmd.netlify.app`

---

## What's Complete

✅ Full website built (homepage + private inquiry page)  
✅ Resend integration working  
✅ 6-email drip sequence written (in `email-drip-sequence.md`)  
✅ Git repository initialized  
✅ All images included  
✅ CSS styling complete  
✅ Mobile responsive  

## What You Need to Do

🔲 Create GitHub repo (link above)  
🔲 Deploy to Netlify (link above)  
🔲 Test the form end-to-end  
🔲 Optional: Set up custom domain `neginrajaipourmd.com`  
🔲 Optional: Set up email drip automation (see DEPLOYMENT.md)  

---

## Files You Need to Know About

- **`public/index.html`** - Homepage
- **`public/private-inquiry.html`** - Lead capture form
- **`netlify/functions/private-inquiry.js`** - Form handler (connects to Resend)
- **`email-drip-sequence.md`** - 6 email templates ready to use
- **`DEPLOYMENT.md`** - Full deployment documentation

---

**Estimated time to go live: 6 minutes**

Questions? Everything is documented in DEPLOYMENT.md.
