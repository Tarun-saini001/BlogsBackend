const z = require("zod");

const signupValidation = z.object({
    name: z.string().min(1, "Name is required").optional(),

    age: z
        .number({ invalid_type_error: "Age must be a number" })
        .int()
        .min(1, "Age must be greater than 0").optional(),

    gender: z.number().min(1).max(3).optional(),

    email: z
        .string()
        .email("Invalid email format").optional(),

    countryCode: z
        .string()
        .regex(/^\+\d{1,3}$/)
        .optional(),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits").optional(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    address: z
        .string()
        .min(1, "Address is required").optional(),

    jti: z
        .string()
        .optional(),

    role: z
        .number()
        .min(1)
        .max(2).optional(), // USER_TYPES = { USER:1, ADMIN:2 }
}).refine((data) => data.phoneNumber || data.email, {
    message: "Either phone or email is required",
});

module.exports = { signupValidation }
