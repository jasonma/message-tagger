import * as Koa from "koa";
import * as Router from "koa-router";
import { GmailAuth } from "./gmail/auth/Auth";
import { GetMessage, GetMessageIds } from "./gmail/Gmail";
import { MessageFromGmailMessage, IMessage } from "./message/api";
import { IStrategy, TestStrategy } from "./identification-strategy/Strategy";

const app = new Koa();
const router = new Router();

const strategies: IStrategy[] = [new TestStrategy()];

const gmail = new GmailAuth().Gmail();
GetMessageIds(gmail).then((messageIds: string[]) => {
    return Promise.all(messageIds.map((messageId) => GetMessage(gmail, messageId)));
}).then((vals: any[]) => {
    const messages = vals.map(MessageFromGmailMessage);
    messages.forEach((message: IMessage) => {
        const isSensitive = strategies.map((strategy: IStrategy) => strategy.IsSensitive(message));
        if (isSensitive.some(val => val)) {
            console.log("message is sensitive: ", message);
        }
    });
});

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
