#!/bin/bash
# DNS Propagation Monitor for neginrajaipourmd.com

echo "🔍 Monitoring DNS propagation for neginrajaipourmd.com"
echo "Target IP: 75.2.60.5"
echo "Checking every 30 seconds..."
echo ""

while true; do
    # Check DNS
    CURRENT_IP=$(dig +short neginrajaipourmd.com | grep -E '^[0-9]+\.' | head -1)

    if [ "$CURRENT_IP" = "75.2.60.5" ]; then
        echo ""
        echo "✅ DNS PROPAGATED SUCCESSFULLY!"
        echo "✅ neginrajaipourmd.com → 75.2.60.5"
        echo ""
        echo "Next steps:"
        echo "1. Visit: https://neginrajaipourmd.com"
        echo "2. Go to Netlify to enable HTTPS"
        echo ""

        # Play success sound
        afplay /System/Library/Sounds/Glass.aiff 2>/dev/null

        # Open the site
        sleep 2
        open "https://neginrajaipourmd.com"

        exit 0
    else
        TIMESTAMP=$(date "+%H:%M:%S")
        if [ -z "$CURRENT_IP" ]; then
            echo "[$TIMESTAMP] ⏳ No DNS record yet..."
        else
            echo "[$TIMESTAMP] ⏳ Current IP: $CURRENT_IP (waiting for 75.2.60.5)"
        fi
    fi

    sleep 30
done
