---
title: "AI call tooling at Method CRM — finding the systemic problem inside a consulting org"
slug: method-ai-call-tooling
order: 2
company: "Method CRM"
role: "Business Solutions Specialist, Professional Services"
timeframe: "2025–2026"
tags: ["Internal Product", "AI/LLM", "Problem Discovery", "Adoption"]
summary: >
  Identified that unstructured client-call handling was quietly costing Professional
  Services quality and capacity, then scoped and shipped the AI tooling that fixed it —
  now in production use by leadership, with measured results.
cover_image: ""
metrics:
  - value: "33% → 0%"
    label: "Unsatisfactory call rate, 9 weeks"
  - value: "+12.9"
    label: "Mean call score improvement"
  - value: "8–12 hrs/day"
    label: "Prep capacity created"
---

## Problem Statement

Client calls were the highest-leverage and least-instrumented part of Professional
Services. Call quality varied consultant to consultant with no mechanism to review,
benchmark, or improve it — coaching was anecdotal. And preparation barely existed:
proper pre-call research took 30–45 minutes per account against ~16 calls a day, which
in a fully billable org meant it simply didn't happen. Nobody walked in prepared,
because the time to prepare wasn't there.

## Rationale

These looked like two problems — inconsistent quality, missing preparation — but they
were two failures of the same missing capability: structured retrieval plus LLM
synthesis over systems the org already had (Zoom transcripts, Drive notes, CRM account
history, email). Solving that capability once could close both gaps. I also believed
the strongest case for AI inside a services org isn't replacing judgment but
instrumenting it: making quality visible and preparation free.

## Approach

Shipped a layered toolkit rather than a monolith, alongside a full billable load:

- **Call Audit Tool** — AI evaluation of call quality against a consistent rubric,
  closing the coaching feedback loop. Adopted by PS leadership for review.
- **Automated pre-call pipeline** — synthesizes transcripts, engagement notes, and live
  CRM history into a consolidated brief before every call, eliminating the 30–45
  minutes of manual research per account.
- **Skills library (14+)** — encoded the institutional knowledge that preparation
  depends on (diagnostics, health scoring, log triage, client communications) so it
  isn't locked in any one consultant's head.
- **MCP account-intelligence layer** — made internal client data queryable, powering
  automated health reports and the proactive flagging of 10+ client escalations.

## Outcome

Measured across audit data from launch (late May) through end of July 2026:

- Unsatisfactory call ratings fell from **33% to 0%**
- "Needs coaching or worse" fell from **56% to 21%**
- "Excellent" ratings went from zero in three early samples to **6 of 14 calls**
- Mean call score rose **12.9 points**
- The prep pipeline created **8–12 hours per day** of preparation capacity across the
  team — work that previously didn't happen at all

### Call quality across the audit period

<figure class="chart-embed">
  <div class="chart-legend">
    <span><span class="swatch" style="background:var(--chart-series-bad)"></span>Unsatisfactory calls</span>
    <span><span class="swatch" style="background:var(--chart-series-good)"></span>Excellent calls</span>
  </div>
  <svg viewBox="0 0 640 310" role="img" aria-label="Line chart: unsatisfactory call rate fell from 33% to 0%, and excellent call rate rose from 0% to 43%, across four sampled audit days from May 29 to July 30, 2026">
    <g style="stroke:var(--chart-grid);stroke-width:1">
      <line x1="40" y1="260" x2="580" y2="260"/>
      <line x1="40" y1="207.5" x2="580" y2="207.5"/>
      <line x1="40" y1="155" x2="580" y2="155"/>
      <line x1="40" y1="102.5" x2="580" y2="102.5"/>
      <line x1="40" y1="50" x2="580" y2="50"/>
    </g>
    <g style="fill:var(--chart-text);font-size:11px" text-anchor="end">
      <text x="34" y="264">0%</text>
      <text x="34" y="211.5">25%</text>
      <text x="34" y="159">50%</text>
      <text x="34" y="106.5">75%</text>
      <text x="34" y="54">100%</text>
    </g>
    <g style="fill:var(--chart-text);font-size:11px" text-anchor="middle">
      <text x="40" y="278">May 29</text>
      <text x="40" y="291">n=9</text>
      <text x="220" y="278">Jun 4</text>
      <text x="220" y="291">n=26</text>
      <text x="400" y="278">Jul 6</text>
      <text x="400" y="291">n=5</text>
      <text x="580" y="278">Jul 30</text>
      <text x="580" y="291">n=14</text>
    </g>
    <polyline points="40,190.1 220,171.2 400,176.0 580,260.0" style="fill:none;stroke:var(--chart-series-bad);stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
    <polyline points="40,260.0 220,260.0 400,260.0 580,169.9" style="fill:none;stroke:var(--chart-series-good);stroke-width:2;stroke-linecap:round;stroke-linejoin:round"/>
    <g style="fill:var(--chart-series-bad)">
      <circle cx="40" cy="190.1" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>May 29 (n=9): Unsatisfactory 33%</title></circle>
      <circle cx="220" cy="171.2" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jun 4 (n=26): Unsatisfactory 42%</title></circle>
      <circle cx="400" cy="176.0" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jul 6 (n=5): Unsatisfactory 40%</title></circle>
      <circle cx="580" cy="260.0" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jul 30 (n=14): Unsatisfactory 0%</title></circle>
    </g>
    <g style="fill:var(--chart-series-good)">
      <circle cx="40" cy="260.0" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>May 29 (n=9): Excellent 0%</title></circle>
      <circle cx="220" cy="260.0" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jun 4 (n=26): Excellent 0%</title></circle>
      <circle cx="400" cy="260.0" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jul 6 (n=5): Excellent 0%</title></circle>
      <circle cx="580" cy="169.9" r="4" style="stroke:var(--bg-elevated);stroke-width:2"><title>Jul 30 (n=14): Excellent 43%</title></circle>
    </g>
    <text x="586" y="264" style="fill:var(--chart-series-bad);font-size:12px;font-weight:600">0%</text>
    <text x="586" y="166" style="fill:var(--chart-series-good);font-size:12px;font-weight:600">43%</text>
  </svg>
  <figcaption>4 of ~35 audit days sampled directly (sample size noted under each date). Rubric is a 625-point weighted scale, stable across the period. Source: PS call-audit records, May–Jul 2026.</figcaption>
  <details>
    <summary>View underlying data</summary>
    <table>
      <thead><tr><th>Audit date</th><th>n</th><th>Unsatisfactory</th><th>Excellent</th><th>Mean score</th></tr></thead>
      <tbody>
        <tr><td>May 29</td><td>9</td><td>33.3%</td><td>0%</td><td>68.0%</td></tr>
        <tr><td>Jun 4</td><td>26</td><td>42.3%</td><td>0%</td><td>—</td></tr>
        <tr><td>Jul 6</td><td>5</td><td>40.0%</td><td>0%</td><td>69.7%</td></tr>
        <tr><td>Jul 30</td><td>14</td><td>0.0%</td><td>42.9%</td><td>80.9%</td></tr>
      </tbody>
    </table>
  </details>
</figure>

One detail I keep in the dataset on purpose: my own July 6 call scored Unsatisfactory
(56%) in my own system. A tool that grades its author honestly is worth more than a
clean sheet — and it's the reason leadership can trust the numbers above.

_Not shown: DEP signup volume declined over the same period (19 → 15 → 14 monthly),
and no PS revenue data exists to support a "hit targets every month" claim — both
checked against source data and left out rather than implied._
