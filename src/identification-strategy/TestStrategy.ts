import { IMessage } from "../message/api";
import { ISensitivityScore, IStrategy } from "./api";

export class TestStrategy implements IStrategy {
    public Score(message: IMessage): ISensitivityScore {
        if (message.from.address === "auto-confirm@amazon.com") {
            return {
                reason: "From Amazon auto-confirm",
                sensitivity: 1,
            };
        } else {
            return {
                reason: "Not from Amazon auto-confirm",
                sensitivity: 0,
            };
        }
    }
}
