#!/bin/bash
# Timestamp Pricing - Bash Wrapper
# Usage: ./price-lookup.sh <TOKEN> <DATE>

TOKEN="${1:-ETH}"
DATE="${2:-$(date +%d-%m-%Y)}"

# Convert various date formats to DD-MM-YYYY for CoinGecko
if [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  # Unix timestamp
  EPOCH=$(date -d "$DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d %H:%M:%S" "$DATE" +%s 2>/dev/null)
elif [[ "$DATE" =~ ^[0-9]{10}$ ]]; then
  # Already Unix timestamp
  EPOCH=$DATE
else
  # Try to parse as date string
  EPOCH=$(date -d "$DATE" +%s 2>/dev/null || date -j -f "%Y-%m-%d" "$DATE" +%s 2>/dev/null)
fi

# Get current time
NOW=$(date +%s)
AGE=$((NOW - EPOCH))
TIMESTAMP_DATE=$(date -d "@$EPOCH" "+%Y-%m-%d %H:%M:%S UTC" 2>/dev/null || date -r "$EPOCH" "+%Y-%m-%d %H:%M:%S UTC")

echo "=== Smart Timestamp Pricing ==="
echo "Token: $TOKEN"
echo "Timestamp: $TIMESTAMP_DATE"
echo "Age: $((AGE / 3600)) hours ago"
echo ""

# Decision: Use Bankr for prices less than 24 hours old, CoinGecko for older
if [ $AGE -lt 86400 ]; then
  # Recent price (< 24 hours) - Use Bankr for real-time data
  echo "Using Bankr (real-time pricing)..."
  echo ""
  
  # Call Bankr API via bankr.sh script
  BANKR_SCRIPT="$HOME/.openclaw/skills/bankr/scripts/bankr.sh"
  
  if [ -f "$BANKR_SCRIPT" ]; then
    bash "$BANKR_SCRIPT" "What is the current price of $TOKEN?"
  else
    echo "Error: Bankr script not found at $BANKR_SCRIPT"
    echo "Falling back to CoinGecko historical data..."
    echo ""
    bash "$(dirname "$0")/price-lookup.sh" "$TOKEN" "$(date -d "@$EPOCH" +%d-%m-%Y)"
  fi
  
else
  # Historical price (> 24 hours) - Use CoinGecko
  echo "Using CoinGecko (historical data)..."
  echo ""
  
  COINGECKO_DATE=$(date -d "@$EPOCH" +%d-%m-%Y 2>/dev/null || date -r "$EPOCH" +%d-%m-%Y")
  bash "$(dirname "$0")/price-lookup.sh" "$TOKEN" "$COINGECKO_DATE"
fi

# Note: For AAI (aaigotchi) token, use symbol directly
