---
name: x402-payments
description: Integration and implementation of the x402 autonomous payment protocol. Use for monetizing APIs, setting up 402 Payment Required flows, verifying onchain stablecoin payments, and registering services with the x402 Bazaar discovery layer.
metadata: {"clawdbot":{"homepage":"https://docs.cdp.coinbase.com/x402/welcome","requires":{"bins":["curl","jq"]}}}
---

# x402 Payments Skill

This skill provides instructions for implementing the **x402 protocol** on the seller side to monetize APIs and digital content. x402 enables instant, automatic stablecoin payments directly over HTTP, allowing AI agents and autonomous clients to pay for services without accounts or API keys.

## Core Workflow for Sellers

### 1. Implementation Strategy
To monetize an endpoint, the server must handle the 402 challenge-response flow.

* **Challenge:** When a client requests a resource without payment, respond with `402 Payment Required`.
* **Headers:** Include the `PAYMENT-REQUIRED` header with pricing, network, and recipient details.
* **Verification:** When the client retries with a `PAYMENT-SIGNATURE`, verify it against an x402 Facilitator.

### 2. Using Middleware (Recommended)
The easiest way to implement x402 is via the official SDK middleware.

* **Node.js (Express):** Use `@x402/express`.
* **Python (FastAPI/Flask):** Use `x402-python`.
* **Go:** Use `github.com/coinbase/x402-go`.

See `references/protocol_specs.md` for detailed header formats and network IDs.

## Service Discovery (Bazaar)
To make your services discoverable by AI agents, include metadata in your x402 configuration:

* Set `extensions.bazaar.discoverable: true`.
* Provide a clear description and category.
* AI agents use the Bazaar to find and pay for tools dynamically.

## Quick Reference
* **Facilitator (Testnet):** `https://x402.org/facilitator` (Base Sepolia, Solana Devnet)
* **Facilitator (Mainnet):** `https://api.cdp.coinbase.com/v1/x402` (Requires CDP API Keys)
* **Supported Assets:** Primarily USDC and other stablecoins.

## Bundled Resources
* `references/protocol_specs.md`: Technical details on headers, status codes, and CAIP-2 network identifiers.
* `scripts/fastapi_seller_example.py`: A complete Python FastAPI example showing middleware integration and Bazaar metadata.
