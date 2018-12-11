import { IAttachment, IMessage } from "../message/api";
import { ISensitivityScore, IStrategy } from "./api";

export class FileSharingLinkStrategy implements IStrategy {
    private SENSITIVE_URLS: Map<string, string> = new Map(Object.entries({
        "box.com/s": "Box",
        "https://docs.google.com/document": "Google Docs",
        "https://docs.google.com/presentation": "Google Slides",
        "https://docs.google.com/spreadsheet": "Google Sheets",
        "https://drive.google.com/file": "Google File",
        "https://www.dropbox.com/l/": "Dropbox",
    }));

    public Score(message: IMessage): ISensitivityScore {
        for (const entry of this.SENSITIVE_URLS) {
            const url = entry[0];
            const app = entry[1];
            if (message.body.toLowerCase().indexOf(url) >= 0) {
                return {
                    reason: `Body contains ${app} link`,
                    sensitivity: 1,
                };
            }
            const attachmentData = message.attachments
                .map((attachment: IAttachment) => attachment.data.toLowerCase())
                .join("\n");
            if (message.body.toLowerCase().indexOf(url) >= 0) {
                return {
                    reason: `Attachment contains ${app} link`,
                    sensitivity: 1,
                };
            }
        }
        return {
            reason: "",
            sensitivity: 0,
        };
    }
}
