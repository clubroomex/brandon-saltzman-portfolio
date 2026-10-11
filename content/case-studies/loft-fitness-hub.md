---
title: "Loft Fitness Hub — replacing Asana with an operating system shaped around a boutique studio"
slug: loft-fitness-hub
order: 7.5
company: "Loft Fitness Club"
role: "Product Owner & Builder"
timeframe: "2026"
tags: ["0→1", "Internal Tools", "AI-Assisted Development", "MCP", "Next.js", "Operations"]
categories: ["Founder & 0→1", "Product Strategy"]
summary: >
  Scoped and built Loft's internal hub (projects and tasks, marketing campaigns
  with approvals, team and role management, an Asana importer, studio KPIs from
  the booking system, and a ChatGPT/Claude connector), directing an AI coding
  agent from first commit to deployed app in two days.
cover_image: "case-studies/images/loft-fitness-hub/cover.png"
hero_image: "case-studies/images/loft-fitness-hub/board.jpg"
gallery:
  - src: case-studies/images/loft-fitness-hub/board.jpg
    alt: "Project board for the Danforth Reformer launch"
    caption: "Projects: board, list and calendar views, tagged by studio and team"
  - src: case-studies/images/loft-fitness-hub/task.jpg
    alt: "Task detail sheet with subtasks and comments"
    caption: "Task sheet with subtasks, comments and studio-time due dates"
  - src: case-studies/images/loft-fitness-hub/calendar.jpg
    alt: "Cross-campaign content calendar"
    caption: "Marketing: one content calendar across every campaign, channel and studio"
  - src: case-studies/images/loft-fitness-hub/approvals.jpg
    alt: "Content approvals queue"
    caption: "Approvals: content goes out only after a manager signs off"
  - src: case-studies/images/loft-fitness-hub/team.jpg
    alt: "Team and roles admin"
    caption: "Invite-only staff accounts with roles and studio access"
metrics:
  - value: "2 days"
    label: "First commit to deployed app"
  - value: "6"
    label: "Modules replacing Asana and spreadsheets"
  - value: "16"
    label: "Tools exposed to ChatGPT/Claude"
phases:
  - id: problem
    label: "Problem"
    body: |
      Loft runs two studios (Midtown and Danforth) with a small team of
      managers, marketing, front desk and instructors. Work lived in Asana,
      but Asana was built for software teams, not a studio:

      - **No studio dimension.** A launch at Danforth and a repair at Midtown
        looked the same, and nobody could filter work by location.
      - **Marketing had no real home.** Campaigns, the content inside them,
        and approvals were scattered across boards, docs and chat threads, so
        there was no single view of what was going out and when.
      - **Seat-based pricing didn't fit the team.** Instructors and front-desk
        staff need light, occasional access, and paying per seat for them
        made poor sense.
      - **Studio performance lived somewhere else.** Class and member numbers
        were in Mariana Tek, the booking system, so connecting operating
        decisions to results meant exporting data by hand. That's the same
        gap I'd closed with spreadsheets and API pulls in
        [my earlier work at Loft](loft-cycle-club.html).

  - id: decisions
    label: "Key Decisions"
    body: |
      - **Build, don't buy.** Off-the-shelf tools (Asana, Monday, ClickUp)
        each solved part of the problem, but none modelled studios, content
        approvals and booking data together. AI-assisted development made a
        purpose-built tool cheap enough to justify for a two-studio business.
      - **Migration as a first-class feature.** An Asana importer that can be
        re-run safely, bringing over teams, projects, sections, tasks,
        subtasks and comments. The switch had to cost the team nothing.
      - **Permissions designed around real roles.** Admin, Studio Manager,
        Marketing, Instructor and Front Desk each see and can do what their
        job needs. Rules are enforced on both the page and the server, not
        just hidden in the UI.
      - **Canadian data residency.** The database runs in Supabase's
        Canada (Central) region and the server runs in Montréal, so all data
        stays in Canada.
      - **Meet staff where they already work.** Staff can create projects,
        move tasks and check what's overdue from ChatGPT or Claude. The chat
        assistant acts as the signed-in person with that person's
        permissions, and every change is logged.
      - **Look like Loft.** The design matches loftcycleclub.com (slate-sage
        palette, Montserrat, square corners), so the tool feels like part of
        the brand rather than a generic SaaS.

  - id: build
    label: "Build"
    body: |
      I acted as product owner and directed an AI coding agent (Claude Code)
      through the build: writing the requirements, setting conventions,
      reviewing each change, and testing it in the running app before it
      shipped. Stack: Next.js, TypeScript, Postgres via Supabase, and
      Vercel.

      - **Projects and tasks:** a portfolio view, board, list and calendar
        views, subtasks, comments, and a personal "My Work" home showing
        what's overdue, due today and due this week across every project.
      - **Marketing:** a campaign pipeline, a content board for each
        campaign, a calendar across all campaigns filterable by channel and
        studio, and an approvals queue for managers.
      - **Team admin:** invite-only accounts (Google Workspace sign-in or a
        magic link), roles, studio access, teams, and an activity log.
      - **Studio KPIs:** a nightly sync from the Mariana Tek API feeding
        dashboards for seat fill, check-ins, no-shows, late cancels,
        time-slot demand, member growth, intro-offer conversion and revenue.
        Customer records are kept as booking-system IDs only, and revenue
        is restricted to admins.
      - **Chat connector:** a remote MCP server with OAuth 2.1 and a
        Loft-branded consent screen. Its 16 tools run the app's own actions,
        so validation, permissions and the activity log behave exactly as
        they do in the UI.
      - **Notifications:** branded emails built to render in Outlook, for
        new assignments, comments and approval requests. Nobody gets an
        email about their own action.

  - id: outcome
    label: "Outcome"
    body: |
      - Went from an empty repo to a deployed, invite-only app covering
        projects, marketing, team admin, KPIs and chat access **in two
        days**
      - Gave the studios a single place for work that had been split across
        Asana, docs, chat threads and booking-system exports, with work
        tagged by studio throughout
      - Put booking-system performance data next to the projects meant to
        move it, with no manual exports
      - Stated plainly: the app was just built, so there are no adoption or
        time-saved numbers yet. Email sending is wired up but not yet
        connected to Loft's Google Workspace.

      **What this shows about how I work:** I start with the operating
      problem, make the build-vs-buy call on cost, and treat AI coding
      tools as leverage on product judgment, not a replacement for it.
      Scope, permissions, data residency and migration were my decisions;
      the agent wrote the code.
---
