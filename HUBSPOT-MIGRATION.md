# HubSpot Migration Plan

## Status: PREREQUISITES REQUIRED

The following must be completed in HubSpot before migration can proceed:

### 4.1 - Prerequisites Checklist

- [ ] HubSpot Free account created
- [ ] Upgraded to Marketing Hub Starter ($50/month)
- [ ] Google Calendar connected to HubSpot
- [ ] Google Workspace connected to HubSpot  
- [ ] neginrajaipourmd.com authenticated as sending domain in HubSpot
- [ ] HubSpot API key generated (Settings → Integrations → Private Apps)
- [ ] Custom properties created in HubSpot:
  - [ ] Primary Constraint (single-line text)
  - [ ] Pattern Scores (multi-line text for JSON)
  - [ ] Diagnostic Submitted Date (date)
  - [ ] Inquiry Message (multi-line text)
  - [ ] Inquiry Date (date)

### 4.2 - Diagnostic Form Migration

**Current Architecture:**
```
User completes diagnostic 
  → Frontend calculates constraint
  → POST to /api/diagnostic-pdf (Netlify function)
  → Generates PDF with pdfkit
  → Sends email via Resend API with PDF attachment
```

**New Architecture:**
```
User completes diagnostic
  → Frontend calculates constraint
  → Parallel requests:
     a) POST to /api/diagnostic-pdf (Netlify function)
        → Generates PDF
        → Sends to HubSpot Forms API to create/update contact
        → HubSpot workflow emails PDF via transactional email
     
     b) POST to HubSpot Forms API (direct from frontend)
        → Creates contact with custom properties
        → Triggers enrollment in diagnostic workflow
```

**Required HubSpot Setup:**
1. Create Form in HubSpot for diagnostic submissions
2. Create Workflow: "Diagnostic PDF Delivery"
   - Trigger: Form submission
   - Action: Send transactional email with PDF attachment
3. Set lifecycle stage automation: Subscriber on form submit

**Code Changes Needed:**
- Update diagnostic.js to POST to HubSpot Forms API
- Update diagnostic-pdf.js to use HubSpot transactional email API instead of Resend
- Add HUBSPOT_API_KEY to Netlify environment variables
- Install @hubspot/api-client npm package

### 4.3 - Inquiry Form Migration

**Current Architecture:**
```
User submits inquiry
  → POST to /api/private-inquiry (Netlify function)
  → Sends acknowledgment email via Resend
  → Sends notification to office@ via Resend
  → Enrolls in advisory email sequence (Netlify Blobs)
```

**New Architecture:**
```
User submits inquiry
  → Parallel requests:
     a) POST to /api/private-inquiry (simplified Netlify function)
        → POST to HubSpot Forms API
     
     b) HubSpot Workflows:
        - "Inquiry Acknowledgment" sends user confirmation
        - "Inquiry Notification" emails office@
        - Sets lifecycle stage to Marketing Qualified Lead
        - Enrolls in advisory drip sequence
```

**Required HubSpot Setup:**
1. Create Form in HubSpot for inquiry submissions
2. Create Workflow: "Inquiry Acknowledgment"
   - Trigger: Form submission
   - Action: Send acknowledgment email
3. Create Workflow: "Inquiry Notification"  
   - Trigger: Form submission
   - Action: Send internal notification to office@
4. Create Workflow: "Advisory Email Sequence"
   - Migrate 6-email drip from advisory.json
5. Set lifecycle stage automation: MQL on form submit

**Code Changes Needed:**
- Update private-inquiry.html to POST to HubSpot Forms API
- Simplify private-inquiry.js (HubSpot handles emails)
- Migrate email templates from advisory.json to HubSpot

### 4.4 - Retire Resend

**After 4.2 and 4.3 are working:**
- Remove RESEND_API_KEY from Netlify env vars
- Remove `resend` package from dependencies
- Archive netlify/functions/send-email.js
- Archive netlify/functions/enroll-sequence.js
- Archive netlify/functions/scheduled/process-sequences.js
- Archive netlify/functions/email-templates/
- Update DEPLOYMENT-STATUS.md

### 4.5 - Lifecycle Stages

**HubSpot Lifecycle Stage Configuration:**
1. Subscriber = took diagnostic
2. Marketing Qualified Lead = submitted inquiry OR opened diagnostic brief email
3. Sales Qualified Lead = clicked inquiry/booking link in email
4. Opportunity = booked session via Google Calendar
5. Customer = completed at least one session
6. Evangelist = booked second engagement OR referred someone

**Implementation:**
- Stages 1-2: Automated by form workflows
- Stage 3: Automated by email link tracking
- Stage 4: Google Calendar webhook → HubSpot (requires setup)
- Stage 5: Manual update after session OR Google Calendar webhook
- Stage 6: Manual update OR automated by second booking

### 4.6 - Post-Booking Workflow

**Required Setup:**
1. Google Calendar webhook integration with HubSpot
2. Create Workflow: "Session Booked"
   - Trigger: Google Calendar event created
   - Actions:
     - Find/create contact by email
     - Set lifecycle stage to Opportunity
     - Send "What to Expect" email with Tally intake form link
     - Remove from diagnostic drip sequence

**Tally Forms Needed:**
- Tier 1 Session Intake Form (60-min)
- Tier 2 Session Intake Form (90-min)

### 4.7 - Post-Session Workflow

**Required Setup:**
1. Create Workflow: "Session Completed"
   - Trigger: 24 hours after Google Calendar event ends
   - Actions:
     - Set lifecycle stage to Customer
     - Send thank-you email

2. Create Workflow: "Quarterly Check-in"
   - Trigger: 90 days after lifecycle stage = Customer
   - Action: Send quarterly check-in email

## Next Steps

1. **User Action Required:** Complete prerequisite checklist above
2. **Provide to Claude:** HubSpot API key and Form IDs once created
3. **Claude will:** Implement code changes and test end-to-end
4. **User will:** Review and approve before retiring Resend

## Estimated Timeline

- HubSpot setup: 2-4 hours (user)
- Code implementation: 3-5 hours (Claude)
- Testing & verification: 1-2 hours
- Total: 1 business day
