import { IAttachment, IMessage } from "../message/api";
import { IStrategy } from "./api";

export class FileSharingLinkStrategy implements IStrategy {
    private SENSITIVE_URLS: string[] = [
        "https://www.dropbox.com/l/",
        "https://docs.google.com/document",
        "https://docs.google.com/spreadsheet",
        "https://docs.google.com/presentation",
        "https://drive.google.com/file",
        "box.com/s",
    ];

    public IsSensitive(message: IMessage): boolean {
        const messageContent = message.body.toLowerCase() + "\n"
            + message.attachments.map((attachment: IAttachment) => attachment.data.toLowerCase()).join("\n");
        return this.SENSITIVE_URLS.some((url: string) => messageContent.indexOf(url) > 0);
    }
}
