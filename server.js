const express = require("express");
const axios = require("axios");
const qs = require("qs");
const { Buffer } = require("buffer");

const app = express();
const port = process.env.PORT || 3000;

const client_id = "18b9ce009b314b9eb359758d436b7b2b";
const client_secret = "fce85db5774a4140b97d2d939cbafa86";
const redirect_uri = "http://localhost:3000/callback"; // Ensure this matches your redirect URI

// Step 1: Redirect user to Spotify's authorization page
app.get("/login", (req, res) => {
    const scope = "user-read-private user-read-email";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${client_id}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    res.redirect(authUrl);
});

// Step 2: Handle callback and exchange code for tokens
app.get("/callback", async (req, res) => {
    const code = req.query.code || null;
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
    });
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        const { access_token, refresh_token } = response.data;
        console.log("Access Token:", access_token);
        console.log("Refresh Token:", refresh_token);

        // Store tokens securely and redirect user to your app's main page
        res.redirect(
            `http://localhost:3000?access_token=${access_token}&refresh_token=${refresh_token}`
        );
    } catch (error) {
        console.error("Error getting tokens", error);
        res.send("Error getting tokens");
    }
});

// Endpoint to refresh access token
app.get("/refresh_token", async (req, res) => {
    const refreshToken = req.query.refresh_token;
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        const { access_token } = response.data;
        res.json({ access_token });
    } catch (error) {
        console.error("Error refreshing access token", error);
        res.send("Error refreshing access token");
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
