// ============================================================
// TokenEncryptionService — AES-256-GCM
// Encrypts OAuth access/refresh tokens before DB storage.
// Key: TOKEN_ENCRYPTION_KEY env var (base64 of 32 random bytes)
//
// Generate key:  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
// ============================================================
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH  = 16; // bytes
const TAG_LENGTH = 16; // bytes — GCM auth tag

@Injectable()
export class TokenEncryptionService {
  private readonly logger = new Logger(TokenEncryptionService.name);
  private readonly key: Buffer;
  private readonly enabled: boolean;

  constructor(private config: ConfigService) {
    const keyBase64 = this.config.get<string>('TOKEN_ENCRYPTION_KEY');

    if (!keyBase64) {
      this.logger.warn(
        'TOKEN_ENCRYPTION_KEY not set — tokens stored un-encrypted (dev-only, NEVER use in prod)',
      );
      this.key = Buffer.alloc(32, 0); // zero key — noop for dev
      this.enabled = false;
    } else {
      const buf = Buffer.from(keyBase64, 'base64');
      if (buf.length !== 32) {
        throw new Error(
          `TOKEN_ENCRYPTION_KEY must encode exactly 32 bytes. Got ${buf.length}. ` +
          `Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`,
        );
      }
      this.key = buf;
      this.enabled = true;
    }
  }

  /**
   * Encrypt a plaintext token.
   * Output format: base64(iv[16] + authTag[16] + ciphertext)
   */
  encrypt(plaintext: string | null | undefined): string | null {
    if (!plaintext) return null;
    if (!this.enabled) return plaintext; // dev passthrough

    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, this.key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }

  /**
   * Decrypt a token previously encrypted with encrypt().
   * Returns null if decryption fails (expired/tampered/wrong key).
   */
  decrypt(encryptedBase64: string | null | undefined): string | null {
    if (!encryptedBase64) return null;
    if (!this.enabled) return encryptedBase64; // dev passthrough

    try {
      const buf        = Buffer.from(encryptedBase64, 'base64');
      const iv         = buf.subarray(0, IV_LENGTH);
      const tag        = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
      const ciphertext = buf.subarray(IV_LENGTH + TAG_LENGTH);

      const decipher = crypto.createDecipheriv(ALGORITHM, this.key, iv);
      decipher.setAuthTag(tag);

      return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
    } catch {
      this.logger.error('Token decryption failed — token may be tampered or key rotated');
      return null;
    }
  }

  /** Whether encryption is active (false = dev/no-key mode) */
  get isEnabled(): boolean {
    return this.enabled;
  }
}
