"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = require("passport-jwt");
const passport_google_oauth2_1 = require("passport-google-oauth2");
const passport_local_1 = require("passport-local");
const logger_1 = __importDefault(require("../../../common/logger"));
const passport_1 = __importDefault(require("passport"));
const client_1 = require("@prisma/client");
const utils_1 = __importDefault(require("./utils"));
const provider_service_1 = __importDefault(require("../user/provider/provider.service"));
const user_service_1 = __importDefault(require("../user/user.service"));
const google_service_1 = __importDefault(require("./google.service"));
const prisma = new client_1.PrismaClient();
// Config
const jwtOptions = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'default',
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
        // TODO: Handle error
        logger_1.default.error(error);
        return done(error, false);
    }
});
const localStrategy = new passport_local_1.Strategy({
    usernameField: 'email',
    passwordField: 'password',
}, async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!user) {
            return done(null, false, { message: 'User does not exist.' });
        }
        if (!(await utils_1.default.validatePassword(password, user.password))) {
            return done(null, false, { message: 'Invalid credentials.' });
        }
        logger_1.default.info('User Logins: ' + JSON.stringify(user));
        return done(null, user);
    }
    catch (err) {
        logger_1.default.error(err);
        return done(err);
    }
});
const google = new passport_google_oauth2_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // TODO: Add Accesstoken verify to add different email
        // TODO: Add verify 
        var user = await user_service_1.default.findBy('email', profile.email);
        if (user === null) {
            done({ message: 'User not found!' }, null);
            return;
        }
        await provider_service_1.default.create(user.id, profile.provider, profile.id);
        // }
        logger_1.default.info('User Logins: ' + JSON.stringify(profile));
        google_service_1.default.updateUserProfile(user.id, profile);
        done(null, user);
        accessToken;
        refreshToken;
    }
    catch (err) {
        logger_1.default.error(err);
        done(err, null);
    }
});
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser(async (id, done) => {
    try {
        user_service_1.default
            .byId(id)
            .then((user) => {
            done(null, user);
        })
            .catch((err) => {
            done(err, null);
        });
    }
    catch (err) {
        done(err, null);
    }
});
// Export
passport_1.default.use(jwtStrategy);
passport_1.default.use(localStrategy);
passport_1.default.use(google);
exports.default = passport_1.default;
//# sourceMappingURL=passport.strategy.js.map