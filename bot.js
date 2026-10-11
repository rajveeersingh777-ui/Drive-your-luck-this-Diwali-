const { Telegraf } = require('telegraf');
const express = require('express');

// 1. Express Server Setup (Render ke Port Scan Error ko fix karne ke liye)
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Diwali Bot Backend is Active and Running!');
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 2. Telegram Bot Setup
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_TELEGRAM_BOT_TOKEN_HERE';
const bot = new Telegraf(BOT_TOKEN);

// Jab user website se 'Start' dabakar Telegram par aayega (e.g. /start DWL-123456)
bot.start((ctx) => {
    const payload = ctx.startPayload; // Ticket ID uthayega (DWL-XXXXXX)
    
    if (payload) {
        const ticketId = payload;
        
        ctx.replyWithMarkdown(
            `🪔 *Drive Your Luck This Diwali*\n\n` +
            `Aapka Registration Successful raha!\n` +
            `🎫 *Ticket ID:* \`${ticketId}\`\n\n` +
            `Apna winning slot lock karne ke liye niche button se 100 Telegram Stars (⭐ XTR) ka payment karein.`
        );

        // 100 Stars ka Invoice Send Karein
        return ctx.replyWithInvoice({
            title: 'Diwali Jackpot Ticket Entry',
            description: `Ticket ID: ${ticketId} - Entry Fee 100 Stars`,
            payload: `pay_${ticketId}`,
            provider_token: '', // Telegram Stars ke liye token empty rehta hai
            currency: 'XTR',    // Telegram Stars Currency
            prices: [{ label: 'Entry Fee', amount: 100 }]
        });
    } else {
        ctx.reply('🪔 Welcome! Kripya pehle website se register karke ticket generate karein.');
    }
});

// Pre-checkout query accept karein
bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true));

// Successful Payment ke baad ka message
bot.on('successful_payment', (ctx) => {
    ctx.reply('🎉 Payment Successful! Aapka 100 Stars ka slot Diwali Jackpot ke liye lock ho gaya hai. All the Best!');
});

bot.launch().then(() => console.log('Telegram Bot Launched!'));
