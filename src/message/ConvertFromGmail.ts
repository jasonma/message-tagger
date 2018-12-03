import { IGmailHeader, IGmailPart } from "../gmail/api";
import { EmailAddress, IMessage } from "./api";

export function MessageFromGmailMessage(gmailMessage: any): IMessage {
    const message = {
        bcc: [],
        cc: [],
        to: [],
    } as IMessage;
    gmailMessage.headers.forEach((header: IGmailHeader) => {
        switch (header.name.toLowerCase()) {
            case "from":
            message.from = new EmailAddress(header.value);
            break;
            case "to":
            message.to.push(new EmailAddress(header.value));
            break;
            case "cc":
            message.cc.push(new EmailAddress(header.value));
            break;
            case "date":
            message.date = new Date(header.value);
            break;
            case "subject":
            message.subject = header.value;
            break;
        }
    });
    message.body = parseBody(gmailMessage);
    if (!message.from) {
        console.error("Message invalid.", gmailMessage);
        return null;
    }
    return message;
}

function parseBody(part: IGmailPart): string {
    if (!part) {
        return "";
    }
    if (part.mimeType.startsWith("image")) {
        // ignore all images
        return "";
    }

    if (part.mimeType.startsWith("text")) {
        if (part.body.data) {
            return Buffer.from(part.body.data, "base64").toString();
        } else {
            // console.warn(`part with mimeType ${part.mimeType} is an attachment; ignoring...`);
        }
    } else if (part.mimeType.startsWith("multipart")) {
        return part.parts.map(parseBody).join("\n");
    } else {
        // console.warn(`mimeType ${part.mimeType} not recognized; ignored...`);
        return "";
    }
}
