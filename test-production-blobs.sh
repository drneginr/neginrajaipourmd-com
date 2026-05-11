#!/bin/bash
# Test if Blobs is actually working in production

echo "Testing production Netlify Blobs..."
echo ""

# Submit a form with a test email
echo "1. Submitting form..."
RESPONSE=$(curl -s -X POST https://neginrajaipourmd.netlify.app/.netlify/functions/private-inquiry \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Blobs Test",
    "email": "blobstest@example.com",
    "phone": "555-0199",
    "organization": "Test Org",
    "role": "Tester",
    "inquiryType": "healthcare-practice",
    "timeline": "1-month",
    "message": "Testing Blobs storage"
  }')

echo "Response: $RESPONSE"
echo ""

# Wait a moment for processing
echo "2. Waiting 3 seconds for processing..."
sleep 3
echo ""

# Check if contact was stored
echo "3. Checking Netlify Blobs storage..."
npx netlify blobs:list contacts
echo ""

echo "4. Trying to get the specific contact..."
npx netlify blobs:get contacts blobstest@example.com || echo "Contact not found in Blobs"
