# Product-Backed AI Design — v4.7

## Non-negotiable rule
A client-facing AI visualization must be tied to real product specifications.

Each visible finish/material should carry:
- Product name
- Brand
- Model or SKU when claiming an exact match
- Category
- Finish/color/size
- Estimated quantity/unit
- Retailer / where to buy
- Price and availability snapshot when known
- Match status: exact, equivalent, or pending
- Verification timestamp

## Approval gate
The database function `approve_product_backed_design` blocks approval when:
- any item is pending;
- an exact-match item lacks brand + model/SKU;
- an exact-match item lacks a retailer/source.

Equivalent products are allowed only when explicitly labeled as equivalent.

## Intended production flow
Real catalog product selection -> AI render constrained by selected products -> product reconciliation -> client review -> approval -> purchase list -> installation.

## Important
v4.7 creates the data model, validation and approval gate. It does NOT pretend to know current retailer inventory. Live product search/availability must be connected to retailer/catalog APIs or search services in production.
