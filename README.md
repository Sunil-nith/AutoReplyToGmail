# Email Auto-Response App.

* This is a simple email auto-response application built using Node.js.
* The app allows you to set up an automatic email response for incoming messages, providing a predefined reply to the sender.
* It can be useful for scenarios such as acknowledging receipt of emails,informing senders about office hours, or providing general information.



### technologies and libraries used.

1. **Express.js**: This is a popular Node.js web application framework used for creating web servers and handling HTTP requests. In your code, Express is used to set up a web server that listens on port 8080.

2. **Google APIs**: The application interacts with Google APIs to access Gmail functionality. Specifically, it uses the `googleapis` library to make requests to the Gmail API.

3. **OAuth2 Authentication**: The application uses OAuth2 for authentication with the Gmail API. OAuth2 is an industry-standard protocol for secure authorization. Users authenticate with their Google accounts, and the application receives access tokens to access their Gmail.

4. **`@google-cloud/local-auth`**: This library is used for authenticating with Google services locally. It's a Node.js library that helps you set up OAuth2 authentication and retrieve access tokens.

5. **`path`**: This is a built-in Node.js module that provides utilities for working with file and directory paths. In your code, it's used to construct the path to the credentials file.

6. **Gmail API Scopes**: The `SCOPES` variable defines the OAuth2 scopes required for the application to access Gmail. The scopes specify the level of access the application has, including reading, sending, managing labels, and accessing Gmail content.

7. **Gmail API Functions**: The code defines several functions that interact with the Gmail API, including:
   - `getNewMessages`: This function retrieves new, unread messages in the authenticated Gmail account.
   - `sendReply`: It sends automated replies to messages.
   - `createOrFindLabel`: This function creates or finds a label to categorize Gmail messages.
   - `addLabelToMessage`: It adds a label to a Gmail message.

8. **Main Automation Loop**: The `main` function is the core of the application. It sets up an interval to periodically check for new messages, send automated replies, and add labels to processed messages. The interval duration is randomized between a minimum and maximum value, creating some variation in when the app checks for new messages.

9. **Randomization**: The application uses a random duration for checking Gmail to avoid being too predictable. This randomization is intended to simulate a more natural response pattern.

10. **Express Route**: The root route of the Express application (`'/'`) triggers the authentication process when a user accesses the application in a web browser. After authentication, the main automation process starts.

11. **Express Server**: The Express server is started and listens on port 8080. It also provides a message in the console and instructs users to go to a specific URL for authentication.

### Areas for Code Improvement.

1. **Error Handling**: Improve error handling and provide meaningful error messages to users.

2. **Modularity**: Enhance code modularity for better maintenance and testing.

3. **Configuration Management**: Manage configuration settings separately from the code.

4. **Security**: Prioritize security, including secure credential storage and access controls.

5. **User Experience**: Enhance the user experience by providing feedback during the automation process.


## Features
* Login with google: You can login to your gmail with google account.
* Automatic email response: When an email is received, the app will send an automatic response to the sender.
* Customizable message: You can define the content of the automatic response message according to your needs.
* Email Labeling : This app add a Label to the email and move the email to the label.
* Easy setup: The application is built using Node.js, which makes it easy to install and run on any system.


## Prerequisites
Before running the application, make sure you have the following prerequisites installed on your system:

* Node.js (version 10 or higher)
* NPM (Node Package Manager)



### Installation

1. Get Your Google credentials.json file. [https://developers.google.com/gmail/api/quickstart/nodejs](https://developers.google.com/gmail/api/quickstart/nodejs)
2. Clone the repo
   ```sh
   git clone https://github.com/Sunil-nith/AutoReplyToGmail.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Replace this credentials.json file with your downloaded credentials.json file.
   

## Usage

Once the application is running, it will continuously monitor the configured email account for incoming messages. When an email arrives, an automatic response will be sent to the sender using the provided message and After sending the reply, the email should be tagged with a label(Provided by you) in Gmail.
You can leave the application running in the background or integrate it with other systems as needed.



## Acknowledgments
This application was inspired by the need for automated email responses in various scenarios. It serves as a starting point for building more complex email handling systems.
## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvement, please create an issue or submit a pull request

## Contact

If you have any questions or need further assistance, please feel free to contact me at skjnv2009@gmail.com.