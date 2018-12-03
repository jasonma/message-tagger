// TODO: find / define types for gmail client

export function GetLabels(gmail: any): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        gmail.users.labels.list({userId: "me"}, (err: Error, res: any) => {
            if (err) {
                reject(err);
                return;
            }
            const { labels } = res.data;
            resolve(labels.map((label: any) => label.name));
        });
    });
}

export interface IMessageIdResult {
    messageIds: string[];
    pageToken: string;
}

export function GetMessageIds(gmail: any, pageToken: string): Promise<IMessageIdResult> {
    return new Promise<IMessageIdResult>((resolve, reject) => {
        gmail.users.messages.list({userId: "me", pageToken}, (err: Error, res: any) => {
            if (err) {
                reject(err);
                return;
            }
            const { messages } = res.data;
            const messageIds = messages.map((message: any) => message.id);
            resolve({messageIds, pageToken: res.data.nextPageToken});
        });
    });
}

export function GetMessage(gmail: any, messageId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        gmail.users.messages.get({userId: "me", id: messageId}, (err: Error, res: any) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(res.data.payload);
        });
    });
}
