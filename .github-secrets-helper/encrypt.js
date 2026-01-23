const _sodium = require('libsodium-wrappers');

const publicKeyBase64 = process.argv[2];
const secret1 = process.argv[3];
const secret2 = process.argv[4];
const keyId = process.argv[5];

if (!publicKeyBase64 || !secret1 || !secret2 || !keyId) {
  console.error('Usage: node encrypt.js <publicKey> <secret1> <secret2> <keyId>');
  process.exit(1);
}

async function encrypt(secret, publicKeyBase64) {
  await _sodium.ready;
  const sodium = _sodium;
  
  const publicKeyBytes = sodium.from_base64(publicKeyBase64, sodium.base64_variants.ORIGINAL);
  const messageBytes = sodium.from_string(secret);
  
  // GitHub uses libsodium sealed box (anonymous encryption)
  const encrypted = sodium.crypto_box_seal(messageBytes, publicKeyBytes);
  const encryptedBase64 = sodium.to_base64(encrypted, sodium.base64_variants.ORIGINAL);
  
  return encryptedBase64;
}

(async () => {
  const encrypted1 = await encrypt(secret1, publicKeyBase64);
  const encrypted2 = await encrypt(secret2, publicKeyBase64);
  
  console.log(JSON.stringify({
    CLOUDFLARE_API_TOKEN: { encrypted: encrypted1, key_id: keyId },
    CLOUDFLARE_ACCOUNT_ID: { encrypted: encrypted2, key_id: keyId }
  }));
})();
