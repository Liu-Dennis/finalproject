import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import session from "express-session";

dotenv.config();

const app = express();

app.use(session({ 
    secret: process.env.PASSPORT_SECRET, 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
function(req, res) {
    res.redirect('/');
});

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(obj, done) {
    const user = await users.findOne({ id: obj })
    // console.log(`Deserializing: ${obj} --> ${JSON.stringify(user)}`)
    done(null, user);
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENTSECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
async function(accessToken, refreshToken, profile, done) {
    // console.log(JSON.stringify(profile))
    let user_obj = {id: profile.id, username: profile.username}
    const user = await users.findOne({ id: profile.id })

    if (!user) {
        await users.insertOne( user_obj )
    }

    done(null, user_obj)
}
));


ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
