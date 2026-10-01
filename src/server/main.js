import express from "express";
import ViteExpress from "vite-express";
import dotenv from "dotenv";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";

dotenv.config();

const app = express();

// DB init
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
})
let collection = null
let users = null
let widgets = null
let posts = null

openDB();

// Auth init
const redirect_url = "http://localhost:3000/pfolio/"
app.use(session({ 
    secret: process.env.PASSPORT_SECRET, 
    resave: false, 
    saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/' }),
function(req, res) {
    res.redirect(redirect_url + req.user._id);
});

app.post('/auth/local',

    function(req, res, next) {
        console.log("POST /auth/local");
        console.log("Body:", req.body);
        next();
    },

    passport.authenticate('local', { failureRedirect: '/' }),

    function(req, res) {
        console.log("Authenticating local user");
        console.log("User:", req.user);

        res.redirect(redirect_url + req.user._id);
    }
);

app.get('/auth/logout', function(req, res, next){
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

passport.serializeUser(function(user, done) {
    console.log(`Serializing: ${JSON.stringify(user)}`)
    done(null, user._id);
});

passport.deserializeUser(async function(obj, done) {
    const user = await users.findOne({ _id: new ObjectId(obj) })
    console.log(`Deserializing: ${obj} --> ${JSON.stringify(user)}`)
    done(null, user);
});

passport.use(new LocalStrategy(
  async function(username, password, done) {
    // create user obj
    let user_obj = { username: username }
    
    const user = await users.findOne(user_obj)
    console.log(`Searching for local user: ${JSON.stringify(user_obj)}`)

    // if user doesn't exist, create it
    if (!user) {
        user_obj.password = password
        await users.insertOne( user_obj )
        return done(null, user_obj);
    }

    // User exists, but password is wrong
    if (user.password !== password) {
        return done(null, false);
    }

    return done(null, user);
  }
));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENTID,
    clientSecret: process.env.GITHUB_CLIENTSECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
},
async function(accessToken, refreshToken, profile, done) {
    // console.log(JSON.stringify(profile))
    let user_obj = {username: profile.username, githubID: profile.id}
    let user = await users.findOne({ githubID: user_obj.githubID })

    if (!user) {
        // insertOne returns { insertedId }, not the document itself
        const result = await users.insertOne( user_obj )
        user_obj._id = result.insertedId
    } else {
        user_obj._id = user._id
    }

    done(null, user_obj)
}
));

app.get('/user/username', ensureAuthenticated, function(req, res) {
  res.json(req.user.username);
});

app.post('/user/widgets', express.json(), async (req, res) => {
    console.log(`Post Received: ${JSON.stringify( req.body )}`)

    if (widgets !== null) {
        const docs = await widgets.find({_id: new ObjectId("6abc36b3651066defb89b1ca")}).toArray()
        res.json( docs )
    }
})

// ---------------------------------------------------------------------------
// Portfolio API
//
// Ownership rule: the server NEVER trusts the client about who owns what.
//   - Reads are public (anyone can view a portfolio).
//   - Every write uses req.user._id from the session, and every post query is
//     scoped with { owner: req.user._id }, so a user can only touch their own
//     posts even if they hand-craft a request with someone else's post id.
//   - isOwner is sent to the client only so it knows whether to show the edit
//     sidebar. Hiding/showing UI is cosmetic; the checks below are the security.
// ---------------------------------------------------------------------------

// Who is logged in right now? (null if nobody). Never send the password back.
app.get('/api/me', (req, res) => {
    if (!req.isAuthenticated() || !req.user) return res.json(null);
    res.json({ _id: req.user._id.toString(), username: req.user.username });
});

// Public: view a portfolio. Includes isOwner so the client can show edit tools.
app.get('/api/portfolio/:uid', async (req, res) => {
    const { uid } = req.params;
    if (!ObjectId.isValid(uid)) {
        return res.status(404).json({ error: "Portfolio not found" });
    }

    const owner = await users.findOne(
        { _id: new ObjectId(uid) },
        { projection: { password: 0 } }
    );
    if (!owner) {
        return res.status(404).json({ error: "Portfolio not found" });
    }

    const ownerPosts = await posts
        .find({ owner: owner._id })
        .sort({ createdAt: -1 })
        .toArray();

    res.json({
        profile: {
            _id: owner._id.toString(),
            username: owner.username,
            bio: owner.bio ?? "",
            avatarUrl: owner.avatarUrl ?? "",
        },
        posts: ownerPosts,
        isOwner: isOwner(req, uid),
    });
});

// Owner only: update your own profile (bio / avatar). No uid in the URL on
// purpose -- you can only ever edit the profile of the logged in user.
app.put('/api/profile', ensureAuthenticated, async (req, res) => {
    const update = {
        bio: cleanString(req.body.bio, 1000),
        avatarUrl: cleanString(req.body.avatarUrl, 2000),
    };
    await users.updateOne({ _id: req.user._id }, { $set: update });
    res.json(update);
});

// Owner only: create a post on your own portfolio.
app.post('/api/posts', ensureAuthenticated, async (req, res) => {
    const fields = readPostFields(req.body);
    if (!fields.title) {
        return res.status(400).json({ error: "Title is required" });
    }

    const post = { ...fields, owner: req.user._id, createdAt: new Date() };
    const result = await posts.insertOne(post);
    res.status(201).json({ ...post, _id: result.insertedId });
});

// Owner only: edit one of your posts.
app.put('/api/posts/:id', ensureAuthenticated, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: "Post not found" });
    }
    const fields = readPostFields(req.body);
    if (!fields.title) {
        return res.status(400).json({ error: "Title is required" });
    }

    // owner in the filter = can't edit someone else's post
    const updated = await posts.findOneAndUpdate(
        { _id: new ObjectId(req.params.id), owner: req.user._id },
        { $set: { ...fields, updatedAt: new Date() } },
        { returnDocument: "after" }
    );
    if (!updated) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.json(updated);
});

// Owner only: delete one of your posts.
app.delete('/api/posts/:id', ensureAuthenticated, async (req, res) => {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(404).json({ error: "Post not found" });
    }
    const result = await posts.deleteOne({
        _id: new ObjectId(req.params.id),
        owner: req.user._id,
    });
    if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Post not found" });
    }
    res.status(204).end();
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);


async function openDB() {
    await client.connect();
    // collection = client.db("todo").collection("items");
    users = client.db("portfolio_maker").collection("users");
    widgets = client.db("portfolio_maker").collection("widgets");
    posts = client.db("portfolio_maker").collection("posts");
    console.log("Connected to DB");
};

function ensureAuthenticated(req, res, next) {
    console.log("Ensuring auth", req.isAuthenticated());

    if (req.isAuthenticated()) {
        return next();
    }

    return res.status(401).json({ error: "You need to be logged in" });
}


// true if the logged in user is the owner of portfolio `uid`
function isOwner(req, uid) {
    return req.isAuthenticated() && !!req.user && req.user._id.toString() === uid;
}

function cleanString(value, maxLength) {
    return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

// Only copy the fields we allow -- never spread req.body straight into the DB,
// or a client could overwrite `owner` and steal/plant posts.
function readPostFields(body = {}) {
    return {
        title: cleanString(body.title, 200),
        description: cleanString(body.description, 5000),
        imageUrl: cleanString(body.imageUrl, 2000),
    };
}
