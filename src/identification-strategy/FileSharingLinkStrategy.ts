import { IAttachment, IMessage } from "../message/api";
import { IStrategy } from "./api";

const DROPBOX_SHARE_URL: string = "https://www.dropbox.com/l/";
const GDRIVE_SHARE_URL: string = "https://docs.google.com/";

export class FileSharingLinkStrategy implements IStrategy {
    public IsSensitive(message: IMessage): boolean {
        const messageContent = message.body.toLowerCase() + "\n"
            + message.attachments.map((attachment: IAttachment) => attachment.data.toLowerCase()).join("\n");
        return messageContent.indexOf(DROPBOX_SHARE_URL) > 0
            || messageContent.indexOf(GDRIVE_SHARE_URL) > 0;
    }
}
