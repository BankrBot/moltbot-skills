# Yoink Contract Reference

Detailed reference for the Yoink contract on Base.

## Contract Details

| Property | Value |
|----------|-------|
| Address | `0x4bBFD120d9f352A0BEd7a014bd67913a2007a878` |
| Chain | Base (chain ID 8453) |
| Standard | ERC1155 |

## Constants

| Constant | Value | Description |
|----------|-------|-------------|
| `COOLDOWN` | 600 | Seconds between yoinks (10 minutes) |
| `FLAG_ID` | 1 | ERC1155 token ID for the flag |
| `TROPHY_ID` | 2 | ERC1155 token ID for the trophy |

## Function Selectors

### Write Functions

| Function | Selector | Parameters | Description |
|----------|----------|------------|-------------|
| `yoink()` | `0x9846cd9e` | none | Yoink the flag from current holder |

### Read Functions

| Function | Selector | Parameters | Returns | Description |
|----------|----------|------------|---------|-------------|
| `lastYoinkedBy()` | `0xd4dbf9f4` | none | `address` | Current flag holder |
| `lastYoinkedAt()` | `0x6a99616f` | none | `uint256` | Unix timestamp of last yoink |
| `totalYoinks()` | `0xa5d0dadd` | none | `uint256` | Total number of yoinks ever |
| `topYoinker()` | `0x6a974e6e` | none | `address` | Trophy holder (most yoinks) |
| `mostYoinks()` | `0xd2d7774a` | none | `uint256` | Highest yoink count record |
| `COOLDOWN()` | `0xa2724a4d` | none | `uint256` | Cooldown duration in seconds |
| `score(address)` | `0x776f3843` | `address player` | `(uint256,uint256,uint256)` | Player's (yoinks, time, lastYoinkedAt) |

### ERC1155 Functions

| Function | Selector | Parameters | Returns | Description |
|----------|----------|------------|---------|-------------|
| `balanceOf(address,uint256)` | `0x00fdd58e` | `address owner, uint256 id` | `uint256` | Token balance (0 or 1) |
| `uri(uint256)` | `0x0e89341c` | `uint256 id` | `string` | Token metadata URI |

## Score Struct

```solidity
struct Score {
    uint256 yoinks;       // Number of times player has yoinked
    uint256 time;         // Total seconds holding the flag
    uint256 lastYoinkedAt; // Timestamp of player's last yoink
}
```

The `time` field is calculated dynamically:
- For the current flag holder: `storedTime + (block.timestamp - lastYoinkedAt)`
- For other players: `storedTime` (static value)

## Events

### Yoinked

```solidity
event Yoinked(address indexed by, address indexed from, uint256 timeHeld);
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `by` | `address` (indexed) | New flag holder (yoinker) |
| `from` | `address` (indexed) | Previous flag holder |
| `timeHeld` | `uint256` | Seconds the previous holder held the flag |

## Custom Errors

| Error | Selector | Parameters | Description |
|-------|----------|------------|-------------|
| `SlowDown(uint256)` | `0x58d6f4c6` | `uint256 remaining` | Cooldown not elapsed. `remaining` is seconds left. |
| `Unauthorized()` | `0x82b42900` | none | Cannot yoink from yourself |

### Decoding Error Responses

When a transaction fails, the RPC returns error data. To decode:

**SlowDown error:**
```
0x58d6f4c6 + 32-byte uint256 (seconds remaining)
```
Example: `0x58d6f4c60000000000000000000000000000000000000000000000000000000000000096` means 150 seconds remaining.

**Unauthorized error:**
```
0x82b42900
```
No parameters - just indicates you already hold the flag.

## ABI

```json
[
  {
    "type": "function",
    "name": "COOLDOWN",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "balanceOf",
    "inputs": [
      {"name": "owner", "type": "address"},
      {"name": "id", "type": "uint256"}
    ],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastYoinkedAt",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "lastYoinkedBy",
    "inputs": [],
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "mostYoinks",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "score",
    "inputs": [{"name": "player", "type": "address"}],
    "outputs": [
      {"name": "yoinks", "type": "uint256"},
      {"name": "time", "type": "uint256"},
      {"name": "lastYoinkedAt", "type": "uint256"}
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "topYoinker",
    "inputs": [],
    "outputs": [{"name": "", "type": "address"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalYoinks",
    "inputs": [],
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "uri",
    "inputs": [{"name": "id", "type": "uint256"}],
    "outputs": [{"name": "", "type": "string"}],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "yoink",
    "inputs": [],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "event",
    "name": "Yoinked",
    "inputs": [
      {"name": "by", "type": "address", "indexed": true},
      {"name": "from", "type": "address", "indexed": true},
      {"name": "timeHeld", "type": "uint256", "indexed": false}
    ]
  },
  {
    "type": "error",
    "name": "SlowDown",
    "inputs": [{"name": "remaining", "type": "uint256"}]
  },
  {
    "type": "error",
    "name": "Unauthorized",
    "inputs": []
  }
]
```

## RPC Endpoint

Use Base mainnet RPC:
```
https://mainnet.base.org
```

## Encoding Parameters

### Address Encoding

Addresses are zero-padded to 32 bytes (64 hex chars):
```
0x1234567890abcdef1234567890abcdef12345678
→ 0000000000000000000000001234567890abcdef1234567890abcdef12345678
```

### uint256 Encoding

Numbers are hex-encoded, zero-padded to 32 bytes:
```
1 → 0000000000000000000000000000000000000000000000000000000000000001
600 → 0000000000000000000000000000000000000000000000000000000000000258
```

### Decoding Responses

Responses are hex strings. To convert to decimal:
```bash
# Remove 0x prefix and convert
echo $((16#$(echo "0x0000...0258" | sed 's/0x//')))
```

Or use jq:
```bash
curl ... | jq -r '.result | ltrimstr("0x") | split("") | map(if . >= "a" then (. | explode[0] - 87) else (. | tonumber) end) | reduce .[] as $d (0; . * 16 + $d)'
```
