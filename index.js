const express = require('express');
const app = express();
const port = 8080;
const path = require('path');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const LABEL_NAME = 'Vacation';

// Define the required OAuth2 scopes for Gmail API access
const SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.labels',
    'https://mail.google.com/'
];

app.get('/', async (req, res) => {
    try {
        // Authenticate the app with the specified OAuth2 scopes
        const auth = await authenticate({
            keyfilePath: path.join(__dirname, 'credentials.json'),
            scopes: SCOPES,
        });

        // Start the main automation process
        main(auth);

        // Inform the user about successful authentication and the app's purpose
        console.log("Authentication successful! Gmail automation has started.");
        console.log("The app will periodically check your Gmail for new messages and send automated replies to first-time email threads.");
        res.send('Gmail automation started.');
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Function to retrieve new messages that have no prior replies.
async function getNewMessages(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.list({
        userId: 'me',
        q: '-in:chats -from:me -has:userlabels is:unread'
    });
    console.log(`Found ${res.data.messages.length} new messages:`);
    return res.data.messages || [];
}

// Function to send an automated reply to a message
async function sendReply(auth, message) {
    const gmail = google.gmail({ version: 'v1', auth });
    const res = await gmail.users.messages.get({
        userId: 'me',
        id: message.id,
        format: 'metadata',
        metadataHeaders: ['Subject', 'From'],
    });
    const subject = res.data.payload.headers.find(
        (header) => header.name === 'Subject'
    ).value;
    const from = res.data.payload.headers.find(
        (header) => header.name === 'From'
    ).value;
    const replyTo = from.match(/<(.*)>/)[1];
    const replySubject = subject.startsWith('Re:') ? subject : `Re:${subject}`;
    const replyBody = `Hi,\n\nI am currently on vacation.\n\nBest,\nSnjeev`;
    const rawMessage = [
        `From :me`,
        `To :${replyTo}`,
        `Subject :${replySubject}`,
        `In-Reply-To:${message.id}`,
        `References:${message.id}`,
        '',
        replyBody,
    ].join('\n');
    const encodedMessage = Buffer.from(rawMessage).toString('base64').replace(/\+/g, '-').replace(/=+$/, '');
    await gmail.users.messages.send({
        userId: 'me',
        requestBody: {
            raw: encodedMessage,
        },
    });
}

// Function to create or find a label for Gmail messages
async function createOrFindLabel(auth) {
    const gmail = google.gmail({ version: 'v1', auth });
    try {
        const res = await gmail.users.labels.create({
            userId: 'me',
            requestBody: {
                name: LABEL_NAME,
                labelListVisibility: 'labelShow',
                messageListVisibility: 'show',
            },
        });
        return res.data.id;
    } catch (err) {
        if (err.code === 409) {
            const res = await gmail.users.labels.list({
                userId: 'me',
            });
            const label = res.data.labels.find((label) => label.name === LABEL_NAME);
            return label.id;
        } else {
            throw err;
        }
    }
}

// Function to add a label to a Gmail message
async function addLabelToMessage(auth, message, labelId) {
    const gmail = google.gmail({ version: 'v1', auth });
    await gmail.users.messages.modify({
        userId: 'me',
        id: message.id,
        requestBody: {
            addLabelIds: [labelId],
            removeLabelIds: ['INBOX'],
        },
    });
}

// Main automation function that periodically checks for new messages and handles them
function main(auth) {
    // Minimum and maximum intervals for checking Gmail (in milliseconds)
    const minInterval = 45 * 1000; // 45 seconds
    const maxInterval = 120 * 1000; // 2 minutes

    // Generate a random duration within the specified interval
    const randomDuration = Math.floor(Math.random() * (maxInterval - minInterval + 1)) + minInterval;

    // Set up an interval to periodically check for and process new messages
    setInterval(async () => {
        try {
            // Get a list of new messages from the authenticated Gmail account
            const messages = await getNewMessages(auth);
            
            // Create or find the designated label for these messages
            const labelId = await createOrFindLabel(auth);

            // Process each new message
            for (const message of messages) {
                // Send an automated reply to the message
                await sendReply(auth, message);
                console.log(`Sent Reply to message with id ${message.id}`);
                
                // Add the designated label to the processed message
                await addLabelToMessage(auth, message, labelId);
                console.log(`Added label to message id ${message.id}`);
            }
        } catch (error) {
            console.error('Error during interval execution:', error);
        }
    }, randomDuration);
}


// Start the Express app and listen on the specified port
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    console.log(`Go to http://localhost:${port} in your web browser to authenticate this app with your Gmail account.`);
});