---
title: "ScoutAI — finding the basketball prospects standard stats miss"
slug: scoutai
order: 8
company: "ScoutAI"
role: "Founding Team Lead"
timeframe: "2023–2024"
tags: ["0→1", "Sports Analytics", "Data Science", "Side Project", "Python"]
categories: ["Founder & 0→1", "Research"]
summary: >
  Coordinated a founding team to build a data pipeline and machine-learning
  model that scores basketball prospects across four skill categories and
  projects how their college production translates to the pro game — with
  a defensive signal that outperformed the league's standard advanced metric
  at identifying undervalued defenders.
cover_image: "case-studies/images/scoutai/cover.png"
metrics:
  - value: "4"
    label: "Skill categories modeled"
  - value: "20+ yrs"
    label: "Of NBA/NCAA data pipelined"
  - value: "Beat dBPM"
    label: "On defensive prospect signal"
---

## Problem Statement

Standard basketball statistics give a limited view into a single player's true
impact on the game — especially on defense — which means undervalued players and
prospects across the NBA and NCAA can fall through the cracks of conventional
scouting.

## Rationale

If existing catch-all stats were missing lower-tier players and prospects, a
purpose-built statistic across the four core skill categories — shooting,
finishing, playmaking, and defense — could surface players scouts were
undervaluing. I coordinated a founding team to pursue it.

## Approach

- Built a data pipeline pulling 20+ years of shooting, advanced, and per-100
  box-score stats from Basketball-Reference plus player-combine measurements
  (height, wingspan, standing reach) from NBA.com, merged into one player
  profile per season, later extended with NBA.com tracking data (drives,
  passing, touches, shot-location efficiency)
- Found that player identities didn't reconcile cleanly across sources, so we
  built an internal player-profile database with fuzzy matching to resolve
  players before running any analysis
- Rather than one blended statistic, modeled each of the four skill categories
  independently: every raw stat is converted to a percentile against its
  position group (guards / forwards / centers), then a small set of the
  highest-signal percentiles are hand-weighted into a 0–1 skill score —
  isolating, for example, a shooter's value from a rim-finisher's
- Layered a machine-learning model (a small neural net trained on the
  historical relationship between a player's physical/box-score profile and
  their skill scores) on top of the scoring system, so the same scores can be
  **projected for a draft prospect from college stats alone** — turning it
  from a retrospective grading system into a forward-looking scouting tool
- Iterated separately on offensive and defensive skill scores to see which
  held up when back-tested against players' actual career outcomes

## Outcome

- Offensive measures did **not** meaningfully outperform existing catch-all
  stats — we weren't able to surface new high-value offensive prospects beyond
  what scouts already saw
- Our defensive statistic **did** outperform the current gold standard (dBPM)
  at identifying players signaling as positive, higher-impact defenders, per
  a backtest run outside the shared codebase
- The mechanism: we leveraged our strong offensive statistics to weight a
  defender's impact against the offensive players they faced, normalizing for
  team defense to isolate individual skill transfer — logic that also lives
  outside the shared codebase
- Known limitation, stated plainly: the edge is early-career only — college
  defensive performance doesn't translate to the pros at a consistent rate
  across the broad sample of draftees and schools

Code: [github.com/luke-j-m/ScoutAI](https://github.com/luke-j-m/ScoutAI)
