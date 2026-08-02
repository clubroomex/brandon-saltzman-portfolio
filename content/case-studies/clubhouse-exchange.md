---
title: "Clubhouse Exchange — the trusted marketplace for used golf gear"
slug: clubhouse-exchange
order: 1
company: "Clubhouse Exchange"
role: "Founder & Builder"
timeframe: "2026–present"
tags: ["0→1", "Founder", "Marketplace", "AI Product"]
categories: ["Founder & 0→1", "Growth & RevOps"]
summary: >
  Built an AI-powered peer-to-peer marketplace to replace the clunky, fragmented
  experience of buying and selling used clubs on eBay and Facebook Marketplace.
cover_image: "case-studies/images/clubhouse-exchange/logo.png"
gallery:
  - src: "case-studies/images/clubhouse-exchange/flip-dashboard-analytics.png"
    alt: "Flip Sourcing Dashboard — Sales & Profit analytics view"
    caption: "The reseller sourcing dashboard's Sales & Profit view — cumulative profit and monthly revenue/cost/profit, built from the user-zero flip operation described in Outcome (snapshot from an earlier point in the operation; see Outcome for current figures)"
metrics:
  - value: "35"
    label: "Completed sales since Jan launch"
  - value: "≈55%"
    label: "On-platform sell-through"
  - value: "63%"
    label: "Margin on user-zero flips"
phases:
  - id: research
    label: "Research"
    body: |
      The used golf equipment market is large but fragmented and low-trust. Sellers
      list on eBay or Facebook Marketplace, where buyers can't verify condition
      claims, pricing is inconsistent and often mispriced, and there's no
      golf-specific context (club fitting, specs, condition grading) built into the
      transaction. The result: friction on both sides and a worse deal for everyone
      than the size of the market should allow.

      Golf gear is expensive and depreciates in a predictable, well-understood way —
      which makes it a good fit for AI-assisted pricing and condition assessment.
      General marketplaces treat golf clubs like any other used good; a golf-specific
      platform can bake in the domain knowledge (condition scale, fitting data,
      brand/model specs) that generic platforms never will, and use that as the trust
      layer buyers and sellers are missing.

  - id: competitive-analysis
    label: "Competitive Analysis"
    body: |
      Mapped and weighted 19 competitors across five categories — golf-specific
      marketplaces, sports C2C platforms, horizontal marketplaces (eBay, Facebook
      Marketplace), premium-curated resale (StockX, GOAT), and AI-assisted resale
      (The RealReal, Vestiaire) — scoring each on golf focus, peer-to-peer model,
      price-range fit, and existing AI-pricing tooling to decide which ones were
      worth a full flow-by-flow teardown.

      Ran browsing/selling/buying/nav/signup teardowns on the highest-priority set
      and synthesized 15 cross-competitor findings. Three shaped the product
      directly:

      - **Every high-priority competitor leads sellers with an instant quote or
        value guide before they commit to shipping anything** — the universal entry
        point for seller acquisition in this market. That's the case for building
        AI-assisted pricing suggestions as the first step of the seller flow, not a
        later add-on.
      - **Condition grading is the top purchase-decision factor buyers cite**, and
        every golf-specific competitor uses one — ranging from 3 tiers (2nd Swing)
        to 6 (GlobalGolf) to letter grades (3balls), none of them standardized well.
        That range is exactly what the 5-tier Like New / Excellent / Good / Fair /
        Poor scale in Product & Build is built to fix.
      - **The largest structural gap in the whole set**: not one golf-specific
        competitor runs a true peer-to-peer model where sellers set their own price
        and deal with buyers directly — they're all consignment or brand-operated
        retail. GolfWRX's forum classifieds come closest, with no payment
        protection or modern UX. That gap is the reason Clubhouse Exchange is
        peer-to-peer at all, not a consignment shop.

      Also worth naming what *not* to build: off-platform payment (GolfWRX, eBay,
      and Facebook Marketplace all showed real fraud/dispute exposure this way),
      unfiltered inventory dumps that create discovery paralysis (GlobalGolf,
      eBay), and high-friction seller entry barriers (GolfWRX requires 75 forum
      posts before you can even list).

      Golfstix — the highest-weighted competitor, self-positioned as "the StockX of
      Golf" — was the closest direct validation: its AI-powered fit-matching and
      instant-offer trade-in tool confirmed AI-assisted pricing was the right
      technical bet for this market, not a nice-to-have.

  - id: build
    label: "Product & Build"
    body: |
      Built and shipped a full-stack marketplace as a solo/lean-team founder, end
      to end:

      - Next.js 15 / TypeScript / Prisma / PostgreSQL production app, with Stripe
        for payments and NextAuth for auth
      - AI-assisted pricing suggestions and a standardized condition scale (Like
        New / Excellent / Good / Fair / Poor) to replace subjective, inconsistent
        listings
      - Seller Hub covering listing creation, offer/negotiation management, and
        messaging in one flow
      - iOS/Android app via Capacitor on top of the same web codebase
      - Internal owner-only sourcing dashboard that scores live third-party
        listings against historical sold prices to surface underpriced inventory
        for flipping
      - Ongoing UX audit process (competitor benchmarking, structured findings,
        implementation specs) to keep closing the gap with larger, better-funded
        marketplaces

  - id: outcome
    label: "Outcome"
    body: |
      Since launching in January 2026:

      - **35 completed sales from 45 unique listings** — 25 on-platform and 10
        cross-channel — an on-platform sell-through rate of roughly 55%, strong
        for an early-stage marketplace
      - **33 registered entities** and ~300 unique page views in the last 30 days,
        driven by two multi-channel campaigns (email flow, LinkedIn,
        TikTok/Instagram); the LinkedIn campaign alone drove ~300 page views
        during its run
      - **First complete fitting-and-procurement client** — validating a service
        line beyond peer-to-peer listings
      - **User zero, profitably**: since March 2026, I've run a 15-unit resale
        operation through my own platform — $4,320 revenue, $2,724 profit, a
        63.1% margin — to learn the market firsthand, then productized that
        workflow into the reseller sourcing dashboard (inventory, P&L analytics,
        buy leads) now part of the product. 14 more units are in inventory with
        ~$1,290 of projected profit
---
