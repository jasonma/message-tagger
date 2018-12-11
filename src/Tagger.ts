import { IAction } from "./action/api";
import { LabelAction } from "./action/LabelAction";
import { IGmailAttachmentResult, IGmailLabel, IGmailMessageIdsResult, IGmailMessageResult } from "./gmail/api";
import { Gmail } from "./gmail/Gmail";
import { IStrategy } from "./identification-strategy/api";
import { FileSharingLinkStrategy } from "./identification-strategy/FileSharingLinkStrategy";
import { IAttachment, IMessage } from "./message/api";
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
        }).then((vals: IGmailMessageResult[]) => {
            vals.map(MessageFromGmailMessage)
                .filter((message: IMessage) => message)
                .forEach((message: IMessage) => this.processMessage(message));
            if (pageToken) {
                this.processMessages(pageToken);
            }
        });
    }

    private processMessage(message: IMessage) {
        const loadAttachmentPromises = message.attachments.map((attachment: IAttachment) => {
            return this.gmail.GetAttachment(attachment.id, message.id);
        });
        Promise.all(loadAttachmentPromises).then((attachmentResults: IGmailAttachmentResult[]) => {
            const attachments: {[key: string]: IGmailAttachmentResult} = {};
            attachmentResults.forEach((res: IGmailAttachmentResult) => {
                attachments[res.attachmentId] = res;
            });
            message.attachments.forEach((attachment: IAttachment) => {
                attachment.data = attachments[attachment.id].data;
                attachment.size = attachments[attachment.id].size;
            });

            const isSensitive = this.strategies.map((strategy: IStrategy) => strategy.IsSensitive(message));
            if (isSensitive.some((val) => val)) {
                console.log("message is sensitive: ", message.subject);
                this.actions.forEach((action: IAction) => {
                    action.takeAction(this.gmail, message);
                });
            }
        });
    }
}
