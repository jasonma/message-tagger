import { IMessage } from "../message/api";
import { IStrategy } from "./Strategy";

const DROPBOX_SHARE_URL: string = "https://www.dropbox.com/l/";

export class FileSharingLinkStrategy implements IStrategy {
    public IsSensitive(message: IMessage): boolean {
        return message.body.toLowerCase().indexOf(DROPBOX_SHARE_URL) > 0;
    }
}
