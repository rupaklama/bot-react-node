const dialogflow = require("dialogflow");
const config = require("../config/keys");

const structjson = require("../structjson");

// Create a new session
const sessionClient = new dialogflow.SessionsClient({
  keyFilename: "../chatbot/react-chat-bot-agent-usvq-6723bb0f5cf4.json",
});

module.exports = app => {
  app.get("/", (req, res) => {
    res.status(200).send({ hello: "rupak" });
  });

  // text query from user
  app.post("/api/df-text-query", async (req, res) => {
    // note - sessionID is unique to every user for different sessions
    const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + req.userID);

    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          // The query to send to the dialogflow agent
          text: req.body.text,
          // The language used by the client (en-US)
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);

    console.log("Detected intent");

    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);

    if (result.intent) {
      console.log(`Intent: ${result.intent.displayName}`);
    } else {
      console.log(`No intent matched.`);
    }

    res.status(200).send(responses[0].queryResult);
  });

  // event query to call df intents
  app.post("/api/df-event-query", async (req, res) => {
    // console.log("BODY", req.body);

    const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + req.userID);

    const request = {
      session: sessionPath,
      queryInput: {
        event: {
          // The event query to send to the dialogflow agent at Default Welcome Intent
          name: req.body.event,

          // Node.js client for Dialogflow uses jsonToStructProto to send parameters
          parameters: structjson.jsonToStructProto(req.body.parameters),
          languageCode: config.dialogFlowSessionLanguageCode,
        },
      },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);

    console.log("Detected intent");

    const result = responses[0].queryResult;
    console.log(`Query: ${result.queryText}`);
    console.log(`Response: ${result.fulfillmentText}`);

    if (result.intent) {
      console.log(`Intent: ${result.intent.displayName}`);
    } else {
      console.log(`No intent matched.`);
    }

    res.status(200).send(responses[0].queryResult);
  });
};
