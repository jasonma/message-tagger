import { ISensitiveEmail, Stats } from "../stats/Stats";

// TODO: write a real frontend.
export const STYLESHEET_PATH: string = "/style.css";
export const STYLESHEET: string = `
body {
    font-family: Arial, Helvetica, sans-serif;
}

thead,
tfoot {
    background-color: #3f87a6;
    color: #fff;
}

tbody {
    background-color: #e4f0f5;
}

caption {
    padding: 10px;
    caption-side: bottom;
}

table {
    border-collapse: collapse;
    border: 2px solid rgb(200, 200, 200);
    letter-spacing: 1px;
    font-family: sans-serif;
    font-size: .8rem;
}

td,
th {
    border: 1px solid rgb(190, 190, 190);
    padding: 5px 10px;
}`;

export class Ui {
    constructor(private stats: Stats) {}

    public render(): string {
        const messages = this.stats.getSensitiveEmails();
        return `<html>
            <head>
                <title>Message Tagger</title>
                <link rel="stylesheet" type="text/css" href="${STYLESHEET_PATH}">
            </head>
            <body>
                <p>Processed ${this.stats.getNumProcessed()} e-mails, of which ${messages.length} were sensitive.</p>
                ${this.renderTable(messages)}
            </body>
        </html>`;
    }

    private renderTable(messages: ISensitiveEmail[]): string {
        return `<table>
                <thead>
                    <tr><td>Date</td><td>From</td><td>Subject</td><td>Score</td><td>Reason</td></tr>
                </thead>
                <tbody>
                    ${messages.map((message: ISensitiveEmail) => this.renderMessage(message)).join("\n")}
                </tbody>
            </table>`;
    }

    private renderMessage(message: ISensitiveEmail): string {
        const fields: string[] = [
            message.date.toString(),
            message.from,
            message.subject,
            message.score.sensitivity.toString(),
            message.score.reason,
        ];
        return `<tr>${fields.map((field: string) => `<td>${this.encode(field)}</td>`).join("")}</tr>`;
    }

    private encode(data: string): string {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
