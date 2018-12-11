message-tagger
===

Let's tag some sensitive e-mails.

1. Install the dependencies: `yarn install`
1. Create a file `client_id.ts` in `src/gmail/auth` with content `export const CLIENT_SECRET: string = "CLIENT_SECRET_HERE";`
1. Replace `CLIENT_SECRET_HERE` with the client secret.
1. Start the server: `npm run start`
1. Navigate to http://localhost:3000. You will be re-directed to a Google OAuth page.
1. After you authorize this application, you will be re-directed to a simple page that displays the e-mails marked as sensitive.
1. Refresh this page to get updates on progress.
