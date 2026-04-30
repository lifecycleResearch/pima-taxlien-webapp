from flask import Flask, request, jsonify
import os
import logging
import requests
import telebot

logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE')
OPENWEBUI_URL = os.environ.get('OPENWEBUI_URL', 'http://open-webui:8080')

logging.info(f"Starting webhook bot with token: {TELEGRAM_TOKEN[:10]}...")

bot = telebot.TeleBot(TELEGRAM_TOKEN)
app = Flask(__name__)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    logging.info(f"START: {message.chat.id}")
    bot.reply_to(message, "Welcome to Pima Tax Lien Bot! Send /ask <question> to chat with AI.")

@bot.message_handler(commands=['ask'])
def ask_ai(message):
    query = message.text.replace('/ask', '').strip()
    logging.info(f"ASK: {query}")
    
    if not query:
        bot.reply_to(message, "Usage: /ask <your question>")
        return
    
    try:
        logging.info(f"Calling OpenWebUI: {OPENWEBUI_URL}")
        resp = requests.post(
            f"{OPENWEBUI_URL}/api/v1/chat/completions",
            json={
                "model": "nvidia/nemotron-4-340b-instruct",
                "messages": [{"role": "user", "content": query}]
            },
            timeout=30
        )
        logging.info(f"OpenWebUI status: {resp.status_code}")
        data = resp.json()
        answer = data.get('choices', [{}])[0].get('message', {}).get('content', 'No response')
        bot.reply_to(message, answer[:4000])
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        bot.reply_to(message, f"Error: {str(e)}")

@bot.message_handler(func=lambda message: True)
def echo_all(message):
    if message.text and message.text.startswith('/'):
        bot.reply_to(message, "Send /ask <question> to chat with AI")

@app.route('/webhook', methods=['POST'])
def webhook():
    json_str = request.get_data().decode('UTF-8')
    update = telebot.types.Update.de_json(json_str)
    bot.process_new_updates([update])
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    logging.info("Starting Flask webhook server on port 5000...")
    app.run(host='0.0.0.0', port=5000)
