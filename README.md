# neginrajaipourmd.com

Official website for Dr. Negin Rajaipour, MD - Board-Certified Family Medicine Physician, U.S. Navy Veteran, Entrepreneur, and Author.

## Stack

- **Framework:** Static HTML/CSS/JavaScript
- **Hosting:** Netlify
- **Email:** Resend
- **Fonts:** Google Fonts (Cormorant Garamond, Inter, Montserrat)

## Project Structure

```
neginrajaipourmd-com/
├── public/              # Static files served by Netlify
│   ├── index.html       # Homepage
│   ├── private-inquiry.html
│   └── assets/          # Images, logos
├── css/                 # Stylesheets
│   └── style.css
├── netlify/functions/   # Serverless functions
│   └── private-inquiry.js
├── netlify.toml         # Netlify configuration
└── email-drip-sequence.md  # Email templates
```

## Environment Variables

Required in Netlify:
- `RESEND_API_KEY` - Resend API key
- `RESEND_AUDIENCE_ID` - (Optional) Resend audience ID for contact list

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables in `.env`:
   ```
   RESEND_API_KEY=your_key_here
   RESEND_AUDIENCE_ID=your_audience_id
   ```

3. Run locally with Netlify CLI:
   ```bash
   npm run dev
   ```

## Deployment

Automatic deployment via Netlify when pushing to `main` branch.

Manual deploy:
```bash
npm run deploy
```

## Email Drip Sequence

6-email nurture sequence located in `email-drip-sequence.md`. Templates are ready to be imported into Resend or an automation platform.

---

© 2026 VitaRegen Medical™. All Rights Reserved.
