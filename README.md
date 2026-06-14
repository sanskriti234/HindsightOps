# Agent

AI-Powered Incident Intelligence & Root Cause Analysis Platform

## Overview

Agent is an AI-powered incident response assistant designed to help engineers, SREs, and operations teams diagnose incidents faster by combining Large Language Models (LLMs) with organizational memory.

The platform retrieves historical incidents from a vector database, identifies similar past failures, analyzes patterns, and generates actionable Root Cause Analysis (RCA) reports with supporting evidence.

Instead of manually searching through tickets, logs, and documentation, users can simply describe an issue in natural language and receive context-aware insights based on previous incidents.

---

## Problem Statement

Modern engineering teams face recurring operational incidents:

* Repeated outages caused by similar root causes
* Knowledge loss when engineers leave teams
* Time-consuming manual incident investigation
* Difficulty correlating historical failures with current issues

Agent addresses these challenges by creating an intelligent incident memory system that continuously learns from past incidents and assists engineers during investigations.

---

## Key Features

### AI Incident Assistant

* Natural language query interface
* Conversational incident investigation
* Context-aware troubleshooting recommendations
* Automated RCA generation

### Historical Incident Retrieval

* Semantic search across previous incidents
* Similarity-based incident matching
* Retrieval-Augmented Generation (RAG)
* Context enrichment using organizational memory

### Root Cause Analysis Generation

Automatically generates:

* Incident Summary
* Timeline Reconstruction
* Root Cause Identification
* Impact Assessment
* Resolution Actions
* Preventive Measures

### Analytics Dashboard

Visual insights including:

* Incident occurrence trends
* Frequency analysis
* Severity distribution
* Historical incident comparisons

### Vector Memory Integration

Powered by Vectorize Hindsight:

* Long-term incident memory
* Semantic retrieval
* Knowledge retention
* Historical pattern recognition

---

## System Architecture

```text
                ┌──────────────────┐
                │     User Query   │
                └─────────┬────────┘
                          │
                          ▼
                ┌──────────────────┐
                │  Query Agent     │
                └─────────┬────────┘
                          │
            ┌─────────────┴─────────────┐
            ▼                           ▼

 ┌─────────────────┐        ┌──────────────────┐
 │ Hindsight Store │        │ Incident Dataset │
 │ Vector Memory   │        │ Historical Data  │
 └────────┬────────┘        └────────┬─────────┘
          │                          │
          └──────────────┬───────────┘
                         ▼

              ┌───────────────────┐
              │ Retrieval Engine  │
              └─────────┬─────────┘
                        ▼

              ┌───────────────────┐
              │ LLM Reasoning     │
              │ RCA Generation    │
              └─────────┬─────────┘
                        ▼

              ┌───────────────────┐
              │ Dashboard Output  │
              │ Analytics + RCA   │
              └───────────────────┘
```

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Framer Motion
* Recharts

### Backend

* FastAPI
* Python
* Pydantic
* Uvicorn

### AI Layer

* Gemini API
* Retrieval-Augmented Generation (RAG)
* Prompt Engineering

### Memory & Search

* Vectorize Hindsight
* Vector Embeddings
* Semantic Similarity Search

---

## Project Structure

```text
Agent/
│
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── public/
│
├── backend/
│   ├── models/
├   ├── scripts/
│   ├── services/
│   ├── models/
│   ├── data/
├   ├── requirements.txt
├   ├── path.py
│   └── main.py
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Agent
```

### Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
HINDSIGHT_API_KEY=your-Hinsight-api-key
HINDSIGHT_BANK_ID=your-bank-id
HINDSIGHT_API_URL=https://api.hindsight.vectorize.io

# Groq
GROQ_API_KEY=your_key
GROQ_BASE_URL=https://api.groq.com

OPENROUTER_API_KEY=your_key

OPENAI_API_KEY=your_openai_key

PRIMARY_MODEL=gpt-oss-120b
FALLBACK_MODEL=qwen3-32b
FINAL_FALLBACK=gpt-5

NEXT_PUBLIC_API_BASE=http://localhost:8000

```

### Run Backend

```bash
uvicorn main:app --reload
```

---

### Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Application:

```text
Frontend : http://localhost:3000
Backend  : http://localhost:8000
```

---

## Example Queries

### Infrastructure Issues

```text
Why is the production API experiencing high latency?
```

```text
Find incidents similar to today's database outage.
```

```text
What caused the Kubernetes pod crash loop in the payment service?
```

### Network Problems

```text
Investigate packet loss between application and database servers.
```

```text
Have we seen similar network failures before?
```

### Application Failures

```text
Why are users receiving HTTP 500 errors after deployment?
```

```text
Analyze recurring authentication failures in the login service.
```

### Database Incidents

```text
Identify the root cause of increased database response times.
```

```text
Show historical incidents involving PostgreSQL connection exhaustion.
```

### Security Events

```text
Analyze unusual login activity detected in production.
```

```text
Find similar incidents related to unauthorized access attempts.
```

### RCA Generation

```text
Generate a root cause analysis for the payment gateway outage.
```

```text
Create an incident report with timeline, impact, and mitigation actions.
```

### Analytics Queries

```text
Show incident trends related to database failures.
```

```text
What are the most common root causes in the last six months?
```

```text
Visualize incidents affecting the authentication service.
```


Agent can return:

* Similar historical incidents
* Probable root causes
* Affected services
* Recommended mitigation actions
* RCA summary
* Incident analytics

---

## Future Enhancements

* Multi-agent incident workflows
* Real-time log ingestion
* Automated alert correlation
* Slack integration
* Jira integration
* Incident timeline generation
* Predictive outage detection
* Knowledge graph-based reasoning

---

## Use Cases

### Site Reliability Engineering (SRE)

Accelerate incident diagnosis using historical knowledge.

### DevOps Operations

Reduce Mean Time To Resolution (MTTR).

### Platform Engineering

Build institutional memory for operational events.

### Enterprise IT Support

Quickly identify recurring issues and solutions.

---

## Goals

* Reduce incident investigation time
* Preserve organizational knowledge
* Improve RCA quality
* Increase operational efficiency
* Enable AI-assisted troubleshooting

---

## License

MIT License

---

Built with AI, Retrieval-Augmented Generation, and Vector Memory to transform incident response into a knowledge-driven workflow.
