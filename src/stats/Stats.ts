import { ISensitivityScore } from "../identification-strategy/api";
import { IMessage } from "../message/api";

export interface ISensitiveEmail {
    from: string;
    subject: string;
    date: Date;
    score: ISensitivityScore;
}

export class Stats {
    private numProcessed: number = 0;
    private sensitiveEmails: ISensitiveEmail[] = [];

    public MessageProcessed(message: IMessage, scores: ISensitivityScore[]) {
        this.numProcessed ++;
        const score = this.getMaxScore(scores);
        if (score.sensitivity > 0.5) {
            this.sensitiveEmails.push({
                date: message.date,
                from: message.from.toString(),
                score,
                subject: message.subject,
            });
        }
    }

    public getNumProcessed(): number {
        return this.numProcessed;
    }

    public getSensitiveEmails(): ISensitiveEmail[] {
        return this.sensitiveEmails;
    }

    private getMaxScore(scores: ISensitivityScore[]): ISensitivityScore {
        let maxScoreIdx = 0;
        for (let i = 0; i < scores.length; i++) {
            if (scores[i].sensitivity > scores[maxScoreIdx].sensitivity) {
                maxScoreIdx = i;
            }
        }
        return scores[maxScoreIdx];
    }
}
