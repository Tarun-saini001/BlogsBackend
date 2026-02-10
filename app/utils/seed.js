const bcrypt = require("bcrypt");
const { userModel } = require("../modules/onBoarding1/models/user");
const { USER_TYPES, GENDER } = require("../config/constants");
// const User = require("../modules/onBoarding1/models/user");

const seedUsers = async () => {
    try {
        const hashPassword = async (password) => {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        };

        const users = [
            {
                name: "Demo User",
                age: 25,
                gender: GENDER.MALE, // Example
                email: "user@yopmail.com",
                countryCode: "+1",
                phoneNumber: "9876543210",
                password: await hashPassword("Test@123"),
                address: "California, USA",
                isEmailVerified: true,
                role: USER_TYPES.USER
            },
            {
                name: "Demo Admin",
                age: 28,
                gender: GENDER.MALE, // Example
                email: "admin@yopmail.com",
                countryCode: "+91",
                phoneNumber: "9876543201",
                password: await hashPassword("Test@123"),
                address: "Mumbai, India",
                isEmailVerified: true,
                role: USER_TYPES.ADMIN
            }
        ];

        for (const user of users) {
            await userModel.updateOne(
                { email: user.email }, // match by email
                { $set: user },
                { upsert: true, new: true }
            );
        }

        // for (const user of users) {
        //     await User.upsert(user, {
        //         where: { email: user.email }, // ensures uniqueness
        //     });
        // }
        console.log("Users seeded successfully!");

    } catch (error) {
        console.error("Error seeding users:", error);
    }
};

module.exports = { seedUsers };



// const bcrypt = require("bcrypt");
// const User = require("../modules/onBoarding1/models/user");
// const { USER_TYPES, GENDER } = require("../config/constants");

// const seedUsers = async () => {
//   try {
//     const hashPassword = async (password) => {
//       const salt = await bcrypt.genSalt(10);
//       return await bcrypt.hash(password, salt);
//     };

//     const users = [
//       {
//         name: "Demo User",
//         age: 25,
//         gender: GENDER.MALE,
//         email: "user@yopmail.com",
//         countryCode: "+1",
//         phoneNumber: "9876543210",
//         password: await hashPassword("Test@123"),
//         address: "California, USA",
//         isEmailVerified: true,
//         role: USER_TYPES.USER,
//       },
//       {
//         name: "Demo Admin",
//         age: 28,
//         gender: GENDER.MALE,
//         email: "admin@yopmail.com",
//         countryCode: "+91",
//         phoneNumber: "9876543201",
//         password: await hashPassword("Test@123"),
//         address: "Mumbai, India",
//         isEmailVerified: true,
//         role: USER_TYPES.ADMIN,
//       },
//     ];

//     for (const user of users) {
//       // Check if user already exists by email
//       const existingUser = await User.findOne({ where: { email: user.email } });

//       if (existingUser) {
//         // Update existing user
//         await existingUser.update(user);
//       } else {
//         // Create new user
//         await User.create(user);
//       }
//     }

//     console.log("Users seeded successfully!");
//   } catch (error) {
//     console.error("Error seeding users:", error);
//   }
// };

// module.exports = { seedUsers };
