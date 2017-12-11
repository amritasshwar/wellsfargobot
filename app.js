// Add your requirements
// ({ appId: '5ec8de2f-dd70-4d6d-b44c-2e6d7944bc8b', appPassword: 'mysmDO914ockWQWEX78$*==' }); 
var restify = require('restify'); 
var builder = require('botbuilder'); 

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.PORT || 3000, function() 
{
   console.log('%s listening to %s', server.name, server.url); 
});

// Create chat bot
var connector = new builder.ChatConnector
({ appId: '5ec8de2f-dd70-4d6d-b44c-2e6d7944bc8b', appPassword: 'mysmDO914ockWQWEX78$*==' }); 
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create bot dialogs
bot.dialog('/', function (session) {
    session.send("Hello World");
});