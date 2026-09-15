// Main Application Logic for De AI Solutions Client TRD Chatbot
document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('page-title');
  const pageSubtitle = document.getElementById('page-subtitle');
  const messagesContainer = document.getElementById('messages-container');
  const chatForm = document.getElementById('chat-form');
  const userInput = document.getElementById('user-input');
  const promptChips = document.querySelectorAll('.prompt-chip');
  const clearChatBtn = document.getElementById('clear-chat-btn');
  const exportSummaryBtn = document.getElementById('export-summary-btn');

  // Explorer DOM Elements
  const reqSearch = document.getElementById('req-search');
  const docSectionsList = document.getElementById('doc-sections-list');
  const docDetailColumn = document.getElementById('doc-detail-column');

  // Simulator DOM Elements
  const leadSimChat = document.getElementById('lead-sim-chat');
  const simBookBtn = document.getElementById('sim-book-btn');
  const simEscalateBtn = document.getElementById('sim-escalate-btn');
  const coachInstruction = document.getElementById('coach-instruction');
  const runCoachCmdBtn = document.getElementById('run-coach-cmd-btn');
  const coachSimOutput = document.getElementById('coach-sim-output');
  const pipelineTableBody = document.getElementById('pipeline-table-body');
  const genDigestBtn = document.getElementById('gen-digest-btn');

  // App State
  let conversationHistory = [];
  let contacts = [...TRD_DATA.sampleLeads];

  // Initialize
  initNavigation();
  initExplorer();
  initSimulator();
  initChatInput();

  // Tab Navigation
  function initNavigation() {
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');
        
        navBtns.forEach(b => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(targetTab).classList.add('active');

        // Update titles
        if (targetTab === 'chat-tab') {
          pageTitle.textContent = "Client TRD Document AI Assistant";
          pageSubtitle.textContent = "Ask any question regarding technical requirements, system architecture, deliverables, or workflow steps.";
        } else if (targetTab === 'doc-tab') {
          pageTitle.textContent = "TRD Requirements Explorer";
          pageSubtitle.textContent = "Inspect technical specification modules REQ-01 through REQ-09 in detail.";
        } else if (targetTab === 'simulator-tab') {
          pageTitle.textContent = "Workflow & Lead Simulator";
          pageSubtitle.textContent = "Test the AI Agent lead qualification, contact logging, admin drafting, and digest pipeline.";
        }
      });
    });
  }

  // Chat Input Handling
  function initChatInput() {
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        chatForm.dispatchEvent(new Event('submit'));
      }
    });

    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = userInput.value.trim();
      if (!text) return;

      appendUserMessage(text);
      userInput.value = '';

      // Thinking indicator
      const thinkingId = appendThinkingMessage();

      try {
        const responseText = await queryGeminiOrEngine(text);
        removeThinkingMessage(thinkingId);
        appendAssistantMessage(responseText);
      } catch (err) {
        removeThinkingMessage(thinkingId);
        appendAssistantMessage(`I encountered an issue generating a response: ${err.message}. Showing local document context.`);
      }
    });

    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const query = chip.getAttribute('data-query');
        userInput.value = query;
        chatForm.dispatchEvent(new Event('submit'));
      });
    });

    clearChatBtn.addEventListener('click', () => {
      messagesContainer.innerHTML = `
        <div class="message system-msg">
          <div class="avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="message-content">
            <div class="sender">De AI Assistant</div>
            <p>Chat history reset. How can I assist you with <strong>Client_TRD.pdf</strong>?</p>
          </div>
        </div>
      `;
      conversationHistory = [];
    });

    exportSummaryBtn.addEventListener('click', () => {
      const summaryText = generateDocumentSummaryText();
      const blob = new Blob([summaryText], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Client_TRD_Executive_Summary.md';
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  function appendUserMessage(text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message user-msg';
    msgDiv.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-user"></i></div>
      <div class="message-content">
        <div class="sender">You</div>
        <p>${escapeHtml(text)}</p>
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    conversationHistory.push({ role: 'user', content: text });
  }

  function appendThinkingMessage() {
    const id = 'thinking-' + Date.now();
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant-msg';
    msgDiv.id = id;
    msgDiv.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="message-content">
        <div class="sender">De AI Assistant</div>
        <p><i class="fa-solid fa-circle-notch fa-spin"></i> Analyzing Client_TRD.pdf...</p>
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    return id;
  }

  function removeThinkingMessage(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }

  function appendAssistantMessage(htmlOrMarkdown) {
    const msgDiv = document.createElement('div');
    msgDiv.className = 'message assistant-msg';
    msgDiv.innerHTML = `
      <div class="avatar"><i class="fa-solid fa-robot"></i></div>
      <div class="message-content">
        <div class="sender">De AI Assistant</div>
        ${formatMarkdown(htmlOrMarkdown)}
      </div>
    `;
    messagesContainer.appendChild(msgDiv);
    scrollToBottom();
    conversationHistory.push({ role: 'assistant', content: htmlOrMarkdown });
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // AI Query Logic: Tries Gemini API endpoint, falls back to intelligent RAG Engine
  async function queryGeminiOrEngine(userQuery) {
    const apiKey = TRD_DATA.apiKey;
    
    // Check if user is asking for specific requirement
    const reqMatch = userQuery.match(/REQ-0[1-9]/i);
    
    // Construct System Context from TRD_DATA
    const systemPrompt = `You are an expert technical AI assistant representing De AI Solutions Pte Ltd for the document "Client_TRD.pdf" (AI-Powered Lead Funnel & Admin Assistant Technical Requirements Document).
Key document information:
- Issued by: Ethan Teo, De AI Solutions Pte Ltd
- Purpose: Build specification for subcontractor to deploy an AI agent on WhatsApp for a Coach client.
- Requirements: REQ-01 (LinkedIn CTA Routing), REQ-02 (WhatsApp Lead Engagement), REQ-03 (Session Booking), REQ-04 (Contact Logging), REQ-05 (Follow-Up Reminders), REQ-06 (Weekly Digest), REQ-07 (Admin Drafting), REQ-08 (Background Automation), REQ-09 (Automated Re-Engagement).
- Pipeline Stages: New Contact -> Coffee Meeting -> $10 Session -> Active Client.
- Non-functional: No Mac mini required, De AI hosted, human-in-the-loop for drafts (REQ-07), PDPA-conscious data return.
- Open items to confirm: WhatsApp SIM setup, Calendly vs GCal, example posts, escalation topics, performance fees, stale lead thresholds.

Answer the query accurately based on this knowledge. Use clear bullet points and bold highlights.`;

    // Try API fetch if internet available
    try {
      const apiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: ${userQuery}` }] }
          ]
        })
      });

      if (apiResponse.ok) {
        const data = await apiResponse.json();
        if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
          return data.candidates[0].content.parts[0].text;
        }
      }
    } catch (e) {
      console.warn("Direct API call fallback to Knowledge Engine:", e);
    }

    // Local Knowledge Engine fallback
    return generateKnowledgeEngineResponse(userQuery, reqMatch ? reqMatch[0].toUpperCase() : null);
  }

  function generateKnowledgeEngineResponse(query, reqCode) {
    const qLower = query.toLowerCase();

    if (reqCode) {
      const req = TRD_DATA.requirements.find(r => r.id === reqCode);
      if (req) {
        return `### 📌 Specification Details for **${req.id}: ${req.title}**

<div class="req-highlight-box">
  <p><strong>Trigger:</strong> ${req.trigger}</p>
  <p><strong>Inputs:</strong> ${req.inputs}</p>
  <p><strong>Agent Actions:</strong> ${req.agentActions}</p>
  <p><strong>Output:</strong> ${req.output}</p>
  <p><strong>Notes:</strong> ${req.notes}</p>
</div>

Need to see how this works in practice? Check out the **Workflow & Lead Simulator** tab!`;
      }
    }

    if (qLower.includes('summary') || qLower.includes('req-01 to req-09') || qLower.includes('all requirements')) {
      let res = `### 📋 Complete Requirements Breakdown (REQ-01 to REQ-09)\n\nHere is the matrix of all 9 requirements specified in Section 5 of **Client_TRD.pdf**:\n\n`;
      TRD_DATA.requirements.forEach(r => {
        res += `* **${r.id} (${r.title})**: ${r.agentActions} *(Output: ${r.output})*\n`;
      });
      res += `\n> **Key Principle**: No email or proposal is sent externally without the coach's review and approval (Human-in-the-Loop REQ-07).`;
      return res;
    }

    if (qLower.includes('open item') || qLower.includes('confirm') || qLower.includes('subcontractor')) {
      return `### ❓ Section 9: Open Items for Subcontractor to Confirm

Before build completion, the subcontractor must align with **Ethan Teo / De AI Solutions** on the following 6 open items:

1. **WhatsApp Business SIM/Number**: Whether client uses a separate business SIM or needs advice setting one up.
2. **Calendar System**: Calendly (client's current tool) vs Google Calendar.
3. **LinkedIn Content Voice**: 2–3 sample posts to align CTA & agent tone with the client's existing voice.
4. **Escalation Guidelines**: Specific topics/questions that the agent must escalate directly to the client.
5. **Fee Structure Add-on**: Confirm if a performance-based fee per converted $10 session will be added to the flat monthly fee.
6. **Stale Lead Threshold & Messaging**: Threshold duration (weeks/months) and exact wording for REQ-09 automated re-engagement.`;
    }

    if (qLower.includes('deliverable') || qLower.includes('scope') || qLower.includes('hosting')) {
      return `### 📦 Deliverables & Non-Functional Requirements

**Key Deliverables (Section 8):**
- Configured WhatsApp AI Agent (REQ-01, REQ-02, REQ-03)
- Configured Contact Tracker & Notification Logic (REQ-04, REQ-05, REQ-06)
- Automated Stale Lead Re-Engagement Messaging (REQ-09)
- Chat-based Admin Drafting Workflow (REQ-07, REQ-08)
- End-to-end testing from LinkedIn click through to logged follow-up
- Handover documentation & qualifying scripts

**Infrastructure & Non-Functional Specs (Section 7):**
- **Hosting**: De AI Solutions cloud infrastructure (*No Mac mini or client hardware required*).
- **Human-in-the-loop**: Mandatory review before external messages are sent.
- **PDPA Compliance**: Full export/return of all contact records if the engagement ends.`;
    }

    // Default intelligent response
    return `Based on **Client_TRD.pdf** (Technical Requirements Document):

- **Primary Goal**: Build an AI agent that qualifies leads on WhatsApp, books $10 coaching sessions into the calendar, logs post-meeting notes, sends follow-up reminders, and drafts admin emails/proposals for the client's approval.
- **Core Modules**: Covers REQ-01 through REQ-09 across Lead Engagement, Pipeline Tracking, and Admin Automation.
- **Next Steps**: Review the **TRD Requirements Explorer** or test the **Workflow Simulator** in the menu above!`;
  }

  // TRD Document Explorer Initialization
  function initExplorer() {
    docSectionsList.innerHTML = '';
    docDetailColumn.innerHTML = '';

    // Render section list
    TRD_DATA.sections.forEach((sec, idx) => {
      const btn = document.createElement('button');
      btn.className = `section-item ${idx === 0 ? 'active' : ''}`;
      btn.innerHTML = `<span>${sec.title}</span> <i class="fa-solid fa-chevron-right"></i>`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.section-item').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderSectionDetail(sec);
      });
      docSectionsList.appendChild(btn);
    });

    // Default view
    renderSectionDetail(TRD_DATA.sections[0]);

    // Search filter
    reqSearch.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase();
      if (!term) {
        renderSectionDetail(TRD_DATA.sections[4]); // Functional requirements
        return;
      }
      
      const filteredReqs = TRD_DATA.requirements.filter(r => 
        r.id.toLowerCase().includes(term) ||
        r.title.toLowerCase().includes(term) ||
        r.agentActions.toLowerCase().includes(term)
      );

      renderFilteredRequirements(filteredReqs, term);
    });
  }

  function renderSectionDetail(sec) {
    if (sec.id === 'sec-5') {
      renderAllRequirementsMatrix();
      return;
    }

    docDetailColumn.innerHTML = `
      <div class="doc-detail-card">
        <h3>${sec.title}</h3>
        <div style="white-space: pre-line; line-height: 1.6; color: var(--text-main); font-size: 0.95rem;">
          ${escapeHtml(sec.content)}
        </div>
      </div>
    `;
  }

  function renderAllRequirementsMatrix() {
    let html = `
      <div class="doc-detail-card">
        <h3>5. Functional Requirements Matrix (REQ-01 to REQ-09)</h3>
        <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 16px;">Each module below is an independent specification with a clear trigger, inputs, agent actions, output, and notes.</p>
        <div class="req-grid">
    `;

    TRD_DATA.requirements.forEach(req => {
      html += `
        <div class="req-card">
          <div class="req-card-header">
            <span class="req-id">${req.id}</span>
          </div>
          <h4>${req.title}</h4>
          <div class="req-field"><strong>Trigger:</strong> ${req.trigger}</div>
          <div class="req-field"><strong>Inputs:</strong> ${req.inputs}</div>
          <div class="req-field"><strong>Agent Actions:</strong> ${req.agentActions}</div>
          <div class="req-field"><strong>Output:</strong> ${req.output}</div>
          <div class="req-field"><strong>Notes:</strong> ${req.notes}</div>
          <button class="req-ask-btn" onclick="askAboutReq('${req.id}')">
            <i class="fa-solid fa-message"></i> Ask AI about ${req.id}
          </button>
        </div>
      `;
    });

    html += `</div></div>`;
    docDetailColumn.innerHTML = html;
  }

  function renderFilteredRequirements(filtered, term) {
    let html = `
      <div class="doc-detail-card">
        <h3>Search Results for "${escapeHtml(term)}" (${filtered.length} found)</h3>
        <div class="req-grid">
    `;

    filtered.forEach(req => {
      html += `
        <div class="req-card">
          <div class="req-card-header">
            <span class="req-id">${req.id}</span>
          </div>
          <h4>${req.title}</h4>
          <div class="req-field"><strong>Trigger:</strong> ${req.trigger}</div>
          <div class="req-field"><strong>Agent Actions:</strong> ${req.agentActions}</div>
          <div class="req-field"><strong>Output:</strong> ${req.output}</div>
          <button class="req-ask-btn" onclick="askAboutReq('${req.id}')">
            <i class="fa-solid fa-message"></i> Ask AI about ${req.id}
          </button>
        </div>
      `;
    });

    html += `</div></div>`;
    docDetailColumn.innerHTML = html;
  }

  window.askAboutReq = function(reqId) {
    // Switch to chat tab
    document.querySelector('[data-tab="chat-tab"]').click();
    userInput.value = `Explain requirement ${reqId} in detail with trigger, inputs, agent actions, and output.`;
    chatForm.dispatchEvent(new Event('submit'));
  };

  // Workflow Simulator Initialization
  function initSimulator() {
    renderPipelineTable();

    // Lead simulator buttons
    simBookBtn.addEventListener('click', () => {
      appendSimLeadBubble('Agent (REQ-03)', 'Awesome! I have booked your $10 Introductory Coaching Session for tomorrow at 2:00 PM in Calendly. Confirmation link sent to your email!');
      // Add lead to pipeline
      const newLead = {
        id: Date.now(),
        name: 'LinkedIn Lead #' + Math.floor(Math.random() * 900 + 100),
        stage: '$10 Session',
        lastContact: new Date().toISOString().split('T')[0],
        notes: 'Booked $10 session via WhatsApp engagement (REQ-03).',
        followUpDate: getFutureDate(3)
      };
      contacts.unshift(newLead);
      renderPipelineTable();
    });

    simEscalateBtn.addEventListener('click', () => {
      appendSimLeadBubble('AI Agent (Escalation Flag)', '⚠️ Lead asked: "Can you guarantee $50k revenue in 30 days?" — Topic is outside standard script. Flagged and escalated directly to Coach chat.');
    });

    // Coach instruction simulator
    runCoachCmdBtn.addEventListener('click', () => {
      const text = coachInstruction.value.trim();
      if (!text) return;

      coachSimOutput.innerHTML = `
        <div style="color: var(--accent-primary); font-weight: 600; margin-bottom: 6px;">
          <i class="fa-solid fa-check-circle"></i> Instruction Processed (REQ-04 & REQ-07)
        </div>
        <p><strong>Logged Contact:</strong> Michael Chang</p>
        <p><strong>Pipeline Stage Updated:</strong> Coffee Meeting → $10 Session</p>
        <p><strong>Follow-Up Reminder Scheduled:</strong> ${getFutureDate(21)} (in 3 weeks)</p>
        <div style="margin-top: 10px; background: rgba(59, 130, 246, 0.1); padding: 10px; border-radius: 6px; border-left: 3px solid #3b82f6;">
          <strong>Generated Draft Email (Pending Coach Review):</strong><br/>
          <em>"Hi Michael, great connecting for coffee today. As discussed, here is the outline for our executive coaching session..."</em>
        </div>
      `;
    });

    // Digest generator
    genDigestBtn.addEventListener('click', () => {
      const stale = contacts.filter(c => c.stage === 'Stale Lead' || isStale(c.lastContact));
      alert(`Weekly Relationship-Review Digest (REQ-06):\n\nFound ${stale.length} contacts not engaged in the last 4-6 weeks:\n` + stale.map(s => `- ${s.name} (${s.stage}, Last: ${s.lastContact})`).join('\n'));
    });
  }

  function appendSimLeadBubble(sender, text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble outgoing';
    bubble.innerHTML = `<strong>${sender}:</strong> ${escapeHtml(text)}`;
    leadSimChat.appendChild(bubble);
    leadSimChat.scrollTop = leadSimChat.scrollHeight;
  }

  function renderPipelineTable() {
    pipelineTableBody.innerHTML = '';
    contacts.forEach(c => {
      const tr = document.createElement('tr');
      const stageClass = c.stage.toLowerCase().replace(/\s+|\$/g, '');
      tr.innerHTML = `
        <td><strong>${escapeHtml(c.name)}</strong></td>
        <td><span class="stage-pill ${stageClass}">${escapeHtml(c.stage)}</span></td>
        <td>${c.lastContact}</td>
        <td>${c.followUpDate || 'None'}</td>
        <td>${escapeHtml(c.notes)}</td>
        <td>
          <button class="action-btn secondary sm" onclick="triggerReengagement(${c.id})">
            <i class="fa-solid fa-paper-plane"></i> REQ-09 Re-engage
          </button>
        </td>
      `;
      pipelineTableBody.appendChild(tr);
    });
  }

  window.triggerReengagement = function(id) {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return;
    alert(`REQ-09 Automated Re-Engagement Sent to ${contact.name}:\n\n"Hi ${contact.name}, hope you're doing great! Following up on our previous conversation regarding executive coaching. Would love to reconnect this week!"`);
    contact.lastContact = new Date().toISOString().split('T')[0];
    contact.stage = 'Coffee Meeting';
    renderPipelineTable();
  };

  // Helper Utilities
  function formatMarkdown(text) {
    if (!text) return '';
    let formatted = escapeHtml(text)
      .replace(/^### (.*$)/gim, '<h3 style="color:var(--accent-secondary); margin: 10px 0 6px 0;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="color:var(--accent-secondary); margin: 12px 0 8px 0;">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      .replace(/\n\n/g, '<br/><br/>');
    
    return formatted;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  function getFutureDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString().split('T')[0];
  }

  function isStale(dateStr) {
    const date = new Date(dateStr);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30;
  }

  function generateDocumentSummaryText() {
    return `# Technical Requirements Document (TRD) Summary
**Document**: Client_TRD.pdf
**Source Proposal Date**: 9 September 2026
**Issued By**: Ethan Teo, De AI Solutions Pte Ltd

## Requirements Overview
- **REQ-01**: LinkedIn CTA Routing to WhatsApp
- **REQ-02**: WhatsApp Lead Qualification & Engagement
- **REQ-03**: Session Booking ($10 session to Calendly/GCal)
- **REQ-04**: Contact Logging & Pipeline Updates
- **REQ-05**: Proactive Follow-Up Reminders
- **REQ-06**: Weekly Relationship-Review Digest
- **REQ-07**: Chat-Based Admin Drafting (Human-in-the-Loop)
- **REQ-08**: Background File & Spreadsheet Automation
- **REQ-09**: Automated Re-Engagement of Stale Leads

## System Infrastructure
Hosted on De AI Solutions cloud infrastructure. No client hardware or Mac mini required.`;
  }
});
