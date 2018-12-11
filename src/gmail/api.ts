// TODO: find / define types for gmail client

export interface IGmailLabel {
    id: string;
    name: string;
}

export interface IGmailMessageIdsResult {
    messageIds: string[];
    pageToken: string;
}

export interface IGmailMessageResult {
    id: string;
    gmailMessage: any;
}

export interface IGmailHeader {
    name: string;
    value: string;
}

export interface IGmailPart {
    partId: string;
    mimeType: string;
    headers: any[];
    body: {
        size: number;
        data?: string;
        attachmentId?: string;
    };
    parts: IGmailPart[];
}

export interface IGmailAttachmentResult {
    attachmentId: string;
    messageId: string;
    size: number;
    data: string;
}
