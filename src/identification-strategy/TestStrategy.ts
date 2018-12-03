import { IMessage } from "../message/api";
import { IStrategy } from "./api";

export class TestStrategy implements IStrategy {
    public IsSensitive(message: IMessage): boolean {
        return message.from.address === "auto-confirm@amazon.com";
    }
}
