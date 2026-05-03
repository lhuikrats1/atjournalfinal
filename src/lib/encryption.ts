import cryptoJs from "crypto-js";

// Ensure this environment variable is 32-bytes long for AES-256
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "a".repeat(32); // fallback for dev

export function encrypt(text: string): string {
  if (!text) return text;
  return cryptoJs.AES.encrypt(text, ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ciphertext;
  try {
    const bytes = cryptoJs.AES.decrypt(ciphertext, ENCRYPTION_KEY);
    return bytes.toString(cryptoJs.enc.Utf8);
  } catch (error) {
    console.error("Decryption failed:", error);
    return "";
  }
}
