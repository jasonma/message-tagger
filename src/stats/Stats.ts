import { IMessage } from "../message/api";

export class Stats {
    private numProcessed: number = 0;
    private sensitiveEmails: IMessage[] = [];

    public MessageProcessed(message: IMessage, sensitive: boolean) {
        this.numProcessed ++;
        if (sensitive) {
            this.sensitiveEmails.push(message);
        }
    }

    public getNumProcessed(): number {
        return this.numProcessed;
    }

    public getSensitiveEmails(): IMessage[] {
        return this.sensitiveEmails;
    }
}
