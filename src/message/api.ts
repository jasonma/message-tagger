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
    id: string;
    attachments: IAttachment[];
}

export interface IAttachment {
    id: string;
    mimeType: string;
    data?: string;
    size?: number;
}
