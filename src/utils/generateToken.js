const crypto = require("crypto");
/**
 * Generates a secure random token of the specified length.
 *
 * @param {number} [length=32] - The desired length of the token in bytes. Defaults to 32.
 * @returns {string} - A Base64-encoded string representing the generated token.
 *
 * @example
 * const generateToken = require("./generateToken");
 * const token = generateToken(64); // Generate a 64-byte token
 * console.log(token); // Outputs a Base64-encoded string
 */
const generateToken = (length = 32) => {
    // Create a random array of bytes
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);

    // Convert to a Base64 string
    return btoa(String.fromCharCode(...array));
};

module.exports = generateToken;
