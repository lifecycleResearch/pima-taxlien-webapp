from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes
import logging
import os
import requests

logging.basicConfig(level=logging.INFO)

TELEGRAM_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '8667415809:AAGYyi3r8DqjNl3UNq8nU4m18KYx4LDapaE')
OPENWEBUI_URL = os.environ.get('OPENWEBUI_URL', 'http://open-webui:8080')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logging.info(f"START from {update.effective_chat.id}")
    await update.message.reply_text("Welcome to Pima Tax Lien Bot! Send /ask <question> to chat with AI.")

async def ask(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = ' '.join(context.args) if context.args else ""
    logging.info(f"ASK: {query}")
    
    if not query:
        await update.message.reply_text("Usage: /ask <your question>")
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
        await update.message.reply_text(answer[:4000])
    except Exception as e:
        logging.error(f"Error: {str(e)}")
        await update.message.reply_text(f"Error: {str(e)}")

async def echo(update: Update, context: ContextTypes.DEFAULT_TYPE):
    logging.info(f"ECHO: {update.message.text}")
    await update.message.reply_text("Send /ask <question> to chat with AI.")

def main():
    app = Application.builder().token(TELEGRAM_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("help", start))
    app.add_handler(CommandHandler("ask", ask))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, echo))
    logging.info("Bot started with python-telegram-bot...")
    app.run_polling()

if __name__ == '__main__':
    main()
