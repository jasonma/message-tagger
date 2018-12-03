import { IAction } from "./action/api";
import { LabelAction } from "./action/LabelAction";
import { IGmailLabel, IGmailMessageIdsResult } from "./gmail/api";
import { GmailAuth } from "./gmail/auth/Auth";
import { Gmail } from "./gmail/Gmail";
import { IStrategy } from "./identification-strategy/api";
import { FileSharingLinkStrategy } from "./identification-strategy/FileSharingLinkStrategy";
import { IMessage } from "./message/api";
import { MessageFromGmailMessage } from "./message/ConvertFromGmail";

function processMessages(pageToken?: string) {
    gmail.GetMessageIds(pageToken).then((result: IGmailMessageIdsResult) => {
        pageToken = result.pageToken;
        return Promise.all(result.messageIds.map((messageId) => gmail.GetMessage(messageId)));
    }).then((vals: any[]) => {
        const messages = vals.map(MessageFromGmailMessage);
        messages.forEach((message: IMessage) => {
            if (!message) {
                return;
            }
            const isSensitive = strategies.map((strategy: IStrategy) => strategy.IsSensitive(message));
            if (isSensitive.some((val) => val)) {
                console.log("message is sensitive: ", message.subject);
                actions.forEach((action: IAction) => {
                    action.takeAction(gmail, message);
                });
            }
        });
        if (pageToken) {
            processMessages(pageToken);
        }
    });
}

const sensitiveTag = "tags/sensitive";
const strategies: IStrategy[] = [new FileSharingLinkStrategy()];
const actions: IAction[] = [new LabelAction(sensitiveTag)];
const gmail = new Gmail(new GmailAuth().Gmail());
gmail.GetLabels().then((labels: IGmailLabel[]) => {
    const label = labels.find((l) => l.name === sensitiveTag);
    if (!label) {
        return gmail.CreateLabel(sensitiveTag);
    } else {
        return Promise.resolve(label);
    }
}).then((_) => {
    processMessages();
});

// const app = new Koa();
// const router = new Router();

// app.use(async (ctx, next) => {
//     // Log the request to the console
//     console.log("Url:", ctx.url);
//     // Pass the request to the next middleware function
//     await next();
// });

// router.get("/*", async (ctx) => {
//     ctx.body = "Hello World!";
// });

// app.use(router.routes());

// app.listen(3000);

// console.log("Server running on port 3000");
