---
title: "Prototyping Method's Claude Project Tracker — and shipping the product feedback instead"
slug: method-project-tracker
order: 5
company: "Method CRM"
role: "Business Solutions Specialist, Professional Services"
timeframe: "2026"
tags: ["Product Strategy", "Prototyping", "Product Feedback", "AI/LLM"]
categories: ["Product Strategy"]
summary: >
  Prototyped a human-in-the-loop project-tracking app inside Method's AI App
  Builder — a CRM record as the control surface for an agentic workflow — and
  turned the build process into structured, prioritized feedback for Method's
  own product team.
cover_image: ""
metrics:
  - value: "15+"
    label: "Defects/UX gaps reported to product team"
  - value: "3"
    label: "Entity types designed"
  - value: "Prototyped"
    label: "Status — not shipped to production"
phases:
  - id: problem-discovery
    label: "Problem Discovery"
    body: |
      Professional Services needed a way to track deliverable status against
      what was actually promised to a customer on a call — and to let Claude
      handle the routine automation around that (drafting follow-ups,
      summarizing scope, reviewing notes) without a rep having to manually
      re-trigger it every time. The record itself needed to be the control
      surface, not a separate tool a rep has to remember to open.

  - id: design
    label: "Design"
    body: |
      Designed three linked entities:

      - **Projects** — name, linked account, status, a **Claude Action**
        dropdown (Idle / Draft Follow-Up Email / Summarize Scope / Review
        Notes / Custom), a **Claude Notes** field where results get written
        back, and a source email thread reference
      - **Scope Items** (child of Project) — title, description, source
        (email/call notes/manual), priority, status
      - **Claude Activity Log** (child of Project, append-only) — action,
        result summary, agent name, timestamp

      An on-save webhook fires whenever `Claude Action` changes away from
      Idle, posting the project, account, action, and record ID.

      Two design choices mattered more than the rest: the **Claude Action
      dropdown is a human-assigned task queue** — the agent doesn't decide
      what to do next, the consultant does, a deliberate control boundary —
      and the **activity log is read-only by design**, a genuine audit trail
      rather than a field anyone can edit after the fact.

  - id: build-and-feedback
    label: "Build & Feedback"
    body: |
      Built the prototype directly in Method's internal AI App Builder and
      Next-Gen Screen Designer — and using the tools to build it surfaced
      **15+ specific defects and UX gaps**: a project name field stuck
      rendering as "Label 0" and uneditable from the detail screen, a customer
      field that didn't update the underlying entity after selection, address
      fields missing the address lookup tool, inconsistent button sizing, no
      undo in the screen designer, and lost drag-and-drop auto-formatting,
      among others.

      Wrote all of it up as structured, prioritized feedback and delivered it
      to Method's own product team — including a recommendation that the
      builder surface proposed next steps after generation, for the items a
      builder might not immediately understand how to fix.

  - id: outcome
    label: "Outcome"
    body: |
      The prototype validated the entity model and the human-in-the-loop
      control boundary — but it's a **prototype, not a shipped product**. The
      more durable output was the feedback: 15+ concrete, reproducible issues
      now in front of the people who own the App Builder, plus a workflow
      vision (project tracker as the frontend for background Claude
      automation, orchestrated across specialized agents) that folds into the
      larger PS Co-pilot platform concept this work was part of.
---
