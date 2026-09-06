// Generates a short booking code like "RS-4K7A29".
// Deliberately avoids 0/O and 1/I/L so it's easy to read aloud or hand-write
// at a fair price shop counter — this code plus a phone number is meant to
// fully replace needing a smartphone, an app, or a biometric scan at the
// shop end.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function generateBookingCode() {
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `RS-${code}`;
}

module.exports = { generateBookingCode };
