import * as fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { CLIENT_ID } from "./client_id";

export class GmailAuth {
    // private SCOPES: string[] = ["https://www.googleapis.com/auth/gmail.readonly"];
    private TOKEN_PATH = "token.json";

    private oAuth2Client: OAuth2Client;

    constructor() {
        const { client_secret, client_id, redirect_uris } = CLIENT_ID.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        let token: Buffer;
        try {
            token = fs.readFileSync(this.TOKEN_PATH);
        } catch (err) {
            console.error(`Failed to find token; please get a new token and save it in ${this.TOKEN_PATH}.`);
            return;
        }
        oAuth2Client.setCredentials(JSON.parse(token.toString()));
        this.oAuth2Client = oAuth2Client;
    }

    public Gmail() {
        return google.gmail({version: "v1", auth: this.oAuth2Client});
    }

    // private getNewToken(oAuth2Client: OAuth2Client, callback: (oAuth2Client: OAuth2Client) => void) {
    //     const authUrl = oAuth2Client.generateAuthUrl({
    //         access_type: "offline",
    //         scope: this.SCOPES,
    //     });
    //     console.log("Authorize this app by visiting this url:", authUrl);
    //     const rl = readline.createInterface({
    //         input: process.stdin,
    //         output: process.stdout,
    //     });
    //     rl.question("Enter the code from that page here: ", (code: string) => {
    //         rl.close();
    //         oAuth2Client.getToken(code, (err, token) => {
    //             if (err) return console.error("Error retrieving access token", err);
    //             oAuth2Client.setCredentials(token);
    //             // Store the token to disk for later program executions
    //             fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
    //                 if (err) return console.error(err);
    //                 console.log("Token stored to", this.TOKEN_PATH);
    //             });
    //             callback(oAuth2Client);
    //         });
    //     });
    // }
}
