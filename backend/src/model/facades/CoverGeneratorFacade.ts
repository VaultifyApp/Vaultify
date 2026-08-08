import Playlist from "../interfaces/Playlist.js";
import Image from "../interfaces/Image.js";
import OpenAI from "openai";

/**
 * The CoverGeneratorFacade class is responsible for generating
 * playlist covers using OpenAI
 */
class CoverGeneratorFacade {
    private openai: OpenAI | null = null;

    /**
     * @returns the OpenAI client, constructed on first use
     * @throws Error if OPENAI_API_KEY is not configured
     */
    private client(): OpenAI {
        if (!this.openai) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                throw new Error("OPENAI_API_KEY is not configured");
            }
            this.openai = new OpenAI({ apiKey: apiKey });
        }
        return this.openai;
    }

    /**
     * @param {Playlist} playlist - the playlist to generate a cover for
     * @param {string} theme - cover theme, can be "Oil Painting", "Futuristic", or "Sky"
     * @returns {Promise<Playlist>} updated playlist with the generated cover
     */
    async generateCover(playlist: Playlist, theme: string): Promise<Image> {
        try {
            // Prepare the prompt for OpenAI based on the theme
            const prompt = `Create an album cover in the style of ${theme} for a playlist titled "${playlist.title}". The cover should  not contain any words, letters, or numbers, and should incorporate thematic elements of the month that the playlist falls in.`;
            // Generate image using OpenAI API
            const response = await this.client().images.generate({
                prompt: prompt,
                // dall-e-2 and dall-e-3 were removed from the API on
                // 2026-05-12. gpt-image-1-mini is a documented replacement.
                model: "gpt-image-1-mini",
                n: 1,
                size: "1024x1024",
            });

            const result = response.data?.[0];
            // The dall-e models return a hosted URL, gpt-image-1 only base64.
            // Normalise to a data URL so callers handle a single shape.
            const imageUrl = result?.url
                ? result.url
                : result?.b64_json
                  ? `data:image/png;base64,${result.b64_json}`
                  : undefined;
            if (!imageUrl) {
                throw new Error("OpenAI returned no image data");
            }

            let image: Image = {
                url: imageUrl,
                width: 1024,
                height: 1024,
            };

            return image;
        } catch (error) {
            console.error("Error generating cover:", error);
            const reason =
                error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to generate cover: ${reason}`, {
                cause: error,
            });
        }
    }
}

export default CoverGeneratorFacade;
