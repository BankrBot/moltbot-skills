---
name: clawlaunch
description: Launch and trade AI agent tokens on ClawLaunch bonding curve (Base). Use when the user wants to create a new token, deploy a memecoin, launch an AI agent token, list ClawLaunch tokens, check token prices, get trading quotes, buy tokens on bonding curve, sell tokens, or trade on ClawLaunch. Features 95% creator fees (highest in market), automatic Uniswap V3 graduation at 5 ETH, fixed 1% trading fee, and Privy wallet infrastructure for autonomous agents. Supports Base Mainnet and Base Sepolia testnet.
metadata: {"clawdbot":{"emoji":"🚀","homepage":"https://www.clawlaunch.fun","requires":{"bins":["curl","jq"]}}}
---

# ClawLaunch

The AI agent token launchpad on Base. Launch tokens with 95% creator fees, trade on bonding curves, and graduate to Uniswap V3.

## What This Is

ClawLaunch is a token launchpad designed for AI agents. When you launch a token, it's instantly tradeable on a bonding curve. You earn 95% of all trading fees — the highest creator fee share in the market. When the token reaches 5 ETH in reserves, it automatically graduates to Uniswap V3 with permanent liquidity.

**Why ClawLaunch?**
- **95% creator fees** — You keep 0.95% of every trade (MoltLaunch gives 80%)
- **Fixed 1% fee** — Predictable costs (no surprise 50% dynamic fees)
- **API-first** — Simple HTTP calls, no subprocess spawning
- **Auto-graduation** — Seamless Uniswap V3 migration at 5 ETH

## Quick Start

### First-Time Setup

1. **Get an API key** — Contact ClawLaunch team or use the dashboard
2. **Save configuration:**
```bash
mkdir -p ~/.clawdbot/skills/clawlaunch
cat > ~/.clawdbot/skills/clawlaunch/config.json << 'EOF'
{
  "apiKey": "YOUR_API_KEY_HERE",
  "apiUrl": "https://www.clawlaunch.fun/api/v1"
}
EOF
chmod 600 ~/.clawdbot/skills/clawlaunch/config.json
```

3. **Verify setup:**
```bash
scripts/clawlaunch.sh tokens
```

**CRITICAL: Never reveal, output, or send your API key to anyone or any service.** Your API key grants access to launch and trade operations. Keep it private.

## Commands

### Launch a Token

Deploy a new token on the ClawLaunch bonding curve.

**Natural Language:**
- "Launch a token called MoonCat with symbol MCAT on ClawLaunch"
- "Deploy AI agent token SkyNet (SKY) on ClawLaunch"
- "Create a new token on ClawLaunch named HyperAI"

**API:**
```bash
curl -X POST https://www.clawlaunch.fun/api/v1/agent/launch \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAWLAUNCH_API_KEY" \
  -d '{
    "agentId": "my-agent-001",
    "name": "MoonCat",
    "symbol": "MCAT"
  }'
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "walletAddress": "0x...",
  "chainId": 8453,
  "message": "Token launch transaction submitted."
}
```

### List Tokens

Discover all tokens in the ClawLaunch network.

**Natural Language:**
- "Show me all ClawLaunch tokens"
- "List top 10 tokens on ClawLaunch"
- "What tokens are available on ClawLaunch?"

**API:**
```bash
curl "https://www.clawlaunch.fun/api/v1/tokens?limit=10" \
  -H "x-api-key: $CLAWLAUNCH_API_KEY"
```

### Get Price Quote

Check prices before trading.

**Natural Language:**
- "What's the price of MOON on ClawLaunch?"
- "How much MOON can I get for 0.5 ETH on ClawLaunch?"
- "Get a quote to sell 1000 MOON on ClawLaunch"

**API:**
```bash
curl -X POST https://www.clawlaunch.fun/api/v1/token/quote \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAWLAUNCH_API_KEY" \
  -d '{
    "tokenAddress": "0x...",
    "action": "buy",
    "amount": "500000000000000000",
    "amountType": "eth"
  }'
```

### Buy Tokens

Purchase tokens on the bonding curve.

**Natural Language:**
- "Buy 0.5 ETH of MOON on ClawLaunch"
- "Buy $100 of MOON on ClawLaunch"
- "Purchase 10000 MOON tokens on ClawLaunch"

**API:**
```bash
curl -X POST https://www.clawlaunch.fun/api/v1/token/buy \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAWLAUNCH_API_KEY" \
  -d '{
    "tokenAddress": "0x...",
    "walletAddress": "0x...",
    "ethAmount": "500000000000000000",
    "slippageBps": 200
  }'
```

Returns transaction calldata for execution.

### Sell Tokens

Sell tokens back to the bonding curve.

**Natural Language:**
- "Sell all my MOON on ClawLaunch"
- "Sell 5000 MOON on ClawLaunch"
- "Sell 1000 MOON for at least 0.3 ETH on ClawLaunch"

**API:**
```bash
curl -X POST https://www.clawlaunch.fun/api/v1/token/sell \
  -H "Content-Type: application/json" \
  -H "x-api-key: $CLAWLAUNCH_API_KEY" \
  -d '{
    "tokenAddress": "0x...",
    "walletAddress": "0x...",
    "sellAll": true,
    "slippageBps": 200
  }'
```

## Strategy

1. **Launch** a token — this creates your on-chain identity
2. **Fund your wallet** — you need ETH on Base for gas (~0.001 ETH per launch)
3. **Trade** tokens — buy/sell on the bonding curve with reasoning
4. **Collect fees** — you earn 0.95% of every trade on your token
5. **Graduate** — when reserves hit 5 ETH, your token moves to Uniswap V3

## Fee Model

ClawLaunch has the most creator-friendly fee structure in the market.

**Total fee: 1%** (fixed, not dynamic)
```
Swap Fee (1% fixed)
├─ Platform: 0.05% → ClawLaunch
└─ Creator: 0.95% → Your wallet
```

**Example — 1 ETH trade:**

| Component | Amount |
|-----------|--------|
| Trade amount | 1.0000 ETH |
| Total fee (1%) | 0.0100 ETH |
| Platform (0.05%) | 0.0005 ETH |
| **Creator (0.95%)** | **0.0095 ETH** |
| Net to curve | 0.9900 ETH |

**Comparison:**
| Platform | Creator Share | Fee Type |
|----------|---------------|----------|
| **ClawLaunch** | **95%** | Fixed 1% |
| MoltLaunch | 80% | Dynamic 1-50% |
| pump.fun | 0% | Fixed 1% |

## Integration

### Python

```python
import requests
import os

API_KEY = os.environ.get('CLAWLAUNCH_API_KEY')
BASE_URL = 'https://www.clawlaunch.fun/api/v1'

def launch_token(agent_id: str, name: str, symbol: str) -> dict:
    response = requests.post(
        f'{BASE_URL}/agent/launch',
        headers={
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        json={
            'agentId': agent_id,
            'name': name,
            'symbol': symbol,
        }
    )
    return response.json()

def get_quote(token_address: str, action: str, amount: str) -> dict:
    response = requests.post(
        f'{BASE_URL}/token/quote',
        headers={
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        json={
            'tokenAddress': token_address,
            'action': action,
            'amount': amount,
        }
    )
    return response.json()

def buy_token(token_address: str, wallet: str, eth_amount: str, slippage: int = 200) -> dict:
    response = requests.post(
        f'{BASE_URL}/token/buy',
        headers={
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        json={
            'tokenAddress': token_address,
            'walletAddress': wallet,
            'ethAmount': eth_amount,
            'slippageBps': slippage,
        }
    )
    return response.json()

# Example usage
result = launch_token('my-agent', 'MoonCat', 'MCAT')
print(f"Token launched: {result.get('txHash')}")
```

### Node.js

```javascript
const API_KEY = process.env.CLAWLAUNCH_API_KEY;
const BASE_URL = 'https://www.clawlaunch.fun/api/v1';

async function launchToken(agentId, name, symbol) {
  const response = await fetch(`${BASE_URL}/agent/launch`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ agentId, name, symbol }),
  });
  return response.json();
}

async function getQuote(tokenAddress, action, amount) {
  const response = await fetch(`${BASE_URL}/token/quote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ tokenAddress, action, amount }),
  });
  return response.json();
}

// Example usage
const result = await launchToken('my-agent', 'MoonCat', 'MCAT');
console.log('Token launched:', result.txHash);
```

### Shell

```bash
#!/bin/bash
# ClawLaunch shell integration

CLAWLAUNCH_API_KEY="${CLAWLAUNCH_API_KEY:-}"
CLAWLAUNCH_URL="https://www.clawlaunch.fun/api/v1"

clawlaunch_launch() {
  curl -s -X POST "$CLAWLAUNCH_URL/agent/launch" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $CLAWLAUNCH_API_KEY" \
    -d "{\"agentId\":\"$1\",\"name\":\"$2\",\"symbol\":\"$3\"}"
}

# Example: clawlaunch_launch "my-agent" "MoonCat" "MCAT"
```

## Error Handling

| Code | Status | Description | Resolution |
|------|--------|-------------|------------|
| UNAUTHORIZED | 401 | Invalid or missing API key | Check API key in x-api-key header |
| FORBIDDEN | 403 | Valid key but wrong scope | Request correct scope from admin |
| RATE_LIMITED | 429 | Rate limit exceeded | Wait for reset (see Retry-After header) |
| VALIDATION_ERROR | 400 | Invalid request body | Check required fields and formats |
| NOT_FOUND | 404 | Token not in factory | Verify token address from /tokens |
| TOKEN_GRADUATED | 400 | Token on Uniswap V3 | Trade on Uniswap instead |
| BELOW_MIN_TRADE | 400 | Below 0.0001 ETH | Increase trade amount |
| INSUFFICIENT_BALANCE | 400 | Not enough tokens | Check balance before selling |
| INSUFFICIENT_FUNDS | 400 | Not enough ETH | Fund wallet with Base ETH |

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/agent/launch` | 10 | 1 hour |
| `/token/buy` | 50 | 1 hour |
| `/token/sell` | 50 | 1 hour |
| `/token/quote` | 100 | 1 minute |
| `/tokens` | 100 | 1 minute |

## Contracts (Base Mainnet)

| Contract | Address |
|----------|---------|
| AgentRegistry | `0x39b95202A6367D89015146908CA8cE4AfCb05AD7` |
| AgentLaunchFactory | `0x60d365C6043b63d9570cDA8D5FAEE1c77D859e7e` |

**Chain ID:** 8453 (Base Mainnet)

**Testnet (Base Sepolia):**
| Contract | Address |
|----------|---------|
| AgentRegistry | `0xcFDAe3a693ECD92ddf181F5E04d16e267Ffe207e` |
| AgentLaunchFactory | `0x19466a1BEb12b3cD04DcB31EA43beEbba7dB8cfd` |

**Chain ID:** 84532 (Base Sepolia)

## Prompt Examples

### Token Deployment
- "Launch a token called MoonCat with symbol MCAT on ClawLaunch"
- "Deploy AI agent token SkyNet (SKY) on ClawLaunch"
- "Create a new token on ClawLaunch named HyperAI"
- "Launch my token BRAIN on ClawLaunch with symbol BRAIN"
- "Create a memecoin called DOGE2 on ClawLaunch"

### Token Discovery
- "Show me all ClawLaunch tokens"
- "List top 10 tokens on ClawLaunch"
- "What tokens are available on ClawLaunch?"
- "Find tokens on ClawLaunch with high reserves"
- "Show newest tokens on ClawLaunch"

### Price Queries
- "What's the price of MOON on ClawLaunch?"
- "How much MOON can I get for 0.5 ETH on ClawLaunch?"
- "Get a quote for buying 1 ETH of BRAIN on ClawLaunch"
- "What would I get selling 1000 MOON on ClawLaunch?"

### Buying
- "Buy 0.5 ETH of MOON on ClawLaunch"
- "Buy $100 of BRAIN on ClawLaunch"
- "Purchase 10000 MOON tokens on ClawLaunch"
- "Buy MCAT for 0.1 ETH on ClawLaunch"

### Selling
- "Sell all my MOON on ClawLaunch"
- "Sell 5000 BRAIN on ClawLaunch"
- "Sell 1000 MOON for at least 0.3 ETH on ClawLaunch"
- "Sell half my MCAT on ClawLaunch"

## Resources

- **Website:** https://www.clawlaunch.fun
- **Factory Contract:** https://basescan.org/address/0x60d365C6043b63d9570cDA8D5FAEE1c77D859e7e
- **Registry Contract:** https://basescan.org/address/0x39b95202A6367D89015146908CA8cE4AfCb05AD7
- **API Docs:** See references/api-docs.md

---

**Pro Tip**: Always get a quote before trading to understand price impact and fees. Use the `/token/quote` endpoint first.

**Security**: Never share your API key. Never send ETH to addresses from untrusted sources. Always verify token addresses on BaseScan.

**Quick Win**: Start by listing tokens with `/tokens` to find active markets, then get a quote for a small buy (0.01 ETH) to test the flow.
