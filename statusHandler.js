/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.

StatusHandler =  {

   handler = function (event, context) {
      try {
          console.log("event.session.application.applicationId=" + event.session.application.applicationId);

          /**
           * Uncomment this if statement and populate with your skill's application ID to
           * prevent someone else from configuring a skill that sends requests to this function.
           */
          /*
          if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
               context.fail("Invalid Application ID");
          }
          */

          if (event.session.new) {
              onSessionStarted({requestId: event.request.requestId}, event.session);
          }

          if (event.request.type === "LaunchRequest") {
              onLaunch(event.request,
                  event.session,
                  function callback(sessionAttributes, speechletResponse) {
                      context.succeed(buildResponse(sessionAttributes, speechletResponse));
                  });
          } else if (event.request.type === "IntentRequest") {
              onIntent(event.request,
                  event.session,
                  function callback(sessionAttributes, speechletResponse) {
                      context.succeed(buildResponse(sessionAttributes, speechletResponse));
                  });
          } else if (event.request.type === "SessionEndedRequest") {
              onSessionEnded(event.request, event.session);
              context.succeed();
          }
      } catch (e) {
          context.fail("Exception: " + e);
      }

  /**
   * Called when the session starts.
   */
  function onSessionStarted(sessionStartedRequest, session) {
      console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
          ", sessionId=" + session.sessionId);
  }

  /**
   * Called when the user launches the skill without specifying what they want.
   */
  function onLaunch(launchRequest, session, callback) {
      console.log("onLaunch requestId=" + launchRequest.requestId +
          ", sessionId=" + session.sessionId);

      // Dispatch to your skill's launch.
      getWelcomeResponse(callback);
  }

  /**
   * Called when the user specifies an intent for this skill.
   */
  function onIntent(intentRequest, session, callback) {
      console.log("onIntent requestId=" + intentRequest.requestId +
          ", sessionId=" + session.sessionId);

      var intent = intentRequest.intent,
          intentName = intentRequest.intent.name;

      // Dispatch to your skill's intent handlers
      if ("status" === intentName) {
          checkStatus(intent, session, callback);
      } else {
          throw "Invalid intent";
      }
  }

  /**
   * Called when the user ends the session.
   * Is not called when the skill returns shouldEndSession=true.
   */
  function onSessionEnded(sessionEndedRequest, session) {
      console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
          ", sessionId=" + session.sessionId);
      // Add cleanup logic here
  }

  // --------------- Functions that control the skill's behavior -----------------------

  function getWelcomeResponse(callback) {
      // If we wanted to initialize the session to have some attributes we could add those here.
      var sessionAttributes = {};
      var cardTitle = "Welcome";
      var speechOutput = "Application name please.";
      // If the user either does not reply to the welcome message or says something that is not
      // understood, they will be prompted again with this text.
      var repromptText = "Application name please.";
      var shouldEndSession = false;

      callback(sessionAttributes,
          buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }

  function handleSessionEndRequest(callback) {
      var cardTitle = "Session Ended";
      var speechOutput = "Get back to work!";
      // Setting this to true ends the session and exits the skill.
      var shouldEndSession = true;

      callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
  }

  /**
   * Sets the name in the session and prepares the speech to reply to the user.
   */
  function status(intent, session, callback) {
      var status = intent.name;
      var applicationName = intent.slots.applicationName;
      var repromptText = "";
      var sessionAttributes = {};
      var shouldEndSession = false;
      var speechOutput = "";

      console.log ("setStatus -> applicationName: " + JSON.stringify(applicationName));

      if (applicationName) {
          sessionAttributes = createApplicationNameAttributes(applicationName.value);
          speechOutput = "I now know your application is " + applicationName;

          repromptText = "What is your application again?";
      } else {
          speechOutput = "What?. Please try again";
          repromptText = "What is your application again?";
      }

      callback(sessionAttributes,
           buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
  }

  function createApplicationNameAttributes(myApplicationName) {
      return {
          myApplicationName: myApplicationName
      };
  }

  // --------------- Helpers that build all of the responses -----------------------

  function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
      return {
          outputSpeech: {
              type: "PlainText",
              text: output
          },
          card: {
              type: "Simple",
              title: "SessionSpeechlet - " + title,
              content: "SessionSpeechlet - " + output
          },
          reprompt: {
              outputSpeech: {
                  type: "PlainText",
                  text: repromptText
              }
          },
          shouldEndSession: shouldEndSession
      };
  }

  function buildResponse(sessionAttributes, speechletResponse) {
      return {
          version: "1.0",
          sessionAttributes: sessionAttributes,
          response: speechletResponse
      };
  }

}

// module.exports = StatusHandler;
