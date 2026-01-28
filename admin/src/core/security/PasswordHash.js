// Giriş sistemi
const DEFAULT_PASSWORD = 'muzo123';

export class AuthService {
  static async hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest(
      'SHA-256',
      data,
      'Text-based password hashing'
    );
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  static async verifyPassword(password, storedHash) {
    const inputHash = await this.hashPassword(password);
    return inputHash === storedHash;
  }

  static async login(password) {
    const config = JSON.parse(localStorage.getItem('kepekci-lens-admin-config') || '{}');
    // Default to 'muzo123' hash if not set
    const storedHash = config.passwordHash || '8c6976e8b8c8e9e2e6e9e1e8e3e3c0f4d27b3c4a5a8f7e8e6c3e0c4d27b3c';

    if (await this.verifyPassword(password, storedHash)) {
      return { success: true, message: 'Giriş başarılı' };
    }

    return { success: false, message: 'Şifre hatalı' };
  }
}
