#!/bin/bash
# Check current EUR/USDC exchange rate via AsterPay API
# Usage: ./check-rate.sh

API_BASE="https://x402-api-production-ba87.up.railway.app"

echo "Fetching EUR/USDC rate from AsterPay..."

# Single curl call capturing both body and HTTP status
RESULT=$(curl -s -w "\n%{http_code}" "$API_BASE/api/market-data?symbol=EURC" 2>/dev/null)
HTTP_CODE=$(echo "$RESULT" | tail -1)
RATE=$(echo "$RESULT" | sed '$d')

if [ "$HTTP_CODE" = "200" ] && [ -n "$RATE" ]; then
  echo "Current EUR/USDC Rate:"
  echo "$RATE" | jq '.' 2>/dev/null || echo "$RATE"
elif [ "$HTTP_CODE" = "402" ]; then
  echo "AsterPay API requires x402 payment. Using CoinGecko fallback..."
  FALLBACK=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur")
  echo "$FALLBACK" | jq '.' 2>/dev/null || echo "$FALLBACK"
else
  echo "AsterPay API unavailable (HTTP $HTTP_CODE). Using CoinGecko fallback..."
  FALLBACK=$(curl -s "https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur")
  echo "$FALLBACK" | jq '.' 2>/dev/null || echo "$FALLBACK"
fi

echo ""
echo "AsterPay processes USDC -> EUR via SEPA Instant (<10s settlement)"
echo "Supported: All 36 SEPA countries"
