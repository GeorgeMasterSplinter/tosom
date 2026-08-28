import { z } from "zod";

/**
 * Validering for passord-tilbakestilling.
 */
export const requestResetSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
});

export const verifyResetSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  token: z.string().min(32, "Token må være minst 32 tegn"),
});

export const resetPasswordSchema = z.object({
  email: z.string().email("Ugyldig e-postadresse"),
  token: z.string().min(32, "Token må være minst 32 tegn"),
  password: z.string().min(8, "Passord må være minst 8 tegn"),
});

export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type VerifyResetInput = z.infer<typeof verifyResetSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Validering for 2FA-setup.
 */
export const setup2FASchema = z.object({
  password: z.string().min(1, "Passord er påkrevd for å bekrefte identitet"),
});

export const verify2FASchema = z.object({
  token: z.string().min(6, "TOTP-kode må være minst 6 tegn"),
  backupCode: z.string().optional(),
});

export const disable2FASchema = z.object({
  password: z.string().min(1, "Passord er påkrevd"),
  code: z.string().min(6, "TOTP-kode er påkrevd"),
});

export type Setup2FAInput = z.infer<typeof setup2FASchema>;
export type Verify2FAInput = z.infer<typeof verify2FASchema>;
export type Disable2FAInput = z.infer<typeof disable2FASchema>;
