import { IMessage } from "../message/api";
import { IStrategy } from "./Strategy";

export class FileSharingLinkStrategy implements IStrategy {
    public IsSensitive(message: IMessage): boolean {
        return false;
    }
}
