# Batch Payments Reference

## Overview

Spraay enables sending ETH or ERC-20 tokens to multiple recipients in a single blockchain transaction. This is dramatically more gas-efficient than sending individual transfers.

## Gas Savings

| Recipients | Individual Txs Gas | Spraay Gas | Savings |
|-----------|-------------------|------------|---------|
| 5         | ~105,000          | ~65,000    | ~38%    |
| 10        | ~210,000          | ~95,000    | ~55%    |
| 50        | ~1,050,000        | ~250,000   | ~76%    |
| 100       | ~2,100,000        | ~420,000   | ~80%    |
| 200       | ~4,200,000        | ~750,000   | ~82%    |

## ETH Batch Payments

### Function: `sprayETH`

Sends ETH to multiple recipients in one transaction.

**Parameters:**
- `recipients`: Array of `{recipient: address, amount: uint256}` structs

**Value:** Total of all amounts + 0.3% protocol fee

**Example calldata construction:**
```
Function: sprayETH((address,uint256)[])
Recipients: [(0xAAA, 100000000000000000), (0xBBB, 200000000000000000)]
Value: sum of amounts + (sum * 30 / 10000)
```

### Limits
- Maximum 200 recipients per transaction
- Minimum 0.000001 ETH per recipient
- Sender must have sufficient ETH for total + fee + gas

## ERC-20 Batch Payments

### Function: `sprayToken`

Sends ERC-20 tokens to multiple recipients in one transaction.

**Parameters:**
- `token`: ERC-20 token contract address
- `recipients`: Array of `{recipient: address, amount: uint256}` structs

**Prerequisites:**
- Sender must approve the Spraay contract to spend tokens
- Approval amount should cover total + 0.3% fee

**Example flow:**
1. Approve: `token.approve(SPRAAY_CONTRACT, totalAmount + fee)`
2. Spray: `spraay.sprayToken(token, recipients)`

### Supported Tokens
Any standard ERC-20 token on Base, including:
- USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- USDT
- DAI
- WETH (0x4200000000000000000000000000000000000006)
- Any community/meme token

## CSV Format

For large distributions, Spraay accepts CSV files:

```csv
address,amount
0x1234567890abcdef1234567890abcdef12345678,0.5
0xabcdef1234567890abcdef1234567890abcdef12,0.2
0x9876543210fedcba9876543210fedcba98765432,1.0
```

**Rules:**
- Header row required: `address,amount`
- One recipient per line
- Addresses must be valid checksummed Ethereum addresses
- Amounts in human-readable format (not wei)
- Maximum 200 rows per CSV (split larger lists)

## Social Handle Resolution

When used alongside the Neynar skill (Farcaster) or ENS:

| Input | Resolution |
|-------|-----------|
| `@alice` (Farcaster) | Resolved via Neynar API → 0x address |
| `alice.eth` | Resolved via ENS → 0x address |
| `0xABC...` | Used directly |

## Protocol Fee Structure

- **Fee rate**: 0.3% (30 basis points)
- **Calculation**: `fee = totalAmount * 30 / 10000`
- **Collection**: Deducted at contract level during execution
- **Transparency**: Fee is emitted in transaction events, verifiable onchain

## Use Cases

### DAO Payroll
Monthly or bi-weekly batch payments to contributors. Combine with Bankr automation:
```
"Set up monthly spray: 500 USDC to 0xAlice, 300 USDC to 0xBob, 800 USDC to 0xCharlie on the 1st of every month"
```

### Token Airdrops
Distribute tokens to community members, contest winners, or early adopters.

### Grant Distributions
Pay out multiple grant recipients from a treasury in one transaction.

### Revenue Sharing
Split revenue among partners, contributors, or stakeholders.

### Event Rewards
Pay speakers, volunteers, or participants after an event.
