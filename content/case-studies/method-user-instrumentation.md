---
title: "Instrumenting seat growth at Method CRM — when the data contradicts the assumption"
slug: method-user-instrumentation
order: 3
company: "Method CRM"
role: "Business Solutions Specialist, Professional Services"
timeframe: "2026"
tags: ["Product Analytics", "Instrumentation", "Problem Discovery"]
summary: >
  Built the Professional Services org's first systematic view of customer seat
  movement — and used it to show that assumed organic growth wasn't actually
  happening, redirecting the team's expansion strategy.
cover_image: ""
metrics:
  - value: "21"
    label: "Consultants instrumented org-wide"
  - value: "0 of 23"
    label: "Accounts growing seats"
  - value: "110.85%"
    label: "Q1 2026 growth attainment"
---

## Problem Statement

Professional Services tracked premium-tier seat growth as a single lagging number
per quarter, reported after the quarter had already closed. Consultants assumed
seat counts were expanding steadily as they grew their accounts — but nobody had
per-account, week-over-week visibility to confirm it. A single strong account could
mask stasis everywhere else, and there was no way to tell which situation was
actually true until it was too late to act on it.

## Rationale

A quarterly aggregate can't distinguish "broad-based growth" from "one account
carrying the whole number." If seat expansion wasn't happening organically across
the book, the team needed a deliberate motion to drive it — not a wait-and-see
report every three months. The only way to know which situation applied was to
stop trusting the aggregate and build real per-account visibility.

## Approach

- Built and deployed a weekly seat-tracking instrumentation system across a
  **21-consultant** Professional Services org — every consultant gets their own
  dated snapshot, generated on the same recurring cadence
- Computed per-account deltas, trend classification (growing / stable /
  declining), and decline-streak detection directly from raw seat data
- Cleaned the underlying data for known distortions — duplicate restore-accounts
  inflating totals, and customers split across multiple account records — before
  drawing any conclusions from it
- This was the org's first systematic view of seat movement at all; previously
  the only signal was the quarterly aggregate

## Outcome

- The instrument surfaced near-total stasis: **19 of 23 accounts showed zero seat
  change over a full month, zero accounts were growing, and the book had net
  eroded by 8 seats**
- That finding overturned the working assumption that seat growth was happening
  organically — establishing that expansion needed a deliberate motion, not
  passive account management
- Q1 2026 growth did hit **110.85% of target** (235 vs. 212) — the one real
  growth quarter in the data — but Q2 and Q3 flattened and then declined
  (235 → 222), which this instrumentation caught directly rather than waiting
  for the next quarterly readout
- ~236 licensed seats under active management (net of duplicate restore
  accounts) across ~19 distinct customers

I'd rather report "here's what's actually happening and it contradicts what we
assumed" than a growth number that doesn't hold up past one quarter — the
finding was more useful to the team than a vanity metric would have been.
