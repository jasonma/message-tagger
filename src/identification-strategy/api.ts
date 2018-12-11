import { IMessage } from "../message/api";

export interface ISensitivityScore {
    sensitivity: number;
    reason: string;
}

export interface IStrategy {
    Score(message: IMessage): ISensitivityScore;
}
