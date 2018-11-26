import * as Koa from "koa";
import * as Router from "koa-router";
import { GmailAuth } from "./gmail-auth/GmailAuth";

const app = new Koa();
const router = new Router();

const gmailAuth = new GmailAuth(GmailAuth.GetMessages);

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

app.listen(3000);

console.log("Server running on port 3000");
