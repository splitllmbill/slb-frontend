import CryptoJS from 'crypto-js';

export function encrypt(plaintext: string): string {
    const aes_key = import.meta.env.VITE_ENC_KEY;
    const aes_iv = import.meta.env.VITE_ENC_IV;
    const key = CryptoJS.enc.Utf8.parse(aes_key);
    const iv = CryptoJS.enc.Utf8.parse(aes_iv);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, { iv: iv });
    return encrypted.toString(); //returns the encrypted string
}
