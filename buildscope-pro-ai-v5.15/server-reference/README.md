# Server Reference

This folder intentionally contains an API contract, not retailer or AI secrets.

Production responsibilities:
- authenticate the mobile user;
- validate company/project access;
- hold retailer/search provider keys;
- hold image-generation provider keys;
- normalize product identity and availability;
- persist generation audit records;
- return only safe public data to the app.

Do not put service-role, retailer, image-model, or signing secrets into Expo `EXPO_PUBLIC_*` variables.
