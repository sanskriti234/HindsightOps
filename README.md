# HindsightOps - Backend Engine

The backend engine for **HindsightOps** is an asynchronous, high-performance orchestration layer engineered using **FastAPI**. It manages real-time telemetry ingestion, long-term memory retrieval using **Hindsight Cloud**, and advanced root-cause analysis synthesis leveraging **Groq (`qwen/qwen3-32b`)**.

---

## 🚨 The Core Problem

When major production outages strike distributed systems, engineering teams frequently lose hours rediscovering root causes and formulating hotfixes that have **already been resolved in the past**.

Traditional postmortems and institutional knowledge remain scattered across disconnected platforms (Slack, Jira, Confluence, static text dumps), rendering them useless during active incidents. This results in:

* **Inflated Mean Time to Resolution (MTTR)** due to repetitive diagnostic work.
* **Knowledge Vanishing** when senior Site Reliability Engineers (SREs) leave or rotate shifts.
* **Duplicate Failures** occurring across separate product components because root causes are hidden from active troubleshooting paths.

---

## 🏗️ Working Architecture

HindsightOps bridges the gap between stateless active telemetry inputs and persistent long-term memory records. Rather than relying entirely on generic AI models that lack context, it pulls historical context from real enterprise incidents to dynamically transform from a first-principles debugger into a highly-confident, specialized resolution assistant.

```
                  ┌──────────────────────────────┐
                  │ Active Production Telemetry  │
                  │ (Live Symptoms & Error Logs) │
                  └──────────────┬───────────────
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │    FastAPI Backend Engine    │
                  └──────────────┬───────────────
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
┌──────────────────────────────┐               ┌──────────────────────────────┐
│  Hindsight Cloud SDK Layer   │               │      Groq LLM Engine         │
│ (Semantic /recall Search)    │               │       (qwen/qwen3-32b)       │
└────────┬─────────────────────┘               └──────────────┬───────────────
         │                                                    │
         │ Contextual Memories                                │ Structured Synthesis
         └───────────────────────┬────────────────────────────┘
                                 │
                                 ▼
                  ┌──────────────────────────────┐
                  │ High-Confidence Diagnosis    │
                  │ - Systemic Root Cause        │
                  │ - Remediation Action Steps   │
                  │ - Memory Rationale Citation  │
                  └──────────────────────────────┘

```

---

## 🔁 Execution Pipeline & Methodology

The backend engine processes telemetry inputs and updates corporate memory layers using a specific data contract sequence:

### 1. Unified 12-Key Structural Contract

To maintain complete consistency across storage indexes, inference systems, and tracking dashboards, every system incident payload must map directly to this unified data schema:

* `incident_id`: Tracking string profile.
* `severity`: Outage priority tier (`CRITICAL`, `HIGH`, `MEDIUM`).
* `service`: Target subcomponent or microservice identifier.
* `category` & `subcategory`: Domain faults (e.g., `Database` -> `ConnectionPoolExhaustion`).
* `symptoms`: List of live user-facing or telemetry deviations.
* `logs`: Array of raw execution stdout/stderr traces.
* `incident_summary`: High-level overview of the event progression.
* `root_cause`: Deep forensic identification of the underlying breakdown.
* `resolution`: Exact steps executed to return the system to a nominal state.
* `postmortem`: Post-incident architectural breakdown.
* `preventive_actions`: List of long-term fixes to prevent recurrence.

### 2. Diagnosis Pipeline Operations (`POST /api/diagnose`)

When active telemetry lands on the server, the application triggers a multi-stage orchestration flow:

```
[Incoming Payload] ──► [Hindsight Query Synthesis] ──► [/recall Context Lookup]
                                                               │
┌──────────────────────────────────────────────────────────────┘
│
▼
[Scenario Decision Matrix]
  ├── Cold State (0 Matches Found) ────► Invoke Generic LLM Fallback (Low Confidence)
  └── Warm State (Matches > 0) ────────► Inject Historical Runbooks ──► Formulate Targeted Solution (High Confidence)

```

* **Step A: Vector Memory Recall:** The engine extracts structural data parameters from incoming logs and queries Hindsight Cloud vector embeddings via `/recall` API hooks to retrieve semantically related past incidents.
* **Step B: Dynamic System Prompting:** The retrieved memory blocks are formatted alongside the live telemetry to form an engineering evaluation packet.
* **Step C: Groq Synthesis Strategy:** The payload is processed by the Groq model.
* If the lookup returns no results (**Scenario 1: Cold State**), the model falls back to generic, first-principles troubleshooting instructions.
* If highly relevant histories are returned (**Scenario 2: Warm State**), the engine adopts the past resolutions, increases its diagnosis confidence metrics ($90\%+$), provides specific runbook instructions, and explicitly cites the driving historical index IDs.



### 3. Ingestion & Continuous Learning (`POST /api/incidents`)

As engineers resolve novel production incidents, the verified 12-key payload is pushed to the `/api/incidents` endpoint. The platform saves this structured profile straight to **Hindsight Cloud** using `/retain` API hooks. This updates the contextual knowledge base, ensuring the entire engineering group automatically benefits from the new resolution signature during future outages.

---

## 🔧 Core Service Topology

The backend engine coordinates work across three main internal service layers:

* **`hindsight_service.py`**: Interacts directly with the Hindsight Cloud SDK to process low-level embedding generation, cluster ingestion (`/retain`), and vector neighborhood discovery (`/recall`).
* **`llm_service.py`**: Manages structural prompts, strict Pydantic JSON serialization outputs, and low-latency validation formatting against the Groq client endpoint.
* **`retrieval_service.py`**: The centralized orchestration coordinator. It receives incoming raw telemetry, drives the semantic retrieval sequences, merges information matrices, and pipes the final consolidated context to the LLM reasoning layer.