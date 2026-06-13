hindsightops/
├── Dockerfile.backend
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── api/
│   │   ├── __init__.py
│   │   ├── diagnose.py
│   │   ├── incidents.py
│   │   └── memory.py
│   ├── models/
│   │   ├── __init__.py
│   │   └── incident.py
│   └── services/
│       ├── __init__.py
│       ├── hindsight_service.py
│       ├── llm_service.py
│       └── retrieval_service.py