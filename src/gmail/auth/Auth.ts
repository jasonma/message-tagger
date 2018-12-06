import * as fs from "fs";
import { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";
import { CLIENT_INFO } from "./ClientId";

export class GmailAuth {
    private SCOPES: string[] = [
        "https://www.googleapis.com/auth/gmail.labels",
        "https://www.googleapis.com/auth/gmail.readonly",
        "https://www.googleapis.com/auth/gmail.modify",
    ];
    private oAuth2Client: OAuth2Client;

    constructor() {
        const { client_secret, client_id, redirect_uris } = CLIENT_INFO;
        const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
        this.oAuth2Client = oAuth2Client;
    }

    public getAuthUrl(): string {
        return this.oAuth2Client.generateAuthUrl({
            access_type: "offline",
            scope: this.SCOPES,
        });
    }

    public initialize(authcode: string, callback: () => void) {
        this.oAuth2Client.getToken(authcode, (err, token) =>  {
            this.oAuth2Client.setCredentials(token);
            callback();
        });
    }

    public Gmail() {
        return google.gmail({version: "v1", auth: this.oAuth2Client});
    }
}
