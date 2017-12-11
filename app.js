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


// Listen for messages from users 
server.post('/api/messages', connector.listen());

// This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
var bot = new builder.UniversalBot(connector, [
    function (session) {

        builder.Prompts.text(session, 'Hi! I am Wells Fargo agent. I can help with your queries!');
        
    },
    function (session, results) {
        session.userData.question = results.response; // Save user profile.

        //Call the API AI

        var request = app.textRequest(session.userData.question, {
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
    

    }
]);