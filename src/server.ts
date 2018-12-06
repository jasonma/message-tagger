import * as Koa from "koa";
import * as Router from "koa-router";
import * as queryString from "query-string";
import { GmailAuth } from "./gmail/auth/Auth";
import { Gmail } from "./gmail/Gmail";
import { Tagger } from "./Tagger";

const app = new Koa();
const router = new Router();
const auth = new GmailAuth();

app.use(async (ctx, next) => {
    // Pass the request to the next middleware function
    await next();
});

router.get("/", async (ctx) => {
    const url = auth.getAuthUrl();
    ctx.redirect(url);
    ctx.status = 301;
});

router.get("/auth", async (ctx) => {
    const parsed = queryString.parse(ctx.querystring);
    auth.initialize(parsed.code as string, () => {
        const tagger = new Tagger(new Gmail(auth.Gmail()));
        tagger.tagSensitiveMessages();
    });
    ctx.body = "Processing e-mails...";
});

app.use(router.routes());

app.listen(3000);

console.log("Server running on port 3000");
