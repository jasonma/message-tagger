import { IGmailHeader, IGmailPart } from "../gmail/api";
import { IGmailMessageResult } from "../gmail/api";
import { EmailAddress, IAttachment, IMessage } from "./api";

export function MessageFromGmailMessage(messageResult: IGmailMessageResult): IMessage {
    const message = {
        bcc: [],
        cc: [],
        id: messageResult.id,
        to: [],
    } as IMessage;
    const { gmailMessage } = messageResult;
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
    const { attachments, body } = parseBody(gmailMessage);
    message.attachments = attachments;
    message.body = body;
    if (!message.from || message.body === null || message.body === undefined) {
        console.error("Message invalid.", gmailMessage);
        return null;
    }
    return message;
}

interface IParsedParts {
    body: string;
    attachments: IAttachment[];
}

function parseBody(part: IGmailPart): IParsedParts {
    const result: IParsedParts = {
        attachments: [],
        body: "",
    };
    if (!part || part.mimeType.startsWith("image")) {
        return result;
    }

    if (part.mimeType.startsWith("multipart")) {
        part.parts.forEach((subpart: IGmailPart) => {
            const { attachments, body } = parseBody(subpart);
            result.attachments.push(...attachments);
            result.body += body + "\n";
        });
    } else {
        if (part.body.data) {
            result.body += Buffer.from(part.body.data, "base64").toString() + "\n";
        } else if (part.body.attachmentId) {
            result.attachments.push({id: part.body.attachmentId, mimeType: part.mimeType});
        }
    }
    return result;
}
