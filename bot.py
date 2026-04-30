import os
import logging
import telebot
import requests

logging.basicConfig(
    format='%(asctime)s - %(levelname)s - %(message)s',
    level=logging.INFO
)

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE')
OPENWEBUI_URL = os.environ.get('OPENWEBUI_URL', 'http://open-webui:8080')

logging.info(f"Starting bot with token: {TELEGRAM_TOKEN[:10]}...")

bot = telebot.TeleBot(TELEGRAM_TOKEN)

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

logging.info("Bot polling started...")
bot.infinity_polling(skip_pending=True)
