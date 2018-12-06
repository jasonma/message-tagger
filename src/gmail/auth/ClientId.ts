import { CLIENT_SECRET } from "./client_id";

export interface IClientIdInfo {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
}

export const CLIENT_INFO: IClientIdInfo = {
    client_id: "619658690006-8i11qrpq3jka778cgnj970g2hursh6pl.apps.googleusercontent.com",
    client_secret: CLIENT_SECRET,
    redirect_uris: ["http://localhost:3000/auth"],
};
