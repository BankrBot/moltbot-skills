# x402 Seller-Side Protocol Reference

### Core Concepts
x402 enables programmatic payments over HTTP using a simple request-response flow.

### Roles
* **Seller:** Service provider who monetizes APIs or content.
* **Buyer:** Client (human or AI agent) who pays for access.
* **Facilitator:** Handles payment verification and settlement (e.g., Coinbase Developer Platform).

### Network Identifiers (CAIP-2)
* **Base Mainnet:** `eip155:8453`
* **Base Sepolia:** `eip155:84532`
* **Solana Mainnet:** `solana:5eykt4UsFvtsXMf8A6t856s14Ssw264`
* **Solana Devnet:** `solana:EtWTRSbhJL1Z9io76y8Gq75Wh6XpGPk2`

### HTTP Headers

#### 1. PAYMENT-REQUIRED (Server to Client)
Sent with a 402 Payment Required status code.
**Format:** `scheme=<scheme>, price=<amount>, network=<network>, payTo=<address>, [description=<text>], [facilitator=<url>]`
**Example:** `scheme=exact, price=$0.01, network=eip155:8453, payTo=0x123..., facilitator=https://api.cdp.coinbase.com/v1/x402`

#### 2. PAYMENT-SIGNATURE (Client to Server)
Sent by the client when retrying the request after payment.
Contains the cryptographic proof of payment verified by the facilitator.

### Seller Implementation Flow
1. **Receive Request:** Client calls a protected endpoint.
2. **Challenge (402):** If no valid PAYMENT-SIGNATURE is present, return 402 Payment Required with the PAYMENT-REQUIRED header.
3. **Verify Payment:** When the client retries with PAYMENT-SIGNATURE, the server verifies the signature via the Facilitator.
4. **Grant Access:** If verification succeeds, return the requested resource.

### Bazaar Discovery Metadata
To enable discovery in the x402 Bazaar:
* **description:** Clear explanation of the endpoint.
* **mimeType:** Response format (e.g., application/json).
* **extensions.bazaar:** Discovery tags and categories.
