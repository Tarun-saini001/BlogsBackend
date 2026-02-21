const z = require("zod");

const signupValidation = z.object({
    name: z.string().trim().min(1, "Name is required").optional(),
    userName: z.string().trim().min(1, "Username is required").optional(),

    age: z
        .number({ invalid_type_error: "Age must be a number" })
        .int()
        .min(1, "Age must be greater than 0").optional(),

    gender: z.number().min(1).max(3).optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email format").optional(),

    countryCode: z
        .string()
        .trim()
        .regex(/^\+\d{1,3}$/)
        .optional(),

    phoneNumber: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 digits").optional(),

    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters"),

    address: z
        .string()
        .trim()
        .min(1, "Address is required").optional(),

    jti: z
        .string()
        .trim()
        .optional(),

    role: z
        .number()
        .min(1)
        .max(2).optional(), // USER_TYPES = { USER:1, ADMIN:2 }
}).refine((data) => data.phoneNumber || data.email, {
    message: "Either phone or email is required",
});

const verifyOtpValidation = z.object({
    email: z
        .string()
        .trim()
        .email("Invalid email format").optional(),
    countryCode: z
        .string()
        .trim()
        .regex(/^\+\d{1,3}$/)
        .optional(),
    password: z
        .string()
        .trim()
        .min(6, "Password must be at least 6 characters").optional(),
    phoneNumber: z
        .string()
        .trim()
        .min(10, "Phone number must be at least 10 digits").optional(),
    otp: z
        .number(),
    otpType: z
        .number().min(1).max(4),
    role: z
        .number()
        .min(1)
        .max(2).optional(),
    expiredAt: z.string().datetime().optional(),
})

const loginValidation = z.object({
    email: z.string().trim().email("Invalid email format").optional(),

    countryCode: z
        .string()
        .regex(/^\+\d{1,3}$/, "Invalid country code")
        .optional(),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .optional(),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),
})
    .refine((data) => data.email || data.phoneNumber, {
        message: "Either email or phone number is required",
        path: ["email"], // error will be attached here
    });

const updateProfileValidation = z.object({
    name: z.string().min(1, "Name is required").optional(),

    age: z.coerce
        .number({ invalid_type_error: "Age must be a number" })
        .int()
        .min(1, "Age must be greater than 0").optional(),

    gender: z.coerce
        .number()
        .min(1, "Invalid gender")
        .max(3, "Invalid gender").optional(),

    address: z.string().min(1, "Address is required").optional(),

    email: z.string().email("Invalid email format").optional(),

    countryCode: z
        .string()
        .regex(/^\+\d{1,3}$/, "Invalid country code")
        .optional(),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .optional(),
});

const changePasswordValidation = z.object({
    oldPassword: z.string().optional(),
    newPassword: z.string(),
    isResetPassword: z.string().optional()
});

const forgotPasswordValidation = z.object({
    email: z.string().email("Invalid email format").optional(),

    countryCode: z
        .string()
        .regex(/^\+\d{1,3}$/, "Invalid country code")
        .optional(),

    phoneNumber: z
        .string()
        .min(10, "Phone number must be at least 10 digits")
        .optional(),
    otpType: z
        .number().min(1).max(4).optional(),
    otp: z
        .number().optional(),
})
    .refine((data) => data.email || data.phoneNumber, {
        message: "Either email or phone number is required",
        path: ["email"], // error will be attached here
    });



 const registerValiation = z.object({
    name: z
        .string()
        .trim() // removes leading/trailing spaces
        .min(3, { message: "Name must be at least 3 characters" }) 
        .refine((val) => val.length > 0, { message: "Name cannot be only spaces" }),

    email: z
        .string()
        .trim()
        .email({ message: "Invalid email address" }),

    password: z
        .string()
        .trim()
        .min(6, { message: "Password must be at least 6 characters" }),
});

module.exports = { signupValidation, verifyOtpValidation, loginValidation, updateProfileValidation, changePasswordValidation, forgotPasswordValidation, registerValiation }
