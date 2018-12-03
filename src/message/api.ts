export interface IMessage {
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
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
        to: [],
        cc: [],
        bcc: [],
    } as IMessage;
    gmailMessage.headers.forEach((header: IHeader) => {
        switch(header.name) {
            case "From":
            message.from = header.value;
            break;
            case "To":
            message.to.push(header.value);
            break;
            case "Subject":
            message.subject = header.value;
            break;
        }
    })
    return message;
}
