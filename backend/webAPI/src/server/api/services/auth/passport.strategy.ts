import { ExtractJwt, Strategy as Jwt } from "passport-jwt";
import { Strategy as Google } from "passport-google-oauth2";
import { Strategy as Local } from "passport-local";
import L from "../../../common/logger";
import passport from "passport";
import { PrismaClient } from "@prisma/client";
import Utils from "./utils";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

// Config
const jwtOptions: any = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET || "default",
};

// Strategy
const jwtStrategy = new Jwt(jwtOptions, async (payload, done: any) => {
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
  } catch (error) {
    // TODO: Handle error
    L.error(error);
    return done(error, false);
  }
});

const localStrategy = new Local(
  {
    usernameField: "email",
    passwordField: "password",
  },  
  async (email, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      if (!user) {
        return done(null, false, { message: "User does not exist." });
      }

      if (!(await Utils.validatePassword(password, user.password))) {
        return done(null, false, { message: "Invalid credentials." });
      }
      L.info("User Logins: " + JSON.stringify(user));
      return done(null, user);
    } catch (err) {
      L.error(err);
      return done(err);
    }
  }
);

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

export default passport;
