const { WebhookClient } = require("dialogflow-fulfillment");

const Demand = require("../models/Demand");

module.exports = app => {
  app.post("/", async (req, res) => {
    const agent = new WebhookClient({ request: req, response: res });

    // note - On calling snoopy intent now, we should not get text responses defined in Dialog Flow
    // since we have enable webhook on this intent and now the response will be sending from our
    // Backend Server here with the responses defined below here - agent.add('messages response')
    function snoopy(agent) {
      agent.add(`Welcome to my Snoopy fulfillment!`);
    }

    function learn(agent) {
      try {
        // write to db to create a course document
        // Update counter on particular course document or create course document
        Demand.findOne({ course: agent?.query }).then(course => {
          // on document exists
          if (course !== null) {
            course.counter++;
            course.save();
          } else {
            // note - agent will provide course name query from dialog flow to here
            const demand = new Demand({ course: agent?.query });
            demand.save();
          }
        });

        let responseText = `
        You want to learn about ${agent?.query}!
        Here is a link to all my courses: https://www.udemy.com/rl
      `;

        agent.add(responseText);
      } catch (err) {
        console.log(err);
      }
    }

    function fallback(agent) {
      agent.add(`I didn't understand`);
      agent.add(`I'm sorry, can you try again?`);
    }

    let intentMap = new Map();

    // adding intents into Map object to handle related intents here
    intentMap.set("snoopy", snoopy);
    intentMap.set("learn courses", learn);
    intentMap.set("Default Fallback Intent", fallback);

    agent.handleRequest(intentMap);
  });
};
