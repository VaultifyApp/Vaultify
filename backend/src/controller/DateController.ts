import Model from "../model/Model.js";
import cron from "node-cron";

/**
 * The DateController class is responsible for automatically generating content for users on a monthly basic.
 */
class DateController {
    private model: Model;

    constructor(model: Model) {
        this.model = model;
        this.monthlyGenerate();
    }

    private monthlyGenerate() {
        // Schedule the function to run at 23:59 on the last day of each month
        cron.schedule(
            "59 23 28-31 * *",
            () => {
                const now = new Date();
                const lastDayOfMonth = new Date(
                    now.getFullYear(),
                    now.getMonth() + 1,
                    0
                ).getDate();

                if (now.getDate() === lastDayOfMonth) {
                    console.log("Generating playlist...");
                    this.model
                        .generatePlaylist()
                        .then((playlist: any) => {
                            console.log(playlist);
                        })
                        .catch((error: unknown) => {
                            console.error("Error generating playlist:", error);
                        });
                }
            },
            {
                timezone: "America/New_York",
            }
        );
    }
}

export default DateController;
