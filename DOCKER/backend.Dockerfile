FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY FASTAPI /app/FASTAPI
COPY ALGORITHMS_AND_DATA /app/ALGORITHMS_AND_DATA
COPY DATABASE /app/DATABASE

EXPOSE 8000

CMD ["uvicorn", "FASTAPI.app.main:app", "--host", "0.0.0.0", "--port", "8000"]