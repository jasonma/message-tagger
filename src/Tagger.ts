import { IAction } from "./action/api";
import { LabelAction } from "./action/LabelAction";
import { IGmailLabel, IGmailMessageIdsResult } from "./gmail/api";
import { Gmail } from "./gmail/Gmail";
import { IStrategy } from "./identification-strategy/api";
import { FileSharingLinkStrategy } from "./identification-strategy/FileSharingLinkStrategy";
import { IMessage } from "./message/api";
import { MessageFromGmailMessage } from "./message/ConvertFromGmail";

export class Tagger {
    private sensitiveTag = "tags/sensitive";
    private strategies: IStrategy[] = [new FileSharingLinkStrategy()];
    private actions: IAction[] = [new LabelAction(this.sensitiveTag)];

    constructor(private gmail: Gmail) {}

    public tagSensitiveMessages() {
        this.gmail.GetLabels().then((labels: IGmailLabel[]) => {
            const label = labels.find((l) => l.name === this.sensitiveTag);
            if (!label) {
                return this.gmail.CreateLabel(this.sensitiveTag);
            } else {
                return Promise.resolve(label);
            }
        }).then((_) => {
            this.processMessages();
        });
    }

    private processMessages(pageToken?: string) {
        this.gmail.GetMessageIds(pageToken).then((result: IGmailMessageIdsResult) => {
            pageToken = result.pageToken;
            return Promise.all(result.messageIds.map((messageId) => this.gmail.GetMessage(messageId)));
        }).then((vals: any[]) => {
            const messages = vals.map(MessageFromGmailMessage);
            messages.forEach((message: IMessage) => {
                if (!message) {
                    return;
                }
                const isSensitive = this.strategies.map((strategy: IStrategy) => strategy.IsSensitive(message));
                if (isSensitive.some((val) => val)) {
                    console.log("message is sensitive: ", message.subject);
                    this.actions.forEach((action: IAction) => {
                        action.takeAction(this.gmail, message);
                    });
                }
            });
            if (pageToken) {
                this.processMessages(pageToken);
            }
        });
    }
}
