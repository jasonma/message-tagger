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

export class Gmail {
    private labelByNameCache: { [name: string]: IGmailLabel } = {};
    private messageCache: { [id: string]: any } = {};

    constructor(private gmail: any) {}

    public GetLabels(): Promise<IGmailLabel[]> {
        return new Promise<IGmailLabel[]>((resolve, reject) => {
            this.retry(this.gmail.users.labels.list, {userId: "me"}, reject, (res: any) => {
                const { labels } = res.data;
                labels.forEach((label: IGmailLabel) => {
                    this.labelByNameCache[label.name] = label;
                });
                resolve(labels);
            });
        });
    }

    public ApplyLabel(messageId: string, labelName: string): Promise<any> {
        let labelPromise: Promise<IGmailLabel>;
        if (this.labelByNameCache[labelName]) {
            labelPromise = Promise.resolve(this.labelByNameCache[labelName]);
        } else {
            labelPromise = this.GetLabels().then((labels: IGmailLabel[]) => {
                const res = labels.find((l: IGmailLabel) => labelName === l.name);
                if (!res) {
                   throw new Error(`Label ${labelName} not found!`);
                }
                return res;
            });
        }
        console.log(`applying label to ${messageId}`);
        return labelPromise.then((label: IGmailLabel) => {
            this.gmail.users.messages.modify({
                id: messageId,
                resource: {
                    addLabelIds: [label.id],
                },
                userId: "me",
            });
        });
    }

    public CreateLabel(newLabelName: string): Promise<IGmailLabel> {
        return new Promise<IGmailLabel>((resolve, reject) => {
            const resource = {name: newLabelName};
            this.retry(this.gmail.users.labels.create, {userId: "me", resource}, reject, (res: any) => {
                resolve({ id: res.id, name: res.name });
            });
        });
    }

    public GetMessageIds(pageToken: string): Promise<IGmailMessageIdsResult> {
        return new Promise<IGmailMessageIdsResult>((resolve, reject) => {
            this.retry(this.gmail.users.messages.list, {userId: "me", pageToken}, reject, (res: any) => {
                const { messages } = res.data;
                const messageIds = messages.map((message: any) => message.id);
                resolve({messageIds, pageToken: res.data.nextPageToken});
            });
        });
    }

    public GetMessage(messageId: string): Promise<IGmailMessageResult> {
        if (this.messageCache[messageId]) {
            return Promise.resolve(this.messageCache[messageId]);
        }
        return new Promise<any>((resolve, reject) => {
            this.retry(this.gmail.users.messages.get, {userId: "me", id: messageId}, reject, (res: any) => {
                this.messageCache[messageId] = res.data.payload;
                resolve({
                    gmailMessage: res.data.payload,
                    id: messageId,
                });
            });
        });
    }

    private retry(
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
}
