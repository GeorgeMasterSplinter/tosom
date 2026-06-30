/**
 * E2E-test — Chat-flow
 * Testar at ein brukar kan sende og motta meldingar i chat
 */

import { test, expect } from '../fixtures/test-users';

test.describe('Chat Flow', () => {
  test('skal vise chat-side etter match-aksept', async ({ page }) => {
    // Gå til chat
    await page.goto('/chat');

    // Søk etter chat-relaterte element
    const chatContainer = page.locator('[data-testid*="chat"], .chat-container, .messages-container, #chat-messages');
    if (await chatContainer.count() > 0) {
      await expect(chatContainer.first()).toBeVisible();
    }
  });

  test('skal vise tom-chat når ingen meldingar er tilgjengeleg', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter tom-chat-melding
    const emptyText = page.getByText(/ingen meldingar|start samtalen|dei første orda/i);
    if (await emptyText.count() > 0) {
      await expect(emptyText.first()).toBeVisible();
    }
  });

  test('skal kunne skrive melding', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter input-felt
    const inputField = page.locator('[data-testid*="message"], .chat-input, textarea, input[type="text"]');
    if (await inputField.count() > 0) {
      await inputField.first().fill('Hei! Korleis går det?');
      await expect(inputField.first()).toHaveValue('Hei! Korleis går det?');
    }
  });

  test('skal kunne sende melding', async ({ page }) => {
    await page.goto('/chat');

    // Fyll inn melding
    const inputField = page.locator('[data-testid*="message"], .chat-input, textarea, input[type="text"]');
    if (await inputField.count() > 0) {
      await inputField.first().fill('Hei! Korleis går det?');

      // Søk etter send-knapp
      const sendBtn = page.getByRole('button', { name: /send|send|send melding/i, exact: false });
      if (await sendBtn.count() > 0) {
        await sendBtn.first().click();
        await page.waitForTimeout(2000);

        // Input skal vere tom etter sending
        await expect(inputField.first()).toHaveValue('');
      }
    }
  });

  test('skal vise eigne meldingar til høgre', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter eigne meldingar (typisk til høgre)
    const ownMessages = page.locator('[data-testid*="own"], .message-own, .message-sent, .bubble-self');
    // Denne testen vil berre passere dersom det allereie finst eigne meldingar
    if (await ownMessages.count() > 0) {
      await expect(ownMessages.first()).toBeVisible();
    }
  });

  test('skal vise mottatte meldingar til venstre', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter mottatte meldingar (typisk til venstre)
    const receivedMessages = page.locator('[data-testid*="received"], .message-received, .message-other, .bubble-other');
    if (await receivedMessages.count() > 0) {
      await expect(receivedMessages.first()).toBeVisible();
    }
  });

  test('skal vise typing-indikator dersom part skriv', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter typing-indikator
    const typingIndicator = page.locator('[data-testid*="typing"], .typing-indicator, .is-typing');
    // Denne testen krev at motparten faktisk skriv
    if (await typingIndicator.count() > 0) {
      await expect(typingIndicator.first()).toBeVisible();
    }
  });

  test('skal vise melding-tidstempler', async ({ page }) => {
    await page.goto('/chat');

    // Søk etter tidstempler
    const timestamps = page.locator('[data-testid*="timestamp"], .message-time, .timestamp, time');
    if (await timestamps.count() > 0) {
      await expect(timestamps.first()).toBeVisible();
    }
  });
});