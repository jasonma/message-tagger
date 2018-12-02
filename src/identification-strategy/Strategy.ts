import { IMessage } from "../message/api";

export interface IStrategy {
    IsSensitive(message: IMessage): boolean;
}

export class TestStrategy implements IStrategy {
    public IsSensitive(message: IMessage): boolean {
        return message.from === "auto-confirm@amazon.com";
    }
}
