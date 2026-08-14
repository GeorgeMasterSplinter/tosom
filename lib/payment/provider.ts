/**
 * ToSom — PaymentProvider grensesnitt (G1)
 *
 * Plug-and-play-forberedelse: når Vipps-kodene kommer, skal kun
 * adapteren skrives. Alt rundt er bygget nå.
 */

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface WebhookResult {
  orderId: string;
  status: OrderStatus;
  providerRef: string;
}

export interface PaymentProvider {
  /** Opprett ordre, returner redirect-URL og provider-referanse */
  createOrder(userId: string, amount: number): Promise<{ redirectUrl: string; ref: string }>;

  /** Verifiser webhook (rå body + headers for signatursjekk) */
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookResult>;

  /** Sjekk ordrestatus mot provider */
  getStatus(ref: string): Promise<OrderStatus>;
}