---
title: "Clubhouse Exchange — the trusted marketplace for used golf gear"
slug: clubhouse-exchange
order: 1
company: "Clubhouse Exchange"
role: "Founder & Builder"
timeframe: "2026–present"
tags: ["0→1", "Founder", "Marketplace", "AI Product"]
summary: >
  Built an AI-powered peer-to-peer marketplace to replace the clunky, fragmented
  experience of buying and selling used clubs on eBay and Facebook Marketplace.
cover_image: ""
metrics:
  - value: "TODO"
    label: "Active listings"
  - value: "TODO"
    label: "GMV / sales"
  - value: "TODO"
    label: "Registered users"
---

## Problem Statement

The used golf equipment market is large but fragmented and low-trust. Sellers list on
eBay or Facebook Marketplace, where buyers can't verify condition claims, pricing is
inconsistent and often mispriced, and there's no golf-specific context (club fitting,
specs, condition grading) built into the transaction. The result: friction on both
sides and a worse deal for everyone than the size of the market should allow.

## Rationale

Golf gear is expensive and depreciates in a predictable, well-understood way — which
makes it a good fit for AI-assisted pricing and condition assessment. General
marketplaces treat golf clubs like any other used good; a golf-specific platform can
bake in the domain knowledge (condition scale, fitting data, brand/model specs) that
generic platforms never will, and use that as the trust layer buyers and sellers are
missing.

## Approach

Built and shipped a full-stack marketplace as a solo/lean-team founder, end to end:

- Next.js 15 / TypeScript / Prisma / PostgreSQL production app, with Stripe for
  payments and NextAuth for auth
- AI-assisted pricing suggestions and a standardized condition scale (Like New /
  Excellent / Good / Fair / Poor) to replace subjective, inconsistent listings
- Seller Hub covering listing creation, offer/negotiation management, and messaging
  in one flow
- iOS/Android app via Capacitor on top of the same web codebase
- Internal owner-only sourcing dashboard that scores live third-party listings
  against historical sold prices to surface underpriced inventory for flipping
- Ongoing UX audit process (competitor benchmarking, structured findings,
  implementation specs) to keep closing the gap with larger, better-funded
  marketplaces

## Outcome

TODO: replace with real, specific results — e.g. GMV to date, number of completed
transactions, seller/buyer growth, time-to-sell vs. eBay/FB Marketplace, repeat usage
rate, or any press/user testimonials worth quoting.

<!-- To add images: drop files in content/case-studies/images/clubhouse-exchange/
     and reference them here, e.g. ![Seller Hub dashboard](/assets/case-studies/images/clubhouse-exchange/seller-hub.png) -->
