# Resend Email DNS Setup - REQUIRED

**Status:** Domain `neginrajaipourmd.com` is registered in Resend but NOT verified.  
**Impact:** Emails can only send to `admin@mye3method.com` (sandbox limitation).  
**Fix:** Add these DNS records to enable emails to all addresses.

---

## DNS Records to Add

Add these 3 records to `neginrajaipourmd.com` DNS (via Netlify DNS dashboard or NS1):

### 1. DKIM Record (TXT)
**Purpose:** Email authentication - proves emails are legitimately from your domain

```
Type: TXT
Name: resend._domainkey
Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDK91fROJ+FcueYB1zz4JXcq8Pd3S55D0QeQ1c4upDygi12yDt44THGXSnh2piP+Qxj62H/cZK0ZD4AERs/rls7G4tn/+M/xSz8kFR36XGXqLnTIB5Xr/bdkAmu5XxvWGpADA4MapCBVA1Z3nh0wSb2Aqjv6mtZTMdqpaz6RqH+gwIDAQAB
TTL: Auto (or 3600)
```

### 2. SPF MX Record
**Purpose:** Specifies mail server for bounces and replies

```
Type: MX
Name: send
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto (or 3600)
```

### 3. SPF TXT Record
**Purpose:** Email authentication - prevents spoofing

```
Type: TXT
Name: send
Value: v=spf1 include:amazonses.com ~all
TTL: Auto (or 3600)
```

---

## How to Add DNS Records

### Option 1: Via Netlify Dashboard (Recommended)
1. Go to: https://app.netlify.com/sites/neginrajaipourmd/settings/domain
2. Click "DNS settings" or "DNS records"
3. Add each of the 3 records above
4. Wait 5-10 minutes for propagation

### Option 2: Via NS1 Dashboard (if you have direct access)
1. Login to NS1: https://my.nsone.net
2. Find zone: neginrajaipourmd.com
3. Add each of the 3 records above

---

## Verification

After adding DNS records, verify they're working:

```bash
# Check DKIM record
dig TXT resend._domainkey.neginrajaipourmd.com +short

# Check SPF MX
dig MX send.neginrajaipourmd.com +short

# Check SPF TXT
dig TXT send.neginrajaipourmd.com +short
```

Or use Resend's verification:
1. Go to: https://resend.com/domains
2. Find: neginrajaipourmd.com
3. Click "Verify records"
4. Status should change from "failed" → "verified"

---

## Current Workaround

Until DNS is configured, test emails send to: **admin@mye3method.com**

```bash
curl https://neginrajaipourmd.netlify.app/trigger-test-email
# ✅ Sends to admin@mye3method.com successfully
```

Once DNS is verified, all drip emails will work for:
- Victoria (victoriaaverillfnp@gmail.com)
- Your test address (neginr1@yahoo.com)
- All future form submissions

---

## Resend Domain Info

- **Domain ID:** 6da77eb8-8715-4b4e-976c-8f3d1ccc5e10
- **Created:** April 29, 2026
- **Region:** us-east-1
- **Current Status:** failed (DNS not configured)
- **Nameservers:** dns1-4.p05.nsone.net (Netlify DNS)
