---
title: "ScoutAI — finding the basketball prospects standard stats miss"
slug: scoutai
order: 8
company: "ScoutAI"
role: "Founding Team Lead"
timeframe: "2022"
tags: ["0→1", "Sports Analytics", "Data Science", "Side Project"]
categories: ["Founder & 0→1", "Research"]
summary: >
  Coordinated a 3-person founding team to build a defensive impact statistic
  for basketball prospects — one that outperformed the league's standard
  advanced metric at identifying undervalued defenders.
cover_image: ""
metrics:
  - value: "3"
    label: "Founding team coordinated"
  - value: "4"
    label: "Skill categories modeled"
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
purpose-built statistic across the four core skill categories — defense, scoring,
playmaking, and rebounding — could surface players scouts were undervaluing. I
coordinated and organized a team of 3 founding members to pursue it.

## Approach

- Sourced data across multiple providers: national statistics databases,
  Basketball Reference, and NBA.com
- Found that player identities didn't reconcile cleanly across sources, so we
  built an internal player-profile database with fuzzy matching to resolve
  players before running any analysis
- Needed a way to weight each statistic's actual impact on winning — beta-tested
  candidate stats against players' historical performance versus their future
  earning potential, effectively selecting for which skills translated into
  dollars down the line
- Iterated separately on offensive and defensive statistics to see which held up
  under that test

## Outcome

- Offensive measures did **not** meaningfully outperform existing catch-all
  stats — we weren't able to surface new high-value offensive prospects beyond
  what scouts already saw
- Our defensive statistic **did** outperform the current gold standard (dBPM)
  at identifying players signaling as positive, higher-impact defenders
- The mechanism: we leveraged our strong offensive statistics to weight a
  defender's impact against the offensive players they faced, normalizing for
  team defense to isolate individual skill transfer
- Known limitation, stated plainly: the edge is early-career only — college
  defensive performance doesn't translate to the pros at a consistent rate
  across the broad sample of draftees and schools
