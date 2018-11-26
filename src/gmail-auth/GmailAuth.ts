import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import * as readline from "readline";
import * as fs from "fs";
import { CLIENT_ID } from "./client_id";

export class GmailAuth {
    private SCOPES: string[] = ["https://www.googleapis.com/auth/gmail.readonly"];
    private TOKEN_PATH = "token.json";

    constructor(callback: (oAuth2Client: OAuth2Client) => void) {
        const {client_secret, client_id, redirect_uris} = CLIENT_ID.installed;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        // Check if we have previously stored a token.
        fs.readFile(this.TOKEN_PATH, (err: Error, token: Buffer) => {
            if (err) return this.getNewToken(oAuth2Client, callback);
            oAuth2Client.setCredentials(JSON.parse(token.toString()));
            callback(oAuth2Client);
        });
    }

    private getNewToken(oAuth2Client: OAuth2Client, callback: (oAuth2Client: OAuth2Client) => void) {
        const authUrl = oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.SCOPES,
        });
        console.log("Authorize this app by visiting this url:", authUrl);
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });
        rl.question("Enter the code from that page here: ", (code: string) => {
            rl.close();
            oAuth2Client.getToken(code, (err, token) => {
                if (err) return console.error("Error retrieving access token", err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(this.TOKEN_PATH, JSON.stringify(token), (err) => {
                    if (err) return console.error(err);
                    console.log("Token stored to", this.TOKEN_PATH);
                });
                callback(oAuth2Client);
            });
        });
    }

    public static GetLabels = (oAuth2Client: OAuth2Client) => {
        const gmail = google.gmail({version: "v1", auth: oAuth2Client});
        gmail.users.labels.list({userId: "me"}, (err: Error, res: any) => {
            if (err) return console.log("The API returned an error: " + err);
            const labels = res.data.labels;
            if (labels.length) {
                console.log("Labels:");
                labels.forEach((label: any) => {
                    console.log(`- ${label.name}`);
                });
            } else {
                console.log("No labels found.");
            }
        });
    }

    public static GetMessages = (oAuth2Client: OAuth2Client) => {
        const gmail = google.gmail({version: "v1", auth: oAuth2Client});
        gmail.users.messages.list({userId: "me"}, (err: Error, res: any) => {
            if (err) return console.log("The API returned an error: " + err);
            const { messages } = res.data;
            const messagePayloads: any[] = [];
            messages.forEach((message: any) => {
                gmail.users.messages.get({userId: "me", id: message.id}, (err: Error, res: any) => {
                    console.log(res);
                });
            });
        });
    }
}
