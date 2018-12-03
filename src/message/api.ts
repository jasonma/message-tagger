export class EmailAddress {
    public name: string;
    public address: string;

    constructor(s: string) {
        if (s.indexOf("<") > 0) {
            const matches = s.match(/^(.*) <(.*)>$/);
            if (matches) {
                this.name = matches[1];
                this.address = matches[2];
                return;
            }
        }
        this.name = "";
        this.address = s;
    }
}

export interface IMessage {
    from: EmailAddress;
    to: EmailAddress[];
    cc: EmailAddress[];
    bcc: EmailAddress[];
    date: Date;
    subject: string;
    body: string;
}

export interface IHeader {
    name: string;
    value: string;
}

export function MessageFromGmailMessage(gmailMessage: any): IMessage {
    const message = {
        bcc: [],
        cc: [],
        to: [],
    } as IMessage;
    gmailMessage.headers.forEach((header: IHeader) => {
        switch (header.name.toLowerCase()) {
            case "from":
            message.from = new EmailAddress(header.value);
            break;
            case "to":
            message.to.push(new EmailAddress(header.value));
            break;
            case "subject":
            message.subject = header.value;
            break;
        }
    });
    if (!validate(message)) {
        console.error("Message invalid.", gmailMessage);
        return null;
    }
    return message;
}

function validate(message: IMessage) {
    return message.from; // && (message.to.length > 0 || message.cc.length > 0 || message.bcc.length > 0);
}
