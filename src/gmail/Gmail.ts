// TODO: find / define types for gmail client

export function GetLabels(gmail: any): Promise<string[]> {
    return new Promise<string[]>((resolve, reject) => {
        retry(gmail.users.labels.list, {userId: "me"}, reject, (res: any) => {
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
        retry(gmail.users.messages.list, {userId: "me", pageToken}, reject, (res: any) => {
            const { messages } = res.data;
            const messageIds = messages.map((message: any) => message.id);
            resolve({messageIds, pageToken: res.data.nextPageToken});
        });
    });
}

export function GetMessage(gmail: any, messageId: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
        retry(gmail.users.messages.get, {userId: "me", id: messageId}, reject, (res: any) => {
            resolve(res.data.payload);
        });
    });
}

function retry(
        gmailCall: (params: any, callback: (err: Error, res: any) => void) => void,
        params: any,
        reject: (err: Error) => void,
        resolve: (res: any) => void) {

    const callback = (err: any, res: any) => {
        if (err) {
            if (err.code && err.code === "ENOTFOUND") {
                console.log("retrying...");
                gmailCall(params, callback);
            } else {
                console.error(err);
                reject(err);
            }
            return;
        }
        resolve(res);
    };
    gmailCall(params, callback);
}
