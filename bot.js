const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 10000;
const TOKEN = process.env.BOT_TOKEN;

console.log("=== BOT STARTING ===");
console.log("Bot Token Present:", !!TOKEN);

// 1. HTTP Server for Render & UptimeRobot Ping
const server = http.createServer((req, res) => {
    console.log("Ping received from UptimeRobot / Browser");
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is Active & Live!\n');
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`HTTP Server successfully listening on port ${PORT}`);
});

// 2. Telegram Polling with Full Logs
let offset = 0;
function pollTelegram() {
    if (!TOKEN) {
        console.error("CRITICAL ERROR: BOT_TOKEN is missing in Render Environment Variables!");
        return;
    }

    const url = `https://api.telegram.org/bot${TOKEN}/getUpdates?offset=${offset}&timeout=30`;

    https.get(url, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            try {
                const response = JSON.parse(data);
                if (!response.ok) {
                    console.error("Telegram API Error Response:", response);
                } else if (response.result && response.result.length > 0) {
                    console.log("New Telegram Updates Received:", response.result.length);
                    response.result.forEach(update => {
                        offset = update.update_id + 1;
                        handleUpdate(update);
                    });
                }
            } catch (e) {
                console.error('JSON Parse error:', e, "Raw data:", data);
            }
            setTimeout(pollTelegram, 500);
        });
    }).on('error', (err) => {
        console.error('Polling network error:', err.message);
        setTimeout(pollTelegram, 3000);
    });
}

// 3. Message Handler
function handleUpdate(update) {
    if (!update.message || !update.message.text) return;
    
    const chatId = update.message.chat.id;
    const text = update.message.text;
    console.log(`Message from Chat ID ${chatId}: ${text}`);
    
    if (text.startsWith('/start')) {
        const parts = text.split(' ');
        const ticketId = parts.length > 1 ? parts[1] : null;
        
        if (ticketId) {
            console.log(`Ticket ID found: ${ticketId}. Sending Invoice...`);
            sendInvoice(chatId, ticketId);
        } else {
            console.log(`No Ticket ID found. Sending welcome text...`);
            sendMessage(chatId, "🪔 Welcome! Kripya pehle website se register karke apna ticket generate karein.");
        }
    }
}

function sendMessage(chatId, text) {
    const data = JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' });
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TOKEN}/sendMessage`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = https.request(options, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => console.log("SendMessage API Response:", resData));
    });
    req.on('error', (e) => console.error("SendMessage Error:", e));
    req.write(data);
    req.end();
}

function sendInvoice(chatId, ticketId) {
    const data = JSON.stringify({
        chat_id: chatId,
        title: 'Diwali Jackpot Ticket Entry',
        description: `Ticket ID: ${ticketId} - Entry Fee 100 Stars`,
        payload: `pay_${ticketId}`,
        provider_token: '',
        currency: 'XTR',
        prices: [{ label: 'Entry Fee', amount: 100 }]
    });
    
    const options = {
        hostname: 'api.telegram.org',
        path: `/bot${TOKEN}/sendInvoice`,
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    };
    const req = https.request(options, (res) => {
        let resData = '';
        res.on('data', chunk => resData += chunk);
        res.on('end', () => console.log("SendInvoice API Response:", resData));
    });
    req.on('error', (e) => console.error("SendInvoice Error:", e));
    req.write(data);
    req.end();
}

pollTelegram();
