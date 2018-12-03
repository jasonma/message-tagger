import { Gmail } from "../gmail/Gmail";
import { IMessage } from "../message/api";
import { IAction } from "./api";

export class LabelAction implements IAction {
    constructor(private label: string) {}

    public takeAction(gmail: Gmail, message: IMessage) {
        gmail.ApplyLabel(message.id, this.label);
    }
}
