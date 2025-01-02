const validationResponse = (res, errors) => {
    return res.status(400).json({ errors: errors.mapped() });
};

module.exports = validationResponse;
