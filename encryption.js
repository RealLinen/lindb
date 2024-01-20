const crypto = require('crypto');

function encrypt(text, key) {
  // Create a cipher with AES-256-ECB
  const cipher = crypto.createCipheriv('aes-256-ecb', key, null);

  // Encrypt the text
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);

  // Return the encrypted text
  return encrypted.toString('hex');
}

function decrypt(encryptedText, key) {
  // Create a decipher with AES-256-ECB
  const decipher = crypto.createDecipheriv('aes-256-ecb', key, null);

  // Decrypt the text
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()]);

  // Return the decrypted text
  return decrypted.toString('utf-8');
}

// Example usage
function BufferToString(buffer) {
    return buffer.toString("base64")
}

function getKey(key) { // Gets the key if buffer
    if (typeof(key) == "string") {
        key = Buffer.from(key, "base64")
    }
    return key
}
function generateKey() {
    // Generate a random 256-bit (32-byte) key
    return crypto.randomBytes(32);
}

module.exports = {
  encrypt,
  decrypt,
  generateKey,
  BufferToString,
  getKey
};