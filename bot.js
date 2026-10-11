const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.BOT_TOKEN;

// 1. Render Ke Port Timeout Ko Rokne Ke Liye HTTP Server
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Diwali Bot is alive and running!\n');
});

server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

// 2. Telegram Bot Polling (Bina kisi extra library ke)
let offset = 0;
function pollTelegram() {
    if (!TOKEN) return;
    
    https.get(`https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (response.ok && response.result) {
                    response.result.forEach(update => {
                        offset = update.update_id + 1;
                        handleUpdate(update);
                    });
                }
            } catch (e) {
                console.error('JSON Parse error:', e);
            }
            setTimeout(pollTelegram, 1000);
        });
    }).on('error', (err) => {
        console.error('Polling error:', err);
        setTimeout(pollTelegram, 3000);
    });
}

// 3. User Message Handle Karna (/start aur Ticket ID)
function handleUpdate(update) {
    if (!update.message || !update.message.text) return;
    
    const chatId = update.message.chat.id;
    const text = update.message.text;
    
    if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const ticketId = parts.length > 1 ? parts[1] : null;
        
        let replyText = "🪔 *Drive Your Luck This Diwali*\n\n";
        if (ticketId) {
            replyText += `Aapki Ticket ID: \`${ticketId}\` secure ho gayi hai!\n` +
                         `Apna slot confirm karne ke liye 100 Telegram Stars (⭐ XTR) ka payment poora karein.`;
            
            // Send Invoice for 100 Stars
            sendInvoice(chatId, ticketId);
        } else {
            replyText += "Welcome! Kripya pehle website se register karke apna ticket generate karein.";
            sendMessage(chatId, replyText);
        }
    }
}

// Telegram Message Bhejne Ka Function
function sendMessage(chatId, text) {
    const data = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TOKEN}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    };
    const req = https.request(options);
    req.write(data);
    req.end();
}

// Telegram Stars Invoice Bhejne Ka Function
function sendInvoice(chatId, ticketId) {
    const data = JSON.stringify({
        chat_id: chatId,
        title: 'Diwali Jackpot Ticket Entry',
        description: `Ticket ID: ${ticketId} - Entry Fee 100 Stars`,
        payload: `pay_${ticketId}`,
        provider_token: '', // Stars ke liye empty rehta hai
        currency: 'XTR',
        prices: [{ label: 'Entry Fee', amount: 100 }]
    });
    
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TOKEN}/sendInvoice`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
    };
    const req = https.request(options);
    req.write(data);
    req.end();
}

// Start polling
pollTelegram();
