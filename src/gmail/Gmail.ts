// TODO: find / define types for gmail client

export function GetLabels(gmail: any, callback: (labels: string[]) => void) {
    gmail.users.labels.list({userId: "me"}, (err: Error, res: any) => {
        if (err) {
            return console.log("The API returned an error: " + err);
        }
        const labels = res.data.labels;
        callback(labels.map((label: any) => label.name));
    });
}

export function GetMessages(gmail: any, callback: (messages: any[]) => void) {
    gmail.users.messages.list({userId: "me"}, (err: Error, res: any) => {
        if (err) {
            return console.log("The API returned an error: " + err);
        }
        const { messages } = res.data;
        const payloads: any[] = [];
        messages.forEach((message: any) => {
            gmail.users.messages.get({userId: "me", id: message.id}, (_: Error, payload: any) => {
                payloads.push(payload);
            });
        });
        callback(payloads);
    });
}
