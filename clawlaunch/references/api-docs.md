# ClawLaunch API Documentation

Complete API reference for integrating with ClawLaunch token launchpad.

## Base URL

**Production:** `https://www.clawlaunch.fun/api/v1`

## Authentication

All API requests require an API key in the `x-api-key` header:

```http
x-api-key: clawlaunch_sk_xxxxxxxxxxxxxxxxxxxx
```

Contact the ClawLaunch team to obtain an API key.

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/agent/launch` | 10 requests | 1 hour |
| General API | 100 requests | 1 minute |

Rate limit info is returned in response headers:
- `X-RateLimit-Remaining`: Requests remaining in window
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds until limit resets (on 429 responses)

---

## Endpoints

### POST /agent/launch

Launch a new token on the ClawLaunch bonding curve.

#### Request

```http
POST /api/v1/agent/launch
Content-Type: application/json
x-api-key: your_api_key
```

```json
{
  "agentId": "string",    // Required: Unique identifier for the agent
  "name": "string",       // Required: Token name (1-32 chars)
  "symbol": "string",     // Required: Token symbol (1-8 chars, A-Z0-9)
  "walletId": "string"    // Optional: Use existing Privy wallet ID
}
```

#### Validation Rules

| Field | Rules |
|-------|-------|
| agentId | Required, non-empty string |
| name | Required, 1-32 characters |
| symbol | Required, 1-8 characters, regex: `^[A-Z0-9]+$` |
| walletId | Optional, must be valid Privy wallet if provided |

#### Response (200 OK)

```json
{
  "success": true,
  "txHash": "0x...",
  "transactionId": "tx_...",
  "walletId": "wallet_...",
  "walletAddress": "0x...",
  "chainId": 8453,
  "message": "Token launch transaction submitted. Check transaction receipt for token address."
}
```

#### Error Responses

**401 Unauthorized**
```json
{
  "error": "Invalid or missing API key",
  "code": "UNAUTHORIZED",
  "hint": "Include a valid API key in the x-api-key header"
}
```

**403 Forbidden**
```json
{
  "error": "Insufficient permissions",
  "code": "FORBIDDEN",
  "required": "launch",
  "clientScopes": ["read"]
}
```

**429 Rate Limited**
```json
{
  "error": "Rate limit exceeded",
  "code": "RATE_LIMITED",
  "retryAfter": 1800,
  "limitType": "launch",
  "limit": "10 per hour"
}
```

**400 Validation Error**
```json
{
  "error": "Validation failed",
  "code": "VALIDATION_ERROR",
  "issues": [
    { "field": "symbol", "message": "Symbol must be uppercase letters and numbers only" }
  ]
}
```

**400 Insufficient Funds**
```json
{
  "error": "Insufficient funds for gas",
  "code": "INSUFFICIENT_FUNDS",
  "hint": "The agent wallet needs ETH for gas. Send ETH to the walletAddress."
}
```

---

## Wallet Management

### How Wallets Work

1. First request for an `agentId` creates a new Privy wallet
2. Subsequent requests reuse the same wallet
3. Wallet address is returned in responses
4. You can optionally pass `walletId` to use a specific wallet

### Funding Wallets

Tokens launch on Base Mainnet (Chain ID: 8453). The agent wallet needs ETH for gas:

1. Send ETH to the `walletAddress` returned in the response
2. Minimum recommended: 0.01 ETH
3. Typical launch gas cost: ~0.001 ETH

---

## Token Properties

Tokens created through the API have these properties:

| Property | Value |
|----------|-------|
| Network | Base Mainnet (8453) |
| Standard | ERC-20 |
| Max Supply | 1 billion tokens |
| Pricing | Bonding curve (price = k * supply^1.5) |
| Total Fee | 1% per trade |
| Creator Fee | 0.95% |
| Platform Fee | 0.05% |
| Graduation | Auto at 5 ETH market cap |

---

## Code Examples

### Node.js

```javascript
const response = await fetch('https://www.clawlaunch.fun/api/v1/agent/launch', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.CLAWLAUNCH_API_KEY,
  },
  body: JSON.stringify({
    agentId: 'my-agent-001',
    name: 'My Awesome Token',
    symbol: 'AWESOME',
  }),
});

const data = await response.json();
console.log('Transaction hash:', data.txHash);
console.log('Wallet address:', data.walletAddress);
```

### Python

```python
import requests

response = requests.post(
    'https://www.clawlaunch.fun/api/v1/agent/launch',
    headers={
        'Content-Type': 'application/json',
        'x-api-key': 'your_api_key',
    },
    json={
        'agentId': 'my-agent-001',
        'name': 'My Awesome Token',
        'symbol': 'AWESOME',
    }
)

data = response.json()
print(f"Transaction hash: {data['txHash']}")
print(f"Wallet address: {data['walletAddress']}")
```

### cURL

```bash
curl -X POST https://www.clawlaunch.fun/api/v1/agent/launch \
  -H "Content-Type: application/json" \
  -H "x-api-key: your_api_key" \
  -d '{
    "agentId": "my-agent-001",
    "name": "My Awesome Token",
    "symbol": "AWESOME"
  }'
```

---

## Getting the Token Address

The token address is available in the transaction receipt logs. To find it:

1. Wait for transaction confirmation
2. Query the transaction receipt
3. Parse the `TokenCreated` event from the factory contract

```javascript
const receipt = await publicClient.waitForTransactionReceipt({ hash: data.txHash });
const tokenCreatedLog = receipt.logs.find(log =>
  log.topics[0] === '0x...' // TokenCreated event signature
);
const tokenAddress = tokenCreatedLog.topics[1]; // First indexed param is token address
```

Or use the factory contract's `getAgentTokens` function:

```javascript
const tokens = await publicClient.readContract({
  address: '0x60d365C6043b63d9570cDA8D5FAEE1c77D859e7e',
  abi: AgentLaunchFactoryABI,
  functionName: 'getAgentTokens',
  args: [walletAddress],
});
```

---

## Support

- **Website:** https://www.clawlaunch.fun
- **GitHub:** https://github.com/SmokeAlot420/agentlaunch
- **API Issues:** Contact via GitHub issues
