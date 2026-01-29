---
name: yoink
description: Play Yoink, an onchain capture-the-flag game on Base. Yoink the flag from the current holder, check game stats and leaderboards, view player scores, and compete for the trophy. Uses Bankr for transaction execution.
metadata: {"clawdbot":{"emoji":"🚩","homepage":"https://basescan.org/address/0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","requires":{"bins":["curl","jq"]}}}
---

# Yoink

Play Yoink, an onchain capture-the-flag game on Base. Yoink the flag from the current holder to start your clock. The player with the most total yoinks holds the trophy.

## Contract

**Address:** `0x4bBFD120d9f352A0BEd7a014bd67913a2007a878`
**Chain:** Base (chain ID 8453)
**Standard:** ERC1155 with game mechanics

## Game Rules

1. **Yoink the flag** - Call `yoink()` to take the flag from the current holder
2. **Cooldown** - You must wait 10 minutes (600 seconds) between yoinks
3. **No self-yoink** - You cannot yoink from yourself
4. **Accumulate time** - While you hold the flag, your time score increases
5. **Compete for trophy** - The player with the most total yoinks holds the trophy (token ID 2)
6. **Track yoinks** - Your total yoink count is tracked separately from time

## Query Examples

All read operations use direct RPC calls via `eth_call`. The contract address is `0x4bBFD120d9f352A0BEd7a014bd67913a2007a878`.

### Current Flag Holder

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0xd4dbf9f4"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: address (right 20 bytes of 32-byte response)
# Extract address: take last 40 hex chars, prefix with 0x
```

### Last Yoink Timestamp

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0x6a99616f"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: uint256 Unix timestamp (hex-encoded)
# Convert: echo $((16#value))
```

### Total Yoinks

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0xa5d0dadd"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: uint256 total number of yoinks (hex-encoded)
```

### Top Yoinker (Trophy Holder)

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0x6a974e6e"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: address holding the trophy
```

### Most Yoinks Record

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0xd2d7774a"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: uint256 highest yoink count (hex-encoded)
```

### Cooldown Duration

```bash
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0xa2724a4d"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: uint256 (600 = 10 minutes, hex: 0x258)
```

### Player Score

Query a player's score by address. Append the zero-padded address to the selector.

```bash
# Replace YOUR_ADDRESS with the target address (lowercase, no 0x prefix, padded to 64 chars)
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0x776f3843000000000000000000000000YOUR_ADDRESS_HERE"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: 192 hex chars (96 bytes = 3 x uint256)
# - Bytes 0-31 (chars 2-66): yoinks count
# - Bytes 32-63 (chars 66-130): total time holding flag
# - Bytes 64-95 (chars 130-194): player's lastYoinkedAt timestamp
```

### Token Balance

Check if an address holds the flag (ID 1) or trophy (ID 2).

```bash
# balanceOf(address,uint256) - selector: 0x00fdd58e
# Append: address (32 bytes) + tokenId (32 bytes)
curl -s -X POST https://mainnet.base.org \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_call","params":[{"to":"0x4bBFD120d9f352A0BEd7a014bd67913a2007a878","data":"0x00fdd58e000000000000000000000000YOUR_ADDRESS_HERE0000000000000000000000000000000000000000000000000000000000000001"},"latest"],"id":1}' \
  | jq -r '.result'
# Returns: uint256 (1 if holder, 0 otherwise)
# Token IDs: FLAG_ID=1, TROPHY_ID=2
```

## Yoinking the Flag

Use Bankr's arbitrary transaction feature to yoink the flag.

**Function:** `yoink()`
**Selector:** `0x9846cd9e`
**Value:** 0 (no ETH required)

### Bankr Transaction Format

```
Yoink the flag using this transaction:
{
  "to": "0x4bBFD120d9f352A0BEd7a014bd67913a2007a878",
  "data": "0x9846cd9e",
  "value": "0",
  "chainId": 8453
}
```

### Example Prompts

- "Yoink the flag on the Yoink game"
- "Submit this Yoink transaction: {to: 0x4bBFD120d9f352A0BEd7a014bd67913a2007a878, data: 0x9846cd9e, value: 0, chainId: 8453}"
- "Execute this calldata on Base to yoink the flag"

## Score Interpretation

The `score(address)` function returns a tuple of three uint256 values:

| Field | Description |
|-------|-------------|
| `yoinks` | Number of times the player has yoinked |
| `time` | Total seconds holding the flag (updates dynamically for current holder) |
| `lastYoinkedAt` | Unix timestamp of player's last yoink |

The response is 96 bytes (192 hex characters after the 0x prefix), split into three 32-byte values.

## Error Handling

The contract uses custom errors:

| Error | Selector | Meaning |
|-------|----------|---------|
| `SlowDown(uint256)` | `0x58d6f4c6` | Cooldown not elapsed. Parameter is seconds remaining. |
| `Unauthorized()` | `0x82b42900` | Cannot yoink from yourself (you already hold the flag). |

### Checking Cooldown Before Yoinking

To avoid errors, check if enough time has passed:

1. Query `lastYoinkedAt()` to get the last yoink timestamp
2. Compare with current time: `current_time - lastYoinkedAt >= 600`
3. If cooldown not elapsed, wait `600 - (current_time - lastYoinkedAt)` seconds

## Typical Workflow

1. **Check current status**
   - Query `lastYoinkedBy()` to see who holds the flag
   - Query `lastYoinkedAt()` to check when it was last yoinked

2. **Verify cooldown**
   - Calculate if 10 minutes (600 seconds) have passed since last yoink
   - If not, wait for cooldown to expire

3. **Yoink the flag**
   - Ensure you're not the current holder (would fail with `Unauthorized`)
   - Submit the yoink transaction via Bankr

4. **Verify success**
   - Query `lastYoinkedBy()` to confirm you now hold the flag
   - Check your `score(address)` to see updated stats

## Function Reference

| Function | Selector | Type | Returns |
|----------|----------|------|---------|
| `yoink()` | `0x9846cd9e` | write | - |
| `lastYoinkedBy()` | `0xd4dbf9f4` | read | address |
| `lastYoinkedAt()` | `0x6a99616f` | read | uint256 |
| `totalYoinks()` | `0xa5d0dadd` | read | uint256 |
| `topYoinker()` | `0x6a974e6e` | read | address |
| `mostYoinks()` | `0xd2d7774a` | read | uint256 |
| `score(address)` | `0x776f3843` | read | (uint256,uint256,uint256) |
| `COOLDOWN()` | `0xa2724a4d` | read | uint256 |
| `balanceOf(address,uint256)` | `0x00fdd58e` | read | uint256 |

**Reference:** [references/contract-reference.md](references/contract-reference.md)

## Resources

- **Contract on Basescan:** https://basescan.org/address/0x4bBFD120d9f352A0BEd7a014bd67913a2007a878
- **Source Code:** https://github.com/horsefacts/yoink
