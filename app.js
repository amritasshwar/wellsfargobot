// Add your requirements
// ({ appId: '5ec8de2f-dd70-4d6d-b44c-2e6d7944bc8b', appPassword: 'mysmDO914ockWQWEX78$*==' }); 

var restify = require('restify');
var builder = require('botbuilder');

//API AI
var apiai = require('apiai');
var client_access_token = "23d99088855c45dcbc166382bd5e5f60";
var app = apiai(client_access_token);


// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector
({ appId: '5ec8de2f-dd70-4d6d-b44c-2e6d7944bc8b', appPassword: 'mysmDO914ockWQWEX78$*==' }); 


var timeout = 3000;

// Listen for messages from users 
server.post('/api/messages', connector.listen());


var inMemoryStorage = new builder.MemoryBotStorage();

// This bot ensures user's profile is up to date.
var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.beginDialog('ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response; // Save user profile.

        //**********************************************************************


        // Call API AI with the question

        var userQuestion  = session.message.text;

        session.sendTyping();
            setTimeout(function () {
        }, timeout);


        var request = app.textRequest(userQuestion, {
        sessionId: '1234'
        });

        var jsonResponse  = "";

        request.on('response', function(response) {
        console.log(response);
        jsonResponse  = JSON.parse(JSON.stringify(response));

        console.log("***************************************");
        console.log(jsonResponse.id);
        var speechArray = JSON.parse(JSON.stringify(jsonResponse.result.fulfillment.messages));
        console.log(speechArray.length);
        for(var i = 0; i < speechArray.length; i++)
        {
            var speech = speechArray[i].speech;
            session.send(speech);
            console.log('the answer i got is ');
            console.log(speech);

        }

        console.log("***************Looking at the data************************");

        var dataArray = JSON.parse(JSON.stringify(jsonResponse.result.fulfillment.data));
        console.log(dataArray.length);
        for(var i = 0; i < dataArray.length; i++)
        {
            var answertext = dataArray[i].context.text;
            session.send(answertext);
            console.log('the answer i got is ');
            console.log(answertext);

        }

        });

        request.on('error', function(error) {
        console.log(error);
        });


        request.end();
 

        //**********************************************************************




    }
]).set('storage', inMemoryStorage); // Register in-memory storage 



bot.dialog('ensureProfile', [
    function (session, args, next) {
        session.dialogData.profile = args || {}; // Set the profile or create the object.
        if (!session.dialogData.profile.name) {
            session.sendTyping();
            setTimeout(function () {
             }, timeout);

            session.send(`Hi!`)

            session.sendTyping();
            setTimeout(function () {
            }, timeout);

            builder.Prompts.text(session, "What's your name?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results, next) {
        if (results.response) {
            // Save user's name if we asked for it.
            session.dialogData.profile.name = results.response;

            session.sendTyping();
            setTimeout(function () {
            }, timeout);


            session.send(`Hello ${session.dialogData.profile.name}! I would love to assist you with your questions!`);
        }
        if (!session.dialogData.profile.question) {

                    session.sendTyping();
            setTimeout(function () {
        }, timeout);

            builder.Prompts.text(session, "You can ask me questions such as How should I transfer funds ?");
        } else {
            next(); // Skip if we already have this info.
        }
    },
    function (session, results) {
        if (results.response) {
            
            // Save user's name if we asked for it.
            session.dialogData.profile.question = results.response;

        }
        session.endDialogWithResult({ response: session.dialogData.profile });
    }
]);

// Add a help dialog with a trigger action that is bound to the 'Help' intent
bot.dialog('helpDialog', function (session) {
    session.endDialog("I can answer simple questions. Say 'How can I transfer funds?' .");
}).triggerAction({ matches: 'Help' });


// Add a global endConversation() action that is bound to the 'Goodbye' intent
bot.endConversationAction('goodbyeAction', "Ok... See you later.", { matches: 'Goodbye' });






// Handle all user conversations
bot.dialog('/alluserinput', [

    function (session) {
        session.beginDialog('ensureProfile', session.userData.profile);
    },
    function (session, results) {
        session.userData.profile = results.response; // Save user profile.
        session.send(`Hello ${session.userData.profile.name}! I love ${session.userData.profile.company}!`);
    },
    function (session, args, next) {

        //Greet user for the first time
        //session.beginDialog('greetUser');

        //}
        var currentUserResponse  = session.message.text;

        if (!session.dialogData.profile.name) {
            session.send( "What's your name?");
        } 

        session.endDialog(currentUserResponse);
    }
]).triggerAction({ matches: /^.xxxxx/ });