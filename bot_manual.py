import os
import logging
import requests
import time
import json

logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE')
OPENWEBUI_URL = os.environ.get('OPENWEBUI_URL', 'http://open-webui:8080')

API_URL = f"https://api.telegram.org/bot{TELEGRAM_TOKEN}"

logging.info(f"Starting manual poll bot...")

def send_message(chat_id, text):
    try:
        requests.post(f"{API_URL}/sendMessage", json={
            "chat_id": chat_id,
            "text": text[:4000]
        }, timeout=10)
    except Exception as e:
        logging.error(f"Send error: {e}")

def call_openwebui(query):
    try:
        logging.info(f"Calling OpenWebUI...")
        resp = requests.post(
            f"{OPENWEBUI_URL}/api/v1/chat/completions",
            json={
                "model": "nvidia/nemotron-4-340b-instruct",
                "messages": [{"role": "user", "content": query}]
            },
            timeout=30
        )
        logging.info(f"OpenWebUI status: {resp.status_code}")
        return resp.json().get('choices', [{}])[0].get('message', {}).get('content', 'No response')
    except Exception as e:
        logging.error(f"OpenWebUI error: {e}")
        return f"Error: {str(e)}"

def process_message(msg):
    chat_id = msg['chat']['id']
    text = msg.get('text', '')
    
    logging.info(f"MSG from {chat_id}: {text[:50]}")
    
    if text.startswith('/start') or text.startswith('/help'):
        send_message(chat_id, "Welcome to Pima Tax Lien Bot! Send /ask <question> to chat with AI.")
    elif text.startswith('/ask'):
        query = text.replace('/ask', '').strip()
        if not query:
            send_message(chat_id, "Usage: /ask <your question>")
        else:
            answer = call_openwebui(query)
            send_message(chat_id, answer)
    elif text.startswith('/'):
        send_message(chat_id, "Send /ask <question> to chat with AI.")

def main():
    offset = 0
    logging.info("Bot started, polling for messages...")
    
    while True:
        try:
            resp = requests.get(
                f"{API_URL}/getUpdates",
                params={"offset": offset, "timeout": 30},
                timeout=35
            )
            data = resp.json()
            
            if data.get('ok'):
                for update in data.get('result', []):
                    offset = update['update_id'] + 1
                    if 'message' in update:
                        process_message(update['message'])
        except Exception as e:
            logging.error(f"Poll error: {e}")
            time.sleep(5)

if __name__ == '__main__':
    main()
