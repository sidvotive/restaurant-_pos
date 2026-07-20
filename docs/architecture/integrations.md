# Integrations

The platform integrates with external services and in-store hardware. Each integration is isolated behind an adapter/port so providers can be swapped without touching business logic.

## External services

| Integration        | Notes |
|--------------------|-------|
| **Payment Gateways** | QR/UPI/wallet/card capture and settlement. Provider-agnostic adapter. |
| **GST Invoice**    | Compliant tax invoicing (region-configurable). |
| **SMS**            | Transactional and marketing messaging. |
| **WhatsApp**       | Customer messaging (orders, offers, loyalty). |
| **Email**          | Receipts, reports, marketing. |
| **Food Delivery APIs** | Inbound orders from delivery marketplaces. |

## In-store hardware

| Integration        | Notes |
|--------------------|-------|
| **Barcode Scanner** | Item lookup, inventory. |
| **Thermal Printer** | Customer receipts. |
| **Kitchen Printer** | KOT (Kitchen Order Tickets) as a printer-based alternative/complement to KDS. |
| **Cash Drawer**    | Triggered on cash settlement. |
| **QR Ordering**    | Customer-facing QR menu & ordering. |

## Integration principles

1. **Adapter pattern** — each provider sits behind a stable internal interface (port). The Notifications, Payments, and Orders services own their respective adapters.
2. **Configurable per tenant** — credentials and provider selection are tenant/branch configuration, not hard-coded.
3. **Idempotency & retries** — outbound calls (payments, messaging) are idempotent and retried with backoff; inbound webhooks (delivery, payment status) are verified and de-duplicated.
4. **Failure isolation** — a failing integration degrades gracefully (e.g. queue messages for later delivery) rather than blocking core POS flow.

## Hardware connectivity

In-store hardware (printers, cash drawer, scanner) is typically reached via a local bridge/agent on the POS device or LAN, keeping device drivers off the cloud services. The cloud services emit print/open-drawer intents that the local bridge fulfils — consistent with the offline-capable POS design.
