# HubSpot Integration Setup

## Current Status: PARTIALLY INTEGRATED

### ✅ Completed

1. **HubSpot API Client Installed**
   - `@hubspot/api-client` package added to dependencies
   - Ready for contact management operations

2. **Contact Creation Function**
   - `netlify/functions/hubspot-create-contact.js` created
   - Handles both diagnostic and inquiry form submissions
   - Maps internal constraint IDs to HubSpot enum values
   - Sets lifecycle stages automatically:
     - Diagnostic: Subscriber
     - Inquiry: Marketing Qualified Lead

3. **Frontend Integration**
   - Diagnostic form (`public/diagnostic/diagnostic.js`) updated to call HubSpot contact creation
   - Inquiry form (`public/private-inquiry.html`) updated to call HubSpot contact creation
   - Both forms make parallel requests to maintain fast user experience

4. **Custom Properties Verified**
   All 7 custom contact properties exist in HubSpot:
   - brand_of_origin (NRMD, E3 Method, VitaRegen)
   - primary_constraint (6 canonical patterns)
   - diagnostic_submitted_date
   - inquiry_submitted_date
   - last_session_date
   - role_and_organization
   - phone

### ⏸️ Pending User Action

1. **Add HubSpot API Key to Netlify**
   ```
   Go to: Netlify Dashboard → Site Settings → Environment Variables
   Add: HUBSPOT_API_KEY = [your HubSpot API key - starts with pat-na2-]
   ```

2. **Complete Sending Domain Authentication**
   - Verify neginrajaipourmd.com DNS records in HubSpot
   - Required for email sending from HubSpot

3. **Create HubSpot Workflows** (Email Templates TBD)
   
   **Workflow 1: Diagnostic PDF Delivery**
   - Trigger: Contact created with diagnostic_submitted_date populated
   - Action: Send email with PDF brief
   - Note: PDF is currently sent via Resend - will migrate once workflow is created

   **Workflow 2: Inquiry Acknowledgment**
   - Trigger: Contact created with inquiry_submitted_date populated
   - Action: Send acknowledgment email
   - Template: "Your inquiry has been received. Dr. Rajaipour will respond within 48 hours."

   **Workflow 3: Inquiry Internal Notification**
   - Trigger: Contact created with inquiry_submitted_date populated  
   - Action: Send notification to office@neginrajaipourmd.com

   **Workflow 4: Advisory Email Sequence** (6 emails)
   - Trigger: Contact enters subscriber lifecycle stage
   - Delay pattern: Day 0 (immediate), Day 3, Day 7, Day 10, Day 14, Day 21
   - Content: Migrate from `netlify/functions/email-templates/sequences/advisory.json`

### 🔄 Next Steps

1. **User**: Add HUBSPOT_API_KEY to Netlify environment variables
2. **User**: Redeploy site to activate HubSpot integration
3. **Test**: Submit diagnostic and inquiry with test email
4. **Verify**: Contact appears in HubSpot with correct properties
5. **User**: Create email workflows in HubSpot (templates will be provided separately)
6. **Migrate**: PDF delivery from Resend to HubSpot workflow
7. **Retire**: Remove Resend dependencies after workflows are live

### 📋 Testing Checklist

After deploying with HUBSPOT_API_KEY:

- [ ] Submit test diagnostic
  - [ ] Contact created in HubSpot
  - [ ] Primary constraint set correctly
  - [ ] Lifecycle stage = Subscriber
  - [ ] Brand of origin = NRMD
  - [ ] Diagnostic submitted date populated
  - [ ] PDF email received (via Resend for now)

- [ ] Submit test inquiry
  - [ ] Contact created/updated in HubSpot
  - [ ] Lifecycle stage = Marketing Qualified Lead
  - [ ] Inquiry submitted date populated
  - [ ] Role and organization populated
  - [ ] Acknowledgment email received (via Resend for now)
  - [ ] Notification email received at office@

### 🔐 Environment Variables

Required in Netlify:
```
HUBSPOT_API_KEY=[your HubSpot API key]
RESEND_API_KEY=[existing key - will be retired after HubSpot workflows are live]
```

User: Use the API key provided in this session for the HUBSPOT_API_KEY value.

### 📞 HubSpot Account Details

- Account ID: 246062473
- Sending Domain: neginrajaipourmd.com (DNS pending)
- Plan: Marketing Hub Starter
- Connected: Google Calendar, Stripe, Gmail (assumed)

### 🎯 Canonical Pattern Mapping

Frontend → HubSpot enum values:
- demand → demand_generation
- positioning → positioning_differentiation
- capacity → capacity_operations
- team → team_delegation
- monetization → monetization_pricing
- systems → operational_systems

### ⚠️ Important Notes

1. **Transactional Email Limitation**: Marketing Hub Starter doesn't include transactional email API. All emails must be sent via Marketing Email + Workflows.

2. **PDF Delivery**: Currently using Resend for PDF delivery. To migrate:
   - Option A: Upload PDF to public URL, include link in HubSpot email
   - Option B: Store PDF in HubSpot Files and attach via workflow
   - Option C: Keep Resend for PDF delivery only (hybrid approach)

3. **Form Submission Flow**: Forms POST to both Netlify functions (for PDF generation/email) AND HubSpot (for contact creation). This is intentional redundancy during migration.

4. **Non-Blocking**: HubSpot contact creation is non-blocking. If it fails, user experience is not affected (PDF still sends, form still submits).
