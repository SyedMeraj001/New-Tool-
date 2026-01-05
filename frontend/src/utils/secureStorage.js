class SecureStorage {
  static isEncryptionEnabled() {
    return localStorage.getItem('encryption_enabled') === 'true';
  }

  static encrypt(data) {
    if (!this.isEncryptionEnabled()) return data;
    
    try {
      // Simple base64 encoding for demo (in real app, use proper AES encryption)
      return btoa(JSON.stringify(data));
    } catch (error) {
      console.error('Encryption failed:', error);
      return data;
    }
  }

  static decrypt(encryptedData) {
    if (!this.isEncryptionEnabled()) return encryptedData;
    
    try {
      // Simple base64 decoding for demo
      return JSON.parse(atob(encryptedData));
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedData;
    }
  }

  static setItem(key, value) {
    const encryptedValue = this.encrypt(value);
    localStorage.setItem(key, typeof encryptedValue === 'string' ? encryptedValue : JSON.stringify(encryptedValue));
  }

  static getItem(key) {
    const value = localStorage.getItem(key);
    if (!value) return null;
    
    try {
      return this.decrypt(value);
    } catch (error) {
      return value;
    }
  }
}

export default SecureStorage;