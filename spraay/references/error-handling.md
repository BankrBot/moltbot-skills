# Error Handling Reference

## Common Errors

### Insufficient Balance

**Error**: `Insufficient ETH balance` or `Insufficient token balance`

**Cause**: Sender doesn't have enough funds to cover all recipient amounts + 0.3% fee + gas.

**Fix**:
1. Check balance: `scripts/spraay.sh "Check my ETH balance on Base"`
2. Calculate needed: total amounts + (total * 0.003) + ~0.001 ETH for gas
3. Add funds if needed via Bankr: `"Bridge 1 ETH to Base"`

### Too Many Recipients

**Error**: `Recipient count exceeds maximum`

**Cause**: More than 200 recipients in a single transaction.

**Fix**:
1. Split recipients into batches of 200 or fewer
2. Execute multiple spray transactions
3. For very large distributions (1000+), use multiple CSV files

### Invalid Address

**Error**: `Invalid recipient address`

**Cause**: One or more addresses are malformed or zero address.

**Fix**:
1. Verify all addresses are valid 42-character hex strings (0x + 40 chars)
2. Check for typos or truncated addresses
3. Remove any zero addresses (0x0000...0000)

### Token Not Approved

**Error**: `ERC20: insufficient allowance`

**Cause**: Spraay contract hasn't been approved to spend the sender's tokens.

**Fix**:
1. Approve the Spraay contract: `"Approve Spraay to spend my USDC on Base"`
2. Ensure approval amount covers total + fee
3. Re-execute the spray

### Transaction Reverted

**Error**: `Transaction reverted`

**Cause**: Various — most commonly insufficient value sent or contract paused.

**Fix**:
1. Verify the correct value is being sent (amounts + fee)
2. Check if contract is paused: `scripts/spraay.sh "Is Spraay contract paused?"`
3. Check amounts are non-zero
4. Try with fewer recipients

### CSV Parse Error

**Error**: `Invalid CSV format`

**Cause**: CSV file doesn't match expected format.

**Fix**:
1. Ensure header row: `address,amount`
2. One recipient per line
3. No extra columns or whitespace
4. Valid addresses and numeric amounts
5. UTF-8 encoding, no BOM

### Gas Estimation Failed

**Error**: `Gas estimation failed`

**Cause**: Transaction would fail if submitted (usually a balance or approval issue).

**Fix**:
1. Verify sender balance covers total + fee + gas
2. For tokens, verify approval is sufficient
3. Reduce recipient count and retry
4. Check contract is not paused

## Debugging Steps

1. **Start simple**: Test with 2 recipients and small amounts
2. **Check balance**: Ensure sufficient funds
3. **Verify addresses**: All valid, no duplicates
4. **Check approvals**: For ERC-20 tokens
5. **Estimate first**: Use gas estimation before executing
6. **Check contract**: Verify contract address and chain

## Getting Help

- Check transaction on [BaseScan](https://basescan.org) for detailed revert reasons
- Review the Spraay contract source code on BaseScan
- Contact [@lostpoet](https://x.com/lostpoet) or [@plag](https://warpcast.com/plag) on socials
