import * as crypto from 'crypto';

/**
 * Utility class for cryptographic operations that matches legacy Delphi implementation
 */
export class CryptoUtil {
  private static readonly SALT = 'j5*k.9S8W6*(/OG5#1987345ljhn34p5';
  private static readonly KEY_LENGTH = 32; // 256 bits
  private static readonly IV_LENGTH = 16; // 128 bits for CBC mode
  private static readonly ALGORITHM = 'aes-256-cbc';

  /**
   * Decrypts a base64 encoded string using AES-256-CBC to match Delphi's TAESEncryption
   * @param encryptedBase64 The base64 encoded encrypted string
   * @param password The password to use for decryption (optional, defaults to SALT)
   * @returns The decrypted string
   */
  public static decryptString(
    encryptedBase64: string,
    password: string = CryptoUtil.SALT,
  ): string {
    try {
      // Convert the base64 string to a buffer
      const encryptedBuffer = Buffer.from(encryptedBase64, 'base64');

      // In TAESEncryption, the IV is the first block
      const iv = encryptedBuffer.subarray(0, CryptoUtil.IV_LENGTH);
      const encryptedContent = encryptedBuffer.subarray(CryptoUtil.IV_LENGTH);

      // In Delphi's TAESEncryption, the key is padded/truncated to exactly KEY_LENGTH
      let key = Buffer.from(password);
      if (key.length > CryptoUtil.KEY_LENGTH) {
        key = key.subarray(0, CryptoUtil.KEY_LENGTH);
      } else if (key.length < CryptoUtil.KEY_LENGTH) {
        key = Buffer.concat([
          key,
          Buffer.alloc(CryptoUtil.KEY_LENGTH - key.length, 0),
        ]);
      }

      // Create decipher
      const decipher = crypto.createDecipheriv(CryptoUtil.ALGORITHM, key, iv);

      // Disable automatic padding to match Delphi behavior
      decipher.setAutoPadding(false);

      // Decrypt
      const decrypted = Buffer.concat([
        decipher.update(encryptedContent),
        decipher.final(),
      ]);

      // Remove PKCS7 padding manually
      const padLength = decrypted[decrypted.length - 1];
      const unpadded = decrypted.subarray(0, decrypted.length - padLength);

      return unpadded.toString('utf8');
    } catch (error) {
      console.error('Decryption error:', error);
      return encryptedBase64; // Match Delphi's behavior of returning original text on error
    }
  }
}
