FROM python:3.12-slim

WORKDIR /app

# Install dependencies first for Docker caching
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend source code
COPY backend/ ./backend/

# Expose FastAPI port
EXPOSE 8000

# Run the uvicorn server pointing to the backend module
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]