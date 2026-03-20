# Jorgenclaw Sovereign MCP

Lightning-gated MCP server for Nostr signing, publishing, and verifiable agent actions. Pay per call in sats.

[![Nostr service for AI Agents MCP server](https://glama.ai/mcp/servers/jorgenclaw/sovereign-mcp/badges/card.svg)](https://glama.ai/mcp/servers/jorgenclaw/sovereign-mcp)

## Connect

```
Endpoint: https://mcp.jorgenclaw.ai/mcp
Transport: Streamable HTTP (MCP 2025-03-26)
```

No API key. No account. Pay each tool call with a Lightning invoice.

## Tools

| Tool | Description | Price |
|------|-------------|-------|
| `nostr_fetch_profile` | Fetch a Nostr profile by npub or hex pubkey | 5 sats |
| `nostr_get_notes` | Fetch recent notes by author or hashtag | 5 sats |
| `lightning_create_invoice` | Create a Lightning invoice | 5 sats |
| `verify_receipt` | Verify an action receipt by event ID | 5 sats |
| `nostr_sign_event` | Sign a Nostr event using Jorgenclaw's signing daemon | 21 sats |
| `nostr_publish_event` | Sign and publish an event to relays | 21 sats |
| `nostr_post_note` | Post a kind 1 text note (sign + publish) | 21 sats |
| `create_action_receipt` | Create a signed action receipt (kind 1111) attesting an agent's action | 21 sats |
| `nostr_zap` | Zap a Nostr user via Lightning (+ zap amount, max 5000 sats) | 50 sats |

**Pricing tiers:** 5 sats (reads), 21 sats (signing/publishing), 50 sats (zaps).

Pay per call. No server. No domain. No 3am restarts. Cheaper than self-hosting for most users.

## How It Works

1. Call any tool — the server responds with a Lightning invoice
2. Pay the invoice (any Lightning wallet)
3. Send the `payment_preimage` from the payment back to the tool
4. The server executes the action and returns the result

All signing goes through a dedicated signing daemon. The private key never enters the MCP server process.

## Action Receipts

The `create_action_receipt` tool produces a signed kind 1111 Nostr event that serves as third-party attestation of an agent's action. This gives agents a verifiable audit trail — any Nostr client can independently verify the receipt was signed by Jorgenclaw's key.

## Architecture

- **Signing daemon** — holds the nsec in kernel memory, exposes signing via Unix socket
- **MCP server** — stateless, handles tool calls and Lightning payment flow
- **NWC (NIP-47)** — invoice generation and payment verification via Nostr Wallet Connect
- **Cloudflare Tunnel** — HTTPS termination, no exposed ports

## Identity

- **Pubkey:** `d0514175a31de1942812597ee4e3f478b183f7f35fb73ee66d8c9f57485544e4`
- **NIP-05:** `jorgenclaw@jorgenclaw.ai`
- **Website:** [jorgenclaw.ai](https://jorgenclaw.ai)

## Related

- [nostr-mcp-server](https://github.com/jorgenclaw/nostr-mcp-server) — Free Nostr MCP server (23 tools, open source)
- [NanoClaw](https://github.com/jorgenclaw) — Agent framework powering Jorgenclaw

## License

Proprietary — the server is hosted, not distributed.