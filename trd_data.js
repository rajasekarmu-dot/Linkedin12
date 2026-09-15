// Comprehensive Knowledge Base extracted from Client_TRD.pdf
const TRD_DATA = {
  documentTitle: "TECHNICAL REQUIREMENTS DOCUMENT - AI-Powered Lead Funnel & Admin Assistant",
  subtitle: "Build Specification for Subcontractor",
  sourceProposalDate: "9 September 2026",
  issuedBy: "Ethan Teo, De AI Solutions Pte Ltd",
  preparedFor: "Subcontractor",
  apiKey: "AQ.Ab8RN6LaSygxx2BsO4mJ_W7UBs1BoQ8tiQxmqE5SgVSTPUIP1Q",

  sections: [
    {
      id: "sec-1",
      title: "1. Purpose & Scope",
      content: `This document specifies the functional requirements for the AI-driven lead funnel and admin assistant workflow described in the client proposal "AI-Powered Lead Funnel & Admin Assistant Proposal" (9 September 2026) and the accompanying quotation (11 September 2026), prepared for the client, a Coach, for build-out by a subcontractor on behalf of De AI Solutions Pte Ltd.
The subcontractor is responsible for building, integrating, and deploying the AI agent and its supporting automation so that it executes the workflow defined in Section 5 without manual intervention beyond the human checkpoints explicitly called out below.
Out of scope: the client's own LinkedIn content writing and posting, and the coffee meetings and coaching/introductory sessions themselves, are manual, offline activities performed by the client and are shown in the workflow diagram only for context.`
    },
    {
      id: "sec-2",
      title: "2. Actors & Roles",
      content: `● Lead / Prospect: Engages with the client's LinkedIn call-to-action; converses with the AI agent on WhatsApp; books and attends the $10 introductory session.
● AI Agent: The system to be built by the subcontractor. Qualifies leads on WhatsApp, books sessions, logs contacts and follow-ups, sends reminders and digests, and drafts admin items for the client's review.
● User (Client): Coach. Publishes LinkedIn content, holds coffee meetings and sessions, reviews and approves drafts, and confirms contacts and follow-ups via chat.`
    },
    {
      id: "sec-3",
      title: "3. System Components",
      content: `● Hosted AI agent runtime — De AI Solutions-hosted infrastructure (no on-site hardware or Mac mini required).
● WhatsApp Business integration — for lead engagement, qualification, and ongoing chat-based instructions from the client.
● LinkedIn CTA routing — comment-keyword or WhatsApp-button mechanism connecting LinkedIn posts to the WhatsApp agent.
● Calendar integration — Calendly or Google Calendar (to be confirmed) for direct session booking.
● Contact & pipeline data store — tracks each contact through New Contact → Coffee Meeting → $10 Session → Active Client, with follow-up dates.
● Notification/reminder layer — proactive follow-up reminders and a weekly relationship-review digest.
● Chat-based admin drafting — emails, proposals, and session notes, queued for the client's review before sending.
● Automation/orchestration layer connecting the above into a single pipeline.
● PDPA-conscious data handling, with export/return of all data to the client if the engagement ends.`
    },
    {
      id: "sec-4",
      title: "4. Workflow Steps",
      content: `Step 1: Client publishes a LinkedIn post with a comment/WhatsApp CTA.
Step 2: Interested reader clicks/comments, routed to WhatsApp.
Step 3: Agent answers questions about the $10 session, builds trust.
Step 4: Agent books session into calendar, confirms with lead.
Step 5: After a meeting, client messages agent to log the contact.
Step 6: Agent logs contact, topic & follow-up date; updates pipeline stage.
Step 7: Agent proactively reminds client when a follow-up is due.
Step 8: Weekly digest lists anyone not contacted in 4-6 weeks.
Step 9: Client asks agent to draft an email, proposal, or session notes.
Step 10: Agent prepares draft for client's review.
Step 11: Client approves; agent handles file/spreadsheet updates in background.
Step 12: Agent sends WhatsApp follow-up to old leads after weeks/months.`
    },
    {
      id: "sec-5",
      title: "5. Functional Requirements (REQ-01 to REQ-09)",
      content: "Detailed requirements breakdown for all 9 core functional modules."
    },
    {
      id: "sec-6",
      title: "6. Data & Integration Requirements",
      content: `● WhatsApp Business API (or equivalent) access — number/SIM setup to be confirmed.
● LinkedIn CTA mechanism — comment-keyword automation tool or WhatsApp click-to-chat link.
● Calendar API access (Calendly or Google Calendar — to be confirmed), scoped to the client's calendar.
● Persistent storage for contact and pipeline records, with pipeline stage and follow-up date tracked per REQ-04 through REQ-06.
● Chat-based admin request handling (REQ-07), with draft/approval state tracking.
● PDPA-conscious data handling, with a data export/return mechanism if the engagement ends.`
    },
    {
      id: "sec-7",
      title: "7. Non-Functional Requirements",
      content: `● Hosting: fully hosted on De AI Solutions' own infrastructure — no server, Mac mini, or on-site hardware required from the client.
● Human-in-the-loop: no email, proposal, or session note may be sent externally without passing through the client's review and approval (REQ-07).
● Reliability: the agent should recover gracefully from a dropped WhatsApp connection without losing an in-progress lead or contact record.
● Term: the engagement is ongoing, month-to-month, with no lock-in contract — the client may pause or end it at any time.
● Data retention: contact and lead records are retained for the duration of the engagement; all data is returned to the client if the engagement ends (PDPA-conscious).`
    },
    {
      id: "sec-8",
      title: "8. Deliverables",
      content: `● Configured WhatsApp AI agent covering REQ-01, REQ-02, REQ-03.
● Configured contact tracker and notification logic covering REQ-04, REQ-05, REQ-06.
● Automated WhatsApp re-engagement messaging for old/stale leads covering REQ-09.
● Chat-based admin drafting workflow covering REQ-07, REQ-08.
● End-to-end tested workflow from first LinkedIn engagement through to a logged, followed-up contact.
● Brief handover documentation covering configuration, credentials/access, and how to update the qualifying script or CTA mechanism.`
    },
    {
      id: "sec-9",
      title: "9. Open Items for Subcontractor to Confirm",
      content: `● Whether the client will use a separate business SIM/number for WhatsApp Business, or needs advice on setting one up.
● Calendar system: Calendly (current tool) or Google Calendar.
● 2–3 example LinkedIn posts from the client, so the CTA and agent tone match their existing voice.
● Topics or questions the agent should escalate directly to the client during the WhatsApp conversation.
● Whether a performance-based add-on (e.g. a small fee per converted $10 session) will be layered on top of the flat monthly fee.
● Stale-lead threshold (how many weeks/months of inactivity before a re-engagement message goes out) and the wording of that follow-up message (REQ-09).`
    }
  ],

  requirements: [
    {
      id: "REQ-01",
      title: "LinkedIn CTA Routing",
      trigger: "The client publishes a LinkedIn post promoting their coaching services with a call-to-action (comment keyword or WhatsApp button).",
      inputs: "LinkedIn post content; CTA mechanism (comment-automation tool or WhatsApp click-to-chat link).",
      agentActions: "Interested readers who engage the CTA are routed directly into a WhatsApp conversation with the AI agent.",
      output: "New WhatsApp conversation opened with a qualified inbound lead.",
      notes: "Exact CTA mechanism and 2–3 example LinkedIn posts are not yet confirmed — see Section 9."
    },
    {
      id: "REQ-02",
      title: "WhatsApp Lead Engagement",
      trigger: "Lead messages the WhatsApp agent after clicking the LinkedIn CTA.",
      inputs: "Inbound WhatsApp message; lead's questions about the $10 introductory session.",
      agentActions: "Agent answers basic questions about the offer, drawing on the client's existing credibility materials to build trust.",
      output: "Lead ready to book, or flagged for the client if the conversation touches a topic outside the agent's scope.",
      notes: "Topics/questions the agent should escalate directly to the client are not yet defined — to be confirmed with the client before build."
    },
    {
      id: "REQ-03",
      title: "Session Booking",
      trigger: "Lead confirms interest in the $10 introductory session.",
      inputs: "Lead's availability; the client's calendar (Calendly or Google Calendar).",
      agentActions: "Agent books the session directly into the client's calendar and confirms the booking with the lead.",
      output: "Session booked; confirmation sent to the lead.",
      notes: "Calendar system (Calendly vs. Google Calendar) to be confirmed — see Section 9."
    },
    {
      id: "REQ-04",
      title: "Contact Logging",
      trigger: 'The client sends the agent a short message after a coffee meeting or session (e.g. "Met John today, follow up in 3 months").',
      inputs: "The client's message; contact name, topic discussed, follow-up date.",
      agentActions: "Agent logs the contact, topic, and follow-up date, and moves the contact through the pipeline (New Contact → Coffee Meeting → $10 Session → Active Client).",
      output: "Contact record created or updated in the tracker.",
      notes: "No spreadsheet required — the agent maintains the tracker directly."
    },
    {
      id: "REQ-05",
      title: "Follow-Up Reminders",
      trigger: "A logged follow-up date is reached.",
      inputs: "Contact record follow-up date (from REQ-04).",
      agentActions: "Agent proactively reminds the client that the follow-up is due.",
      output: "Reminder sent to the client.",
      notes: "Proactive alert delivered directly via WhatsApp / system notification."
    },
    {
      id: "REQ-06",
      title: "Weekly Relationship-Review Digest",
      trigger: "Scheduled weekly interval.",
      inputs: "Contact tracker records; last-contacted dates.",
      agentActions: "Agent compiles a digest listing anyone not contacted in the last 4–6 weeks.",
      output: "Weekly digest sent to the client.",
      notes: "Ensures no key relationship falls through the cracks."
    },
    {
      id: "REQ-07",
      title: "Admin Drafting",
      trigger: "The client asks the agent (by chat) to draft a routine email, proposal, or session notes.",
      inputs: "The client's instruction; relevant contact/session context from the tracker.",
      agentActions: "Agent prepares a draft and sends it to the client for review.",
      output: "Draft ready for the client's approval.",
      notes: "No draft is sent externally without passing through the client's review — human-in-the-loop checkpoint."
    },
    {
      id: "REQ-08",
      title: "Background File & Spreadsheet Automation",
      trigger: "Ongoing — triggered by related workflow events (e.g. a new contact logged, a session booked).",
      inputs: "Existing files/spreadsheets the client currently updates manually.",
      agentActions: "Agent handles repetitive file-copying and spreadsheet updates in the background.",
      output: "Files and spreadsheets kept current without manual effort from the client.",
      notes: "Automated background sync layer."
    },
    {
      id: "REQ-09",
      title: "Automated Re-Engagement of Stale Leads",
      trigger: "A lead or contact has not progressed or been contacted for a set period (a few weeks to a few months).",
      inputs: "Contact tracker records; last-contacted date; stale-lead threshold (to be defined).",
      agentActions: "Agent sends a WhatsApp follow-up message directly to the old lead to re-engage them, referencing their prior contact context.",
      output: "Follow-up message sent to the lead; any reply is routed back into the funnel and logged against the contact record.",
      notes: "Follow-up cadence/threshold and message content are to be confirmed before build."
    }
  ],

  sampleLeads: [
    { id: 1, name: "Sarah Jenkins", stage: "New Contact", lastContact: "2026-09-10", notes: "Engaged from LinkedIn post on leadership strategy.", followUpDate: "2026-09-18" },
    { id: 2, name: "Michael Chang", stage: "Coffee Meeting", lastContact: "2026-09-02", notes: "Met at downtown cafe. Discussed executive coaching.", followUpDate: "2026-09-20" },
    { id: 3, name: "Elena Rostova", stage: "$10 Session", lastContact: "2026-09-12", notes: "Attended $10 intro session. Super interested in monthly retainer.", followUpDate: "2026-09-16" },
    { id: 4, name: "David K.", stage: "Active Client", lastContact: "2026-08-25", notes: "Onboarding completed. Bi-weekly coaching ongoing.", followUpDate: "2026-09-22" },
    { id: 5, name: "Amanda Lee", stage: "Stale Lead", lastContact: "2026-07-15", notes: "No response after intro questions. Target for REQ-09 re-engagement.", followUpDate: "2026-09-14" }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = TRD_DATA;
}
