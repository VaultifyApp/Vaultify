import axios from "axios";
import qs from "qs";
import { Buffer } from "buffer";

const client_id = "18b9ce009b314b9eb359758d436b7b2b";
const client_secret = "fce85db5774a4140b97d2d939cbafa86";

const getToken = async () => {
    const tokenUrl = "https://accounts.spotify.com/api/token";
    const data = qs.stringify({ grant_type: "client_credentials" });
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString("base64")}`,
    };

    try {
        const response = await axios.post(tokenUrl, data, { headers });
        console.log("Access Token:", response.data.access_token);
    } catch (error) {
        console.error("Error getting access token", error);
    }
};

getToken();
