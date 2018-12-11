import { IMessage } from "../message/api";
import { Stats } from "../stats/Stats";

// TODO: write a real frontend.
export const STYLESHEET_PATH: string = "/style.css";
export const STYLESHEET: string = `
body {
    font-family: Arial, Helvetica, sans-serif;
}

td {
    padding: 5px;
}

tr:nth-child(even) {
    background: #f2f2f2;
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

    private renderTable(messages: IMessage[]): string {
        return `<table>
                ${messages.map((message: IMessage) => this.renderMessage(message)).join("\n")}
            </table>`;
    }

    private renderMessage(message: IMessage): string {
        const fields: string[] = [
            message.date.toString(),
            message.from.toString(),
            message.subject,
        ];
        return `<tr>${fields.map((field: string) => `<td>${this.encode(field)}</td>`).join("")}</tr>`;
    }

    private encode(data: string): string {
        return data.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
}
