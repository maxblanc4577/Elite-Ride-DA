# Stripe Integration Setup & Configuration Guide

This document serves as the single source of truth for all `sample_only` placeholder parameters and next steps required to complete and take your Stripe Checkout integration live.

---

## 1. Required `sample_only` Parameter Replacements

The `/api/create-checkout-session` endpoint in `server.ts` currently uses the following `sample_only` placeholder values:

| Parameter | Current Placeholder Value | Description & Replacement Instructions |
|---|---|---|
| `line_items[0].price` | `'price_1MOTLINEITEMSAMPLE'` | Replace with your actual Stripe Price ID from your [Stripe Dashboard > Product Catalog](https://dashboard.stripe.com/products) (e.g. `price_1Pxxxxxxxxxxxxxxxxxxxxxx`). You can also pass dynamic line items from your application request payload. |
| `success_url` | `${process.env.DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}` | Update to your preferred success route or keep this URL and ensure your frontend handles the `{CHECKOUT_SESSION_ID}` query parameter for post-payment confirmation and receipt generation. |
| `cancel_url` | `${process.env.DOMAIN}/cancel` | Update to your preferred cancellation/return route if riders or users decide not to complete Checkout. |
| `mode` | `'payment'` | Set to `'payment'` for one-time ride charges (current default) or `'subscription'` for recurring membership plans. Note: if switched to `'subscription'`, add `payment_method_collection: 'always'`. |

---

## 2. Environment Variables Configuration

Ensure the following variables are configured in your production hosting environment (or local `.env` file):

```env
# Stripe Secret Key (Server-only, do NOT expose to client)
STRIPE_SECRET_KEY=sk_test_... # or sk_live_... in production

# Stripe Publishable Key (Client-accessible)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_... # or pk_live_... in production

# Webhook Signing Secret (Optional, for asynchronous webhook verification)
STRIPE_WEBHOOK_SECRET=whsec_...

# Base Domain of your application
DOMAIN=https://your-domain.com
```

---

## 3. Fixed by UI Configuration Summary

The following parameters are configured with `fixed_by_ui` values in accordance with the Stripe Checkout Studio specification:

- **`ui_mode`**: `'hosted_page'` (Stripe Node SDK version `23.0.0` >= `21.0.0`)
- **`billing_address_collection`**: `'auto'`
- **`phone_number_collection`**: `{ enabled: false }`
- **`automatic_tax`**: `{ enabled: false }`
- **`allow_promotion_codes`**: `false`
- **`submit_type`**: `'auto'`
- **`integration_identifier`**: `'hosted_web_0001'`
- **`origin_context`**: `'web'`

---

## 4. Admin Console & Merchant Authentication

The platform administrator can now authenticate the Stripe Merchant gateway directly from the **Admin Console**:
1. Navigate to **Admin Console** in the top navigation or bottom links.
2. Select the **Stripe Merchant (Payment Auth)** tab.
3. Click **Instant Merchant Login** or enter your custom Stripe account credentials (`email`, `mode: live | test`).
4. Once authenticated, card processing is activated for ride bookings, 80% driver revenue share settlements are tracked, and Dominica 15% VAT tax invoices are generated.
