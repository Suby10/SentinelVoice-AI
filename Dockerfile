FROM python:3.13-slim

WORKDIR /app

# Install FFmpeg for Whisper/audio decoding
RUN apt-get update \
    && apt-get install -y --no-install-recommends ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ai ./ai
COPY backend ./backend

# Temporary upload directory
RUN mkdir -p /app/uploads

EXPOSE 10000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "10000"]