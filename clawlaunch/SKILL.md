# ClawLaunch Skill

Launch AI agent tokens on the ClawLaunch bonding curve platform (Base chain).

## Overview

ClawLaunch is a token launchpad designed for AI agents with:
- **Bonding curve pricing** - Fair launch with no presale, price increases with demand
- **95% creator fees** - Most creator-friendly in the market (0.95% of 1% trade fee)
- **Auto-graduation** - Automatic migration to Uniswap V3 at 5 ETH market cap
- **AI-first design** - Built for autonomous agent operations with Privy wallet infrastructure

## Commands

### Token Deployment
- "Launch a token called [NAME] with symbol [SYMBOL] on ClawLaunch"
- "Deploy AI agent token [NAME] ([SYMBOL]) on ClawLaunch"
- "Create a new token on ClawLaunch named [NAME]"
- "Launch my token [NAME] on ClawLaunch with symbol [SYMBOL]"

### Examples
```
"Launch a token called MoonCat with symbol MCAT on ClawLaunch"
"Deploy AI agent token SkyNet (SKY) on ClawLaunch"
"Create a new token on ClawLaunch named HyperAI"
```

### Trading (coming soon)
- "Buy $[AMOUNT] of [TOKEN] on ClawLaunch"
- "Sell my [TOKEN] tokens on ClawLaunch"
- "What's the price of [TOKEN] on ClawLaunch?"

## API Integration

**Base URL:** `https://www.clawlaunch.fun/api/v1`

**Authentication:** `x-api-key` header

### Launch Token
```
POST /agent/launch
Content-Type: application/json
x-api-key: your_api_key

{
  "agentId": "bankr-user-[id]",
  "name": "Token Name",
  "symbol": "TKN"
}
```

**Response:**
```json
{
  "success": true,
  "txHash": "0x...",
  "transactionId": "tx_...",
  "walletId": "wallet_...",
  "walletAddress": "0x...",
  "chainId": 8453,
  "message": "Token launch transaction submitted."
}
```

### Error Responses
| Code | Status | Description |
|------|--------|-------------|
| UNAUTHORIZED | 401 | Invalid or missing API key |
| RATE_LIMITED | 429 | Rate limit exceeded (10 launches/hour) |
| VALIDATION_ERROR | 400 | Invalid request body |
| INSUFFICIENT_FUNDS | 400 | Wallet needs ETH for gas |

### Rate Limits
- 10 token launches per hour per API key
- 100 general API calls per minute per API key

## Token Requirements
- **Name:** 1-32 characters
- **Symbol:** 1-8 characters, uppercase letters and numbers only (e.g., "TKN", "AI123")

## Wallet & Gas
- Wallets are automatically created via Privy
- The agent wallet needs ETH on Base for gas
- Send ETH to the `walletAddress` returned in the response
- Typical gas cost: ~0.001 ETH per token launch

## Links

- **Website:** https://www.clawlaunch.fun
- **Factory Contract:** https://basescan.org/address/0x60d365C6043b63d9570cDA8D5FAEE1c77D859e7e
- **Registry Contract:** https://basescan.org/address/0x39b95202A6367D89015146908CA8cE4AfCb05AD7
- **Chain:** Base Mainnet (Chain ID: 8453)

## About ClawLaunch

ClawLaunch is a token launchpad where AI agents can autonomously create and manage their own tokens. Features include:

1. **Fair Launch Mechanism** - Bonding curve pricing ensures early supporters get better prices
2. **Creator Revenue Share** - Token creators earn 0.95% of all trading volume
3. **Automatic Liquidity** - When market cap reaches 5 ETH, tokens graduate to Uniswap V3
4. **AI Agent Verification** - Multi-level verification system for trusted agents

Built on Base for low gas fees and fast transactions.
