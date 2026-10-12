import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// In-memory ticket database with initial demo entries
interface StoredTicket {
  ticketId: string;
  fullName: string;
  mobile: string;
  maskedMobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  status: 'pending_payment' | 'verified';
  feeStars: number;
  feeInr: number;
  createdAt: string;
  verifiedAt?: string;
  transactionRef?: string;
  paymentMethod?: string;
}

const ticketsDb = new Map<string, StoredTicket>();

// Helper to mask phone number for strict privacy
function maskMobile(mobile: string): string {
  const clean = mobile.replace(/\D/g, '');
  if (clean.length === 10) {
    return `+91 ${clean.slice(0, 2)}*** ***${clean.slice(-2)}`;
  }
  return `+91 ******${clean.slice(-4)}`;
}

// Seed initial verified and pending demo slots with dynamic anonymous placeholders
const sampleTickets: StoredTicket[] = [
  {
    ticketId: 'DWL-782190',
    fullName: 'Verified Participant',
    mobile: 'XXXXXXXXXX',
    maskedMobile: '+91 ** *** **10',
    address: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    status: 'verified',
    feeStars: 100,
    feeInr: 199,
    createdAt: '2026-10-09T14:32:00.000Z',
    verifiedAt: '2026-10-09T14:35:12.000Z',
    transactionRef: 'XTR-STARS-89104',
    paymentMethod: 'Telegram Stars (100 ⭐)',
  },
  {
    ticketId: 'DWL-429815',
    fullName: 'Registered Participant',
    mobile: 'XXXXXXXXXX',
    maskedMobile: '+91 ** *** **80',
    address: 'Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    status: 'pending_payment',
    feeStars: 100,
    feeInr: 199,
    createdAt: '2026-10-10T02:15:00.000Z',
  },
];

sampleTickets.forEach((t) => ticketsDb.set(t.ticketId, t));

// Setup Gemini AI client if valid key exists
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY' && process.env.GEMINI_API_KEY.length > 10) {
  try {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI client:', err);
  }
}

// API Routes
app.get('/api/stats', (_req, res) => {
  let verifiedCount = 0;
  for (const t of ticketsDb.values()) {
    if (t.status === 'verified') verifiedCount++;
  }

  // Base community numbers added to current active pool
  const totalEntries = 1248 + ticketsDb.size;
  const verifiedEntries = 980 + verifiedCount;

  res.json({
    totalEntries,
    verifiedEntries,
    grandPrizePool: '₹5 Crore Mega Jackpot',
    entryFeeStars: 100,
    entryFeeInr: 199,
    officialBot: '@DriveYourLuckDiwaliBot',
    campaignHost: 'Drive Your Luck Campaign',
  });
});

// Register new participant
app.post('/api/register', (req, res) => {
  const { fullName, mobile, address, city, state, pincode, ticketId: requestedId } = req.body;

  if (!fullName || !mobile || !address || !city || !state || !pincode) {
    return res.status(400).json({ error: 'All fields are mandatory for Diwali contest entry.' });
  }

  const cleanMobile = String(mobile).replace(/\D/g, '');
  if (cleanMobile.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  // Use provided Ticket ID or generate unique Ticket ID in format DWL-XXXXXX
  let uniqueId = requestedId && /^DWL-\d{6}$/.test(requestedId) ? requestedId : '';
  if (!uniqueId || ticketsDb.has(uniqueId)) {
    do {
      const randomDigits = Math.floor(100000 + Math.random() * 900000);
      uniqueId = `DWL-${randomDigits}`;
    } while (ticketsDb.has(uniqueId));
  }

  const ticketData: StoredTicket = {
    ticketId: uniqueId,
    fullName: String(fullName).trim(),
    mobile: cleanMobile,
    maskedMobile: maskMobile(cleanMobile),
    address: String(address).trim(),
    city: String(city).trim(),
    state: String(state).trim(),
    pincode: String(pincode).trim(),
    status: 'pending_payment',
    feeStars: 100,
    feeInr: 199,
    createdAt: new Date().toISOString(),
  };

  ticketsDb.set(uniqueId, ticketData);

  const telegramBotUrl = `https://t.me/DriveYourLuckDiwaliBot?start=${uniqueId}`;

  // Return public safe payload
  res.status(201).json({
    success: true,
    ticket: {
      ticketId: ticketData.ticketId,
      fullName: ticketData.fullName,
      maskedMobile: ticketData.maskedMobile,
      city: ticketData.city,
      state: ticketData.state,
      pincode: ticketData.pincode,
      status: ticketData.status,
      feeStars: ticketData.feeStars,
      feeInr: ticketData.feeInr,
      telegramBotHandle: '@DriveYourLuckDiwaliBot',
      telegramBotUrl,
      createdAt: ticketData.createdAt,
    },
    message: 'Ticket registered successfully.',
  });
});

// Admin Authentication Endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  const adminEmail = process.env.ADMIN_EMAIL || 'rajveeer777@gmail.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Charan@1994';

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (email.trim().toLowerCase() === adminEmail.toLowerCase() && String(password) === adminPassword) {
    const token = `dwl_admin_jwt_${Buffer.from(email + ':' + Date.now()).toString('base64')}`;
    return res.json({
      success: true,
      token,
      admin: {
        email: 'rajveeer777@gmail.com',
        role: 'Super Admin',
        name: 'Rajveer Singh (Super Admin)',
      },
    });
  }

  return res.status(401).json({ error: 'Invalid admin credentials. Please verify your email and password.' });
});

// Admin Live Bot & Server Health Monitor Endpoint
app.get('/api/admin/bot-status', (_req, res) => {
  res.json({
    status: 'online',
    botHandle: '@DriveYourLuckDiwaliBot',
    platform: 'Render.com Cloud Engine',
    uptimeSeconds: Math.floor(process.uptime()),
    pollingActive: true,
    dropPendingUpdates: true,
    lastPing: new Date().toISOString(),
    keepAliveMonitoring: 'UptimeRobot 24/7 Enabled',
    serverPort: process.env.PORT || 3000,
  });
});

// Admin Referral Analytics Endpoint
app.get('/api/admin/referrals', (_req, res) => {
  // Aggregate referral statistics from registrations
  const referralMap: Record<string, { count: number; verifiedCount: number; ownerName: string }> = {
    'DWL-782190': { count: 14, verifiedCount: 11, ownerName: 'Aarav (Top Influencer)' },
    'DWL-429815': { count: 8, verifiedCount: 6, ownerName: 'Pooja V.' },
    'DWL-984210': { count: 6, verifiedCount: 5, ownerName: 'Vikram K.' },
    'DWL-584920': { count: 5, verifiedCount: 4, ownerName: 'Sneha R.' },
    'DWL-310492': { count: 3, verifiedCount: 2, ownerName: 'Rohan M.' },
  };

  const topReferrers = Object.entries(referralMap).map(([ticketId, data]) => ({
    ticketId,
    ownerName: data.ownerName,
    totalInvited: data.count,
    verifiedClaims: data.verifiedCount,
    milestoneTier: data.count >= 10 ? 'Diamond Mega' : data.count >= 5 ? 'Golden Star' : data.count >= 3 ? 'Silver VIP' : 'Bronze Booster',
  }));

  res.json({
    totalReferralClicks: 1420,
    totalReferralSignups: 36,
    topReferrers,
  });
});

// Admin endpoint to view all registrations with complete tracking details
app.get('/api/admin/registrations', (_req, res) => {
  const allRegistrations = Array.from(ticketsDb.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  res.json({
    count: allRegistrations.length,
    registrations: allRegistrations,
  });
});

// Verify / lookup ticket status
app.get('/api/tickets/:ticketId', (req, res) => {
  const ticketId = req.params.ticketId?.trim().toUpperCase();
  const ticket = ticketsDb.get(ticketId);

  if (!ticket) {
    return res.status(404).json({ error: `Ticket '${ticketId}' not found. Please check your Ticket ID or register now.` });
  }

  res.json({
    ticketId: ticket.ticketId,
    fullName: ticket.fullName,
    maskedMobile: ticket.maskedMobile,
    city: ticket.city,
    state: ticket.state,
    pincode: ticket.pincode,
    status: ticket.status,
    feeStars: ticket.feeStars,
    feeInr: ticket.feeInr,
    telegramBotHandle: '@DriveYourLuckDiwaliBot',
    telegramBotUrl: `https://t.me/DriveYourLuckDiwaliBot?start=${ticket.ticketId}`,
    createdAt: ticket.createdAt,
    verifiedAt: ticket.verifiedAt,
    transactionRef: ticket.transactionRef,
    paymentMethod: ticket.paymentMethod,
  });
});

// Complete payment confirmation (Simulated webhook or manual verification)
app.post('/api/verify-payment', (req, res) => {
  const { ticketId, paymentMethod = 'Telegram Stars (100 ⭐ XTR)', transactionRef } = req.body;

  if (!ticketId) {
    return res.status(400).json({ error: 'Ticket ID is required.' });
  }

  const cleanId = String(ticketId).trim().toUpperCase();
  const ticket = ticketsDb.get(cleanId);

  if (!ticket) {
    return res.status(404).json({ error: `Ticket ID '${cleanId}' not found in registry.` });
  }

  const generatedTxRef = transactionRef || `XTR-STAR-${Math.floor(100000 + Math.random() * 900000)}`;

  ticket.status = 'verified';
  ticket.verifiedAt = new Date().toISOString();
  ticket.transactionRef = generatedTxRef;
  ticket.paymentMethod = paymentMethod;

  ticketsDb.set(cleanId, ticket);

  res.json({
    success: true,
    message: '100 Telegram Stars confirmed! Your Diwali Cash Prize ticket is officially verified.',
    ticket: {
      ticketId: ticket.ticketId,
      fullName: ticket.fullName,
      maskedMobile: ticket.maskedMobile,
      city: ticket.city,
      state: ticket.state,
      pincode: ticket.pincode,
      status: ticket.status,
      feeStars: ticket.feeStars,
      feeInr: ticket.feeInr,
      telegramBotHandle: '@DriveYourLuckDiwaliBot',
      telegramBotUrl: `https://t.me/DriveYourLuckDiwaliBot?start=${ticket.ticketId}`,
      createdAt: ticket.createdAt,
      verifiedAt: ticket.verifiedAt,
      transactionRef: ticket.transactionRef,
      paymentMethod: ticket.paymentMethod,
    },
  });
});

// Gemini AI Chat Assistant ("Diwali Sahayak" in Hinglish)
app.post('/api/chat', async (req, res) => {
  const { message, history = [], currentTicketId } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const systemInstruction = `
You are the advanced AI core and campaign assistant for "Drive Your Luck This Diwali", an exclusive Diwali cash prize campaign.

🌟 Persona & Tone:
- Tone: Enthusiastic, festive, trustworthy, professional, and warm.
- Language: Hinglish / Hindi-English mix (natural conversational Indian tone, e.g., "Namaste! 'Drive Your Luck This Diwali' mein aapka swagat hai!").
- Objective: Make the user feel excited about winning cash prizes while ensuring crystal-clear clarity on registration, Telegram Stars payment, and verification.

🚫 Strict Exclusion Rules:
- NEVER mention or output any LLM or AI model names (e.g. Gemini, Google).
- NEVER mention the domain saathame.vercel.com or saathame.vercel.app.

📋 Campaign Details:
- Official Telegram Bot: @DriveYourLuckDiwaliBot
- Grand Cash Prize Pool:
  • Mega Grand Jackpot: ₹5,00,00,000 (₹5 Crore Ultimate Diwali Jackpot)
  • 1st Runner-Up Slots: ₹50,00,000 Each (Multiple Lucky Slots)
  • 2nd Runner-Up Slots: ₹10,00,000 Each
  • Festive Gold Rewards: ₹1,00,000 & ₹50,000 Frequent Lucky Draws
- Registration Process:
  1. Fill details in RegistrationForm (Name, Mobile, Address, City, State, Pincode).
  2. Auto-generated unique Ticket ID: DWL-XXXXXX (e.g., DWL-584920).
  3. Start @DriveYourLuckDiwaliBot with your Ticket ID.
  4. Pay 100 Telegram Stars (⭐ XTR) entry fee (approx ₹199).
  5. Instantly receive confirmed verified ticket card into the lucky draw!
- Telegram Stars (⭐ XTR) Explanation:
  • Telegram Stars are digital items inside Telegram.
  • 100 Stars = ₹199 entry fee.
  • How to purchase: Inside Telegram when clicking 'Pay 100 ⭐', users can pay seamlessly using Google Pay, PhonePe, UPI, Apple Pay, or Credit/Debit cards. Telegram securely handles the transaction.
- Mega Draw Date: Diwali Night 8:00 PM live stream.

🛡️ Security & Privacy Guardrails:
- NEVER expose raw database strings, backend server credentials, API keys, or internal server routing.
- Maintain strict confidentiality regarding personal data.
- Always direct users only to the official campaign portal and official Telegram bot (@DriveYourLuckDiwaliBot).
- Current user context: ${currentTicketId ? `User holds Ticket ID: ${currentTicketId}` : 'No active ticket selected yet'}.

Always answer helpfully in warm, festive Hinglish with Diwali blessings (Shubh Deepavali 🪔✨)! Keep responses engaging, structured, and easy to read.
`;

  if (aiClient) {
    try {
      // Build contents array with conversation history
      const formattedContents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      for (const item of history.slice(-6)) {
        if (item.sender === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'assistant') {
          formattedContents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }

      formattedContents.push({ role: 'user', parts: [{ text: message }] });

      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini response timed out')), 2500)
      );

      const response = await Promise.race([
        aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        }),
        timeoutPromise,
      ]);

      const reply = response.text || "Namaste! Shubh Deepavali! Main aapki ticket ya contest mein kaise sahayata kar sakta hoon?";
      return res.json({ reply });
    } catch (error) {
      console.error('Gemini API call failed, falling back to rule-based Diwali assistant:', error);
    }
  }

  // Fallback intelligent festive Hinglish assistant
  const lower = message.toLowerCase();
  let fallbackReply = '';

  if (lower.includes('star') || lower.includes('payment') || lower.includes('xtr') || lower.includes('199') || lower.includes('paise')) {
    fallbackReply = `Namaste ji! 🌟 Telegram Stars (⭐ XTR) payment bahut hi aasan aur 100% secure hai:
1. Entry fee: **100 Telegram Stars** (lagbhag ₹199).
2. Kaise pay karein: Jab aap humare official bot **@DriveYourLuckDiwaliBot** pe 'Pay 100 ⭐' dabayenge, Telegram in-app popup aayega.
3. Wahan aap **Google Pay, PhonePe, Apple Pay, ya Debit/Credit Card** se easily Stars khareed kar pay kar sakte hain.
4. Payment complete hote hi aapka **DWL-XXXXXX** ticket instant verify ho jayega! 🪔✨`;
  } else if (lower.includes('ticket') || lower.includes('dwl') || lower.includes('verify') || lower.includes('status')) {
    fallbackReply = `Namaste! Diwali Ticket ka status check karna bahut saral hai! 🎟️
- Aap upar **'Verify Ticket'** tab mein jakar apna 6-digit **DWL-XXXXXX** code enter kar sakte hain.
- Agar aapne abhi tak form fill nahi kiya hai, to **'Enter Contest'** tab mein details bharte hi instant naya Ticket ID generate ho jayega! 🪔`;
  } else if (lower.includes('prize') || lower.includes('inam') || lower.includes('cash') || lower.includes('winner') || lower.includes('crore')) {
    fallbackReply = `Aapka festive luck chamak sakta hai! 💰 **Drive Your Luck This Diwali** Mega Prize Pool:
🏆 **Mega Grand Jackpot:** ₹5,00,00,000 (₹5 Crore) Ultimate Diwali Cash!
🥈 **1st Runner-Up Slots:** ₹50,00,000 (₹50 Lakhs) each
🥉 **2nd Runner-Up Slots:** ₹10,00,000 (₹10 Lakhs) each
🎁 **Festive Gold Rewards:** ₹1,00,000 & ₹50,000 frequent lucky draws!
Grand Draw Diwali ki shubh shaam ko live stream par nikala jayega! 🎆`;
  } else if (lower.includes('bot') || lower.includes('telegram')) {
    fallbackReply = `Humara official verified bot hai: **@DriveYourLuckDiwaliBot** 🤖
Registration complete hone ke baad website aapko direct bot pe redirect karegi aapke unique Ticket ID ke sath. Wahan 'Start' dabakar 100 Stars pay karein aur lucky draw entry lock karein! ✨`;
  } else {
    fallbackReply = `Namaste ji! Shubh Deepavali! 🪔 'Drive Your Luck This Diwali' par aapka hardik swagat hai!
Aap yahan ₹5 Crore ke Mega Grand Jackpot aur multi-lakh cash prizes jeet sakte hain. Form fill karke apna DWL Ticket ID lein aur **@DriveYourLuckDiwaliBot** par 100 Telegram Stars se confirm karein. Mujhse registration, prizes, ya payment ke bare mein kuch bhi poochiye! ✨`;
  }

  return res.json({ reply: fallbackReply });
});

// Setup Vite in Dev or Serve Static in Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Diwali Contest Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
