/**
 * Sends a validation error response with a mapped list of errors.
 *
 * @param {Object} res - The Express response object.
 * @param {Object} errors - The validation errors object from `express-validator`.
 * @returns {Object} - JSON response with a 400 status code and mapped errors.
 *
 * @example
 * const { validationResult } = require("express-validator");
 * const validationResponse = require("./validationResponse");
 *
 * const someRouteHandler = (req, res) => {
 *     const errors = validationResult(req);
 *     if (!errors.isEmpty()) {
 *         return validationResponse(res, errors);
 *     }
 *     // Continue with request processing...
 * };
 */
const validationResponse = (res, errors) => {
    return res.status(400).json({ errors: errors.mapped() });
};

module.exports = validationResponse;
