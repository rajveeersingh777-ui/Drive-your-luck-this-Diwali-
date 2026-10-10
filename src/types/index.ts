export interface ParticipantDetails {
  fullName: string;
  mobile: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export type TicketStatus = 'pending_payment' | 'verified';

export interface DiwaliTicket {
  ticketId: string;
  fullName: string;
  maskedMobile: string;
  city: string;
  state: string;
  pincode: string;
  status: TicketStatus;
  feeStars: number;
  feeInr: number;
  telegramBotHandle: string;
  telegramBotUrl: string;
  createdAt: string;
  verifiedAt?: string;
  transactionRef?: string;
  paymentMethod?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'open_registration' | 'open_verifier' | 'open_telegram' | 'view_prizes';
    label: string;
    ticketId?: string;
  };
}
