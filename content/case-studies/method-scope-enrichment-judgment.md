---
title: "The tool I scoped and chose not to build"
slug: method-scope-enrichment-judgment
order: 6
company: "Method CRM"
role: "Business Solutions Specialist, Professional Services"
timeframe: "2026"
tags: ["Product Judgment", "Problem Discovery", "Team Capacity"]
categories: ["Product Strategy"]
summary: >
  Fully scoped an AI tool to help senior consultants hand off scoped work to
  junior reps — then wrote down, before building it, why it likely wouldn't
  deliver, and didn't build it.
cover_image: ""
metrics:
  - value: "Scoped"
    label: "Status — deliberately not built"
  - value: "2×"
    label: "Padding multiplier still used in estimates"
  - value: "0"
    label: "Engineering hours spent building it"
phases:
  - id: problem-discovery
    label: "Problem Discovery"
    body: |
      > "The AI will miss context — most of the time needed here goes into
      > helping the rep complete the work, not scoping it."

      That's the doubt I wrote down before building anything, on a tool I'd
      already fully scoped. Here's the problem I was trying to solve, and why
      I ended up agreeing with my own skepticism.

      Handing off scoped work to junior reps or whoever had capacity was hard
      — which suppressed how much senior reps scoped and delegated at all, and
      capped how much project-manager-style growth was available to them.

      The real problem underneath it: senior consultants write terse,
      experience-based scope notes containing implicit Method CRM knowledge
      that newer reps don't have. "Add cost to work order" tells an
      experienced rep that's a currency field, not an integer; "add a field
      for Good or Great" implies a dropdown, not a checkbox; layout notes like
      "60/40 split, remove padding" assume conventions a new rep hasn't
      learned yet. None of that is written down anywhere a newer rep could
      look it up.

  - id: proposed-approach
    label: "Proposed Approach"
    body: |
      Take a senior rep's raw scope notes from a doc, enrich each item with
      step-by-step Method CRM implementation guidance and the account's prior
      work-order history for context, and produce a beginner-friendly scoped
      document a newer rep could execute — without first needing to know why
      each step works the way it does.

      Framed deliberately as a knowledge-transfer tool: the experience lives
      in the tool's embedded knowledge base, not locked in the senior rep's
      head.

  - id: the-judgment-call
    label: "The Judgment Call"
    body: |
      Before writing any code, I wrote down the case against my own idea:

      > "I still think the AI will miss context and most of the time needed
      > to spend on this goes into helping the rep complete the work, rather
      > than scoping. Likely still need calls to go over everything and run
      > with it."

      The tool would have enriched the scoping step — but the actual
      bottleneck was newer reps needing help *completing* the work, not
      understanding the notes. Solving the wrong half of the problem wasn't
      worth building. I left the spec in the roadmap, recorded the doubt next
      to it, and moved on. (Estimates in this org still carry a 2× padding
      multiplier on top of scoped time — a separate, blunter fix for the same
      underlying uncertainty.)

  - id: why-it-matters
    label: "Why It Matters"
    body: |
      Writing down why your own idea might not deliver, before spending
      engineering time on it, is rare — most "I used AI for X" lists only
      show what shipped. It's the same discipline I applied everywhere else
      in this program: tiered requirements, recorded limitations, verbatim
      negative feedback. Here it's applied one step earlier, to a build/no-build
      decision instead of a post-launch retro — which is a cheaper place to
      catch it.
---
