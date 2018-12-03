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
