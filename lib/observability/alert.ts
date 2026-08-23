/**
 * ToSom — Alert Module (B5.6)
 * 
 * sendAlert(severity, title, detail)
 * Kanal fra env i prioritert rekkefølge:
 * 1. ALERT_WEBHOOK_URL (Slack/Discord)
 * 2. ALERT_EMAIL_TO (nodemailer finnes)
 * 3. Sentry.captureMessage som fallback
 * 
 * Ingen ny avhengighet.
 */

export type AlertSeverity = 'info' | 'warning' | 'critical';

interface AlertPayload {
  severity: AlertSeverity;
  title: string;
  detail: string;
  timestamp: string;
}

/** Send alert til Slack/Discord webhook */
async function sendWebhook(payload: AlertPayload, url: string): Promise<boolean> {
  try {
    const emoji = payload.severity === 'critical' ? '🔴' : payload.severity === 'warning' ? '🟡' : '🟢';
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        // Slack-format
        text: `${emoji} [${payload.severity.toUpperCase()}] ${payload.title}`,
        attachments: [{
          color: payload.severity === 'critical' ? 'danger' : payload.severity === 'warning' ? 'warning' : 'good',
          fields: [
            { title: 'Title', value: payload.title, short: false },
            { title: 'Detail', value: payload.detail, short: false },
            { title: 'Time', value: payload.timestamp, short: true },
          ],
        }],
        // Discord-format (fallback)
        content: `${emoji} **${payload.title}**\n${payload.detail}`,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/** Send alert til e-post via lib/email (leser EMAIL_SERVER_*) */
async function sendEmail(payload: AlertPayload, to: string): Promise<boolean> {
  try {
    const { sendAlertEmail } = await import('@/lib/email');
    const result = await sendAlertEmail(
      to,
      payload.severity,
      payload.title,
      payload.detail,
      payload.timestamp
    );
    return result.success;
  } catch {
    return false;
  }
}

/** Send alert til Sentry som fallback */
async function sendSentry(payload: AlertPayload): Promise<boolean> {
  try {
    const Sentry = await import('@sentry/nextjs').catch(() => null);
    if (!Sentry) return false;

    Sentry.captureMessage(`[${payload.severity.toUpperCase()}] ${payload.title}: ${payload.detail}`, {
      level: payload.severity === 'critical' ? 'error' : payload.severity === 'warning' ? 'warning' : 'info',
      tags: { source: 'tosom-alert' },
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Send alert i prioritert rekkefølge:
 * 1. ALERT_WEBHOOK_URL (Slack/Discord)
 * 2. ALERT_EMAIL_TO (e-post)
 * 3. Sentry fallback
 */
export async function sendAlert(
  severity: AlertSeverity,
  title: string,
  detail: string
): Promise<void> {
  const payload: AlertPayload = {
    severity,
    title,
    detail,
    timestamp: new Date().toISOString(),
  };

  // Logg alltid til konsoll
  console.log(`[ALERT ${severity.toUpperCase()}] ${title}: ${detail}`);

  // 1. Webhook
  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (webhookUrl && await sendWebhook(payload, webhookUrl)) {
    return;
  }

  // 2. E-post
  const emailTo = process.env.ALERT_EMAIL_TO;
  if (emailTo && await sendEmail(payload, emailTo)) {
    return;
  }

  // 3. Sentry fallback
  await sendSentry(payload);
}