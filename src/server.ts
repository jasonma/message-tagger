import * as Koa from "koa";
import * as Router from "koa-router";
import { GmailAuth } from "./gmail/auth/Auth";
import { GetMessage, GetMessageIds, IMessageIdResult } from "./gmail/Gmail";
import { IStrategy, TestStrategy } from "./identification-strategy/Strategy";
import { IMessage } from "./message/api";
import { MessageFromGmailMessage } from "./message/ConvertFromGmail";

const app = new Koa();
const router = new Router();

function processMessages(gmail: any, pageToken: string) {
    GetMessageIds(gmail, pageToken).then((result: IMessageIdResult) => {
        pageToken = result.pageToken;
        return Promise.all(result.messageIds.map((messageId) => GetMessage(gmail, messageId)));
    }).then((vals: any[]) => {
        const messages = vals.map(MessageFromGmailMessage);
        messages.forEach((message: IMessage) => {
            if (!message) {
                return;
            }
            const isSensitive = strategies.map((strategy: IStrategy) => strategy.IsSensitive(message));
            if (isSensitive.some((val) => val)) {
                console.log("message is sensitive: ", message.subject);
            }
        });
        if (pageToken) {
            processMessages(gmail, pageToken);
        }
    });
}

const strategies: IStrategy[] = [new TestStrategy()];
processMessages(new GmailAuth().Gmail(), null);

app.use(async (ctx, next) => {
    // Log the request to the console
    console.log("Url:", ctx.url);
    // Pass the request to the next middleware function
    await next();
});

router.get("/*", async (ctx) => {
    ctx.body = "Hello World!";
});

app.use(router.routes());

// app.listen(3000);

// console.log("Server running on port 3000");
