# BuildScope Pro AI v5.9 — Payments + Push Delivery

## Stripe payments
Implemented:
- Server creates PaymentIntent from trusted `payment_requests.amount`.
- Mobile only receives the client secret.
- Stripe React Native PaymentSheet button.
- Idempotency key per payment request.
- Stripe webhook updates `payment_requests` to paid/failed.
- Secret key and webhook secret remain server-side.

Stripe's official Payment Intents guidance says the PaymentIntent should be created on the server and its client secret passed to the client. For mobile payments, Stripe also warns that the amount should be decided server-side so a malicious client cannot choose its own price.

## Expo remote push
Implemented:
- Queue in `push_outbox`.
- Server worker reads queued messages.
- Sends to Expo Push API in batches.
- Stores Expo ticket id / failure message.
- Optional Expo access token.
- Existing app-side `getExpoPushTokenAsync` registration retained.

Run worker:
```bash
cd server
npm run push-worker
```

## Environment
Server:
```env
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
EXPO_ACCESS_TOKEN=... # optional depending on Expo push security setup
```

Mobile:
```env
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

## Still required
- Stripe account/configuration and webhook endpoint registration.
- Wrap the app root with StripeProvider using the publishable key.
- EAS/FCM Android push credentials.
- Physical-device payment/push tests.
