"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_local_1 = require("passport-local");
const logger_1 = __importDefault(require("../../../common/logger"));
const passport = __importStar(require("passport"));
const client_1 = require("@prisma/client");
const utils_1 = __importDefault(require("./utils"));
const prisma = new client_1.PrismaClient();
// Config
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || "default",
};
// Strategy
const jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, async (payload, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                id: payload.id,
            },
        });
        // Mappr the user to the DTO
        if (!user) {
            return done(null, false); // User not found
        }
        return done(null, { user }); // Pass user ID to the request object
    }
    catch (error) {
        logger_1.default.error(error);
        return done(error, false);
    }
});
const localStrategy = new passport_local_1.Strategy({
    usernameField: "email",
    passwordField: "password",
}, async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return done(null, false, { message: "User does not exist." });
        }
        if (!utils_1.default.validatePassword(password, user.password)) {
            return done(null, false, { message: "Invalid credentials." });
        }
        logger_1.default.info("User Logins: " + JSON.stringify(user));
        return done(null, user);
    }
    catch (err) {
        logger_1.default.error(err);
        return done(err);
    }
});
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });
// passport.deserializeUser(async (id : number, done) => {
//   try {
//     const user = await prisma.user.findUnique({ where: { id : id} });
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });
// passport.use(
//   new Google(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/auth/google/callback',
//     },((accessToken, refreshToken, profile, done) => {
//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               googleId: profile.id,
//               username: profile.displayName,
//               email: profile.emails[0].value,
//             },
//           });
//         }
//         done(null, user);
//       } catch (err) {
//         done(err, null);
//       }
//     })
// );
// Export
passport.use(jwtStrategy);
passport.use(localStrategy);
exports.default = passport;
//# sourceMappingURL=passport.strategy.js.map