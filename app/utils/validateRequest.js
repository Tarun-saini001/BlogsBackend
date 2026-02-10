
const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.parse(req.body); // validate incoming body
            req.validatedData = result;           // store validated data
            next();
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: error.errors,  // zod validation errors
            });
        }
    };
};

module.exports = validateRequest;
