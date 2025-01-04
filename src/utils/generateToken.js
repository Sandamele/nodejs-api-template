const crypto = require("crypto");
const generateToken = (length = 32) => {
    // Create a random array of bytes
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    // Convert to a Base64 string
    return btoa(String.fromCharCode(...array));
};

module.exports = generateToken;
