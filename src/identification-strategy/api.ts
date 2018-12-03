import { IMessage } from "../message/api";

export interface IStrategy {
    IsSensitive(message: IMessage): boolean;
}
