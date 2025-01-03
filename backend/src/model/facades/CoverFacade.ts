import Playlist from "../interfaces/Playlist";
import Image from "../interfaces/Image";
import OpenAI from "openai";

/**
 * The CoverGenerator class is responsible for generating
 * playlist covers using OpenAI
 */
class CoverGenerator {
    private readonly openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    /**
     * @param {Playlist} playlist - the playlist to generate a cover for
     * @param {string} theme - cover theme, can be "Oil Painting", "Futuristic", or "Sky"
     * @returns {Promise<Playlist>} updated playlist with the generated cover
     */
    async generateCover(playlist: Playlist, theme: string): Promise<Image> {
        try {
            // Prepare the prompt for OpenAI based on the theme
            const prompt = `Create an album cover in the style of ${theme} for the playlist titled "${playlist.title}" inspired by a mood score (0 to 10) with 0 being sad and 10 being happy: ${playlist.mood * 10}, Additionally, please contain no words, letters, or numbers, and incorporate elements of the month that the playlist falls in.`;

            // Generate image using OpenAI API
            const response = await this.openai.images.generate({
                prompt: prompt,
                model: "dall-e-3",
                n: 1,
                size: "1024x1024",
            });

            // Extract the URL of the generated image
            let imageUrl = response.data[0].url;
            if (!imageUrl) {
                imageUrl = "No Valid Url";
            }

            let image: Image = {
                url: imageUrl,
                width: 1024,
                height: 1024,
            };

            return image;
        } catch (error) {
            console.error("Error generating cover:", error);
            throw new Error("Failed to generate cover");
        }
    }
}

export default CoverGenerator;
