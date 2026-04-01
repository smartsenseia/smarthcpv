FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY ALGORITHMS_AND_DATA /app/ALGORITHMS_AND_DATA
COPY DATABASE /app/DATABASE
COPY FASTAPI /app/FASTAPI
COPY main.py /app/main.py

CMD ["python", "main.py"]