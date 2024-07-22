const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const qs = require("qs");
const { Buffer } = require("buffer");

// Load environment variables from a .env file
require("dotenv").config();

const profileRoutes = require("./routes/profile");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose
    .connect(DATABASE_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Spotify authentication routes
app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email";
    const authUrl =
        "https://accounts.spotify.com/authorize?" +
        qs.stringify({
            response_type: "code",
            client_id: CLIENT_ID,
            scope: scope,
            redirect_uri: REDIRECT_URI,
        });

    res.redirect(authUrl);
});

app.get("/spotify-callback", async (req, res) => {
    const code = req.query.code || null;
    const authOptions = {
        url: "https://accounts.spotify.com/api/token",
        form: {
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: "authorization_code",
        },
        headers: {
            Authorization:
                "Basic " +
                Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        json: true,
    };

    try {
        const response = await axios.post(
            authOptions.url,
            qs.stringify(authOptions.form),
            {
                headers: authOptions.headers,
            }
        );

        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;

        // Store tokens in the user's profile in the database here

        res.redirect(
            `${CLIENT_URI}/?access_token=${accessToken}&refresh_token=${refreshToken}`
        );
    } catch (error) {
        console.error("Error during Spotify callback:", error);
        res.redirect(CLIENT_URI);
    }
});

// Import and use routes
app.use("/api/profile", profileRoutes);

// Start the server
app.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
});
