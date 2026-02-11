#!/bin/bash
# Timestamp Pricing - Bash Wrapper
# Usage: ./price-lookup.sh <TOKEN> <DATE>

TOKEN="${1:-ETH}"
DATE="${2:-$(date +%d-%m-%Y)}"

# Convert various date formats to DD-MM-YYYY for CoinGecko
if [[ "$DATE" =~ ^[0-9]{10}$ ]]; then
  # Unix timestamp
  DATE=$(date -d "@$DATE" +%d-%m-%Y 2>/dev/null || date -r "$DATE" +%d-%m-%Y)
elif [[ "$DATE" =~ ^[0-9]{4}-[0-9]{2}-[0-9]{2}$ ]]; then
  # YYYY-MM-DD format
  DATE=$(date -d "$DATE" +%d-%m-%Y 2>/dev/null || date -j -f "%Y-%m-%d" "$DATE" +%d-%m-%Y)
fi

# Token ID mapping
declare -A TOKENS
TOKENS[BTC]="bitcoin"
TOKENS[ETH]="ethereum"
TOKENS[GHST]="aavegotchi"
TOKENS[MATIC]="matic-network"
TOKENS[USDC]="usd-coin"
TOKENS[WETH]="weth"
TOKENS[UNI]="uniswap"
TOKENS[AAVE]="aave"
TOKENS[LINK]="chainlink"
TOKENS[SOL]="solana"
TOKENS[AAI]="aaigotchi"

TOKEN_UPPER=$(echo "$TOKEN" | tr '[:lower:]' '[:upper:]')
TOKEN_ID="${TOKENS[$TOKEN_UPPER]:-$(echo "$TOKEN" | tr '[:upper:]' '[:lower:]')}"

echo "Fetching $TOKEN_UPPER price on $DATE..."
echo ""

# Fetch from CoinGecko
RESPONSE=$(curl -s "https://api.coingecko.com/api/v3/coins/$TOKEN_ID/history?date=$DATE")

# Check for errors
if echo "$RESPONSE" | jq -e '.error' > /dev/null 2>&1; then
  ERROR_MSG=$(echo "$RESPONSE" | jq -r '.error.status.error_message')
  echo "Error: $ERROR_MSG"
  echo ""
  echo "Note: Free CoinGecko API only provides historical data for the past 365 days."
  echo "For older data, use a paid API key or try a more recent date."
  exit 1
fi

# Extract price data
NAME=$(echo "$RESPONSE" | jq -r '.name')
SYMBOL=$(echo "$RESPONSE" | jq -r '.symbol | ascii_upcase')
PRICE=$(echo "$RESPONSE" | jq -r '.market_data.current_price.usd')

if [ "$PRICE" != "null" ]; then
  echo "$NAME ($SYMBOL)"
  echo "Date: $DATE"
  echo "Price: \$$PRICE USD"
  echo ""
else
  echo "No price data available for $TOKEN_UPPER on $DATE"
  exit 1
fi
