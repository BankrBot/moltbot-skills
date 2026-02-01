---
name: clanker
description: Deploy ERC20 tokens on Base using Clanker SDK. Create tokens with built-in Uniswap V4 liquidity pools. Supports Base mainnet and Sepolia testnet. Requires PRIVATE_KEY in config.
metadata: {"clawdbot":{"emoji":"🪙","homepage":"https://clanker.world","requires":{"bins":["curl","jq","python3"]}}}
---

# Clanker Skill

Deploy ERC20 tokens on Base using the Clanker protocol with built-in Uniswap V4 liquidity pools.

## Setup

### 1. Configuration

Create a config file at `~/.clawdbot/skills/clanker/config.json`:

```json
{
  "mainnet": {
    "rpc_url": "https://1rpc.io/base",
    "private_key": "YOUR_PRIVATE_KEY"
  },
  "testnet": {
    "rpc_url": "https://sepolia.base.org",
    "private_key": "YOUR_TESTNET_PRIVATE_KEY"
  }
}
```

**Security:** Never commit your private key to version control. Use environment variables or a separate config file outside the repo.

### 2. Get Testnet ETH

For Base Sepolia testing, get free ETH from:
- https://cloud.base.org/faucet
- https://sepoliafaucet.com

**Note:** Faucet access may require:
- MetaMask or similar wallet installed
- Social login (GitHub, Twitter, etc.)
- Limited to 1-2 requests per day

### 3. Install Dependencies (for deployment)

For token deployment, install web3 Python package:

```bash
pip install web3
```

For read-only operations, only `curl`, `jq`, and `python3` are required.

## Usage

### Deploy a Token (Mainnet)

```bash
clanker.sh deploy "My Token" MYT 0.1
```

Deploys an ERC20 token with 0.1 ETH initial liquidity on Uniswap V4.

### Check Deployment Status

```bash
clanker.sh status <txhash>
```

Check if a deployment transaction was successful.

### Get Token Info

```bash
clanker.sh info <token-address>
```

Returns token name, symbol, total supply, and other details.

### Find Tokens by Deployer

```bash
clanker.sh get-token <deployer-address>
```

Find all tokens deployed by a specific address.

### Deploy to Testnet (Sepolia)

```bash
clanker.sh testnet-deploy "Test Token" TST
```

Deploy to Base Sepolia testnet for testing.

### Using Testnet Network

All commands support `--network testnet` flag:

```bash
# Check testnet status
clanker.sh status 0x1234... --network testnet

# Get testnet token info
clanker.sh info 0xabcd... --network testnet

# Find testnet tokens by deployer
clanker.sh get-token 0xdef0... --network testnet
```

## Commands Reference

| Command | Description | Parameters |
|---------|-------------|------------|
| `deploy` | Deploy token on mainnet | `<name> <symbol> <initial-lp-eth>` |
| `testnet-deploy` | Deploy to Sepolia testnet | `<name> <symbol>` |
| `status` | Check deployment status | `<txhash>` |
| `info` | Get token information | `<token-address>` |
| `get-token` | Find tokens by deployer | `<deployer-address>` |

## Examples

```bash
# Deploy a meme coin
./clanker.sh deploy "Base Dog" BDOG 0.05

# Check if deployment succeeded
./clanker.sh status 0x1234...5678

# Get info about a known token
./clanker.sh info 0xabcd...1234

# Find who deployed a token
./clanker.sh get-token 0xdef0...9876

# Test on Sepolia
./clanker.sh testnet-deploy "Test Meme" TMEME
./clanker.sh status 0xtxhash... --network testnet
```

---

## Testing Guide

### Step 1: Set Up Testnet Config

```bash
# Create config with testnet private key
cat > ~/.clawdbot/skills/clanker/config.json << 'EOF'
{
  "testnet": {
    "rpc_url": "https://sepolia.base.org",
    "private_key": "YOUR_TESTNET_PRIVATE_KEY"
  }
}
EOF
```

### Step 2: Get Testnet ETH

1. Visit https://cloud.base.org/faucet
2. Connect your wallet (MetaMask)
3. Request test ETH (0.001-0.01 ETH should be enough)

**Alternative faucets:**
- https://sepoliafaucet.com
- https://faucet.paradigm.xyz

### Step 3: Deploy a Test Token

```bash
# Deploy on testnet with 0.001 ETH initial liquidity
./clanker.sh testnet-deploy "Test Token" TST
```

Or with initial liquidity:

```bash
./clanker.sh deploy "Test Token" TST 0.001 --network testnet
```

### Step 4: Verify Deployment

1. **Check transaction status:**
   ```bash
   ./clanker.sh status <txhash> --network testnet
   ```

2. **Get token info:**
   ```bash
   ./clanker.sh info <token-address> --network testnet
   ```

3. **View on explorer:**
   - Open https://sepolia.basescan.org/tx/\<txhash\>
   - View token contract at https://sepolia.basescan.org/token/\<token-address\>

### Troubleshooting

**Transaction failed?**
- Check if you have enough ETH for gas
- Verify the Clanker factory contract is available on Sepolia
- Check network connectivity

**Cannot get testnet ETH?**
- Try alternative faucets
- Wait 24 hours between requests
- Check if wallet is connected correctly

**Private key errors?**
- Ensure key doesn't have "0x" prefix (or remove it if present)
- Check config file syntax is valid JSON

---

## Test Results

### Read-Only Operations ✅

| Command | Network | Result |
|---------|---------|--------|
| `info` (WETH) | mainnet | ✅ Works - Shows correct name, symbol, supply |
| `get-token` | mainnet | ✅ Works - Returns deployer stats |
| `status` | mainnet | ✅ Works - Handles pending/not found tx |

### Deployment ⚠️

| Feature | Status | Notes |
|---------|--------|-------|
| Python deployment helper | ⚠️ Placeholder | Requires Clanker factory address |
| Web-based deployment | ✅ Recommended | Use https://clanker.world |
| Direct contract call | 🔲 Not implemented | Would need factory ABI |

**Note:** Full deployment requires the actual Clanker factory contract address on Base Sepolia. The protocol is relatively new, and contract addresses may change. For production deployment, check the official documentation.

---

## Security Best Practices

1. **Never commit private keys** to version control
2. **Use separate keys** for testnet and mainnet
3. **Test on Sepolia first** before mainnet deployment
4. **Verify contract addresses** on official Clanker documentation
5. **Start with small ETH amounts** for initial liquidity
6. **Monitor deployed tokens** for unusual activity

## Resources

- **Official Website:** https://clanker.world
- **Documentation:** https://docs.clanker.world
- **GitHub:** https://github.com/clanker-world
- **Base Mainnet Explorer:** https://basescan.org
- **Base Sepolia Explorer:** https://sepolia.basescan.org

## Notes

- All deployments create tokens with built-in Uniswap V4 LP
- Initial LP ETH is required for liquidity bootstrapping
- Testnet deployments are free (no real funds, requires testnet ETH)
- Deployment may fail if Clanker contract is not available
- Check network connectivity if operations timeout
