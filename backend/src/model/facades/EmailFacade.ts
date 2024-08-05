import { MailerSend, EmailParams, Recipient, Sender } from "mailersend";
import User from "../interfaces/User.js";

class EmailFacade {
    private readonly mailer;

    /**
     * @effects initiates mailer
     */
    constructor() {
        this.mailer = new MailerSend({
            apiKey: process.env.MAILER_KEY || "",
        });
    }

    /**
     * @param user the user to email
     * @effects sends a welcome email to the provided user's email.
     */
    async sendWelcomeEmail(user: User): Promise<void> {
        if (!user.email) throw new Error("User must have email");
        const sentFrom = new Sender(process.env.EMAIL || "", "Vaultify");
        const recipients = [new Recipient(user.email)];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Welcome to Vaultify!")
            .setText(
                "Congratulations on creating your first playlist with Vaultify!\nWe'll be keeping touch every month with a brand new playlist for you to enjoy!\n\nSincerely,\nThe Vaultify Team :)"
            );

        this.mailer.email
            .send(emailParams)
            .catch((error) => console.log(error));
    }

    /**
     * @param user the user to email
     * @effects sends an email with a link to the user's new playlist
     */
    async sendNewPlaylistEmail(user: User): Promise<void> {
        if (!user.email || !user.playlists || user.playlists.length == 0) {
            throw new Error("User must have email and playlists");
        }
        const sentFrom = new Sender(process.env.EMAIL || "", "Vaultify");
        const recipients = [new Recipient(user.email)];
        const emailParams = new EmailParams()
            .setFrom(sentFrom)
            .setTo(recipients)
            .setSubject("Your Monthly Recap is Here!")
            .setText(
                `Here's the link to your monthly recap:\n${user.playlists[user.playlists.length - 1]}\n\nEnjoy!\n-The Vaultify Team :)`
            );

        this.mailer.email
            .send(emailParams)
            .catch((error) => console.log(error));
    }
}

export default EmailFacade;
