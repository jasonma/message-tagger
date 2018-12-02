export interface IMessage {
    from: string;
    to: string[];
    cc: string[];
    bcc: string[];
    date: Date;
    subject: string;
    body: string[];
}

export function MessageFromGmailMessage(gmailMessage: any): IMessage {
    console.log(gmailMessage);
    return {} as IMessage;
}

export function processMessages(messages: any[]): IMessage[] {
    return messages.map(MessageFromGmailMessage);
}
