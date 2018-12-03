import { Gmail } from "../gmail/Gmail";
import { IMessage } from "../message/api";

export interface IAction {
    takeAction(gmail: Gmail, message: IMessage): void;
}
