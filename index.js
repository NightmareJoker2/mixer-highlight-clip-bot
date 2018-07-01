const Beam = require('beam-client-node');
const Carina = require('carina').Carina;
const ws = require('ws');
const config = require('config');
Carina.WebSocket = ws;
const carina = new Carina();
carina.on('event:hello', () => {
    console.log('Connected to Constellation');
});
carina.open();

let BeamClient = new Beam.Client(new Beam.DefaultRequestRunner());
var beamChannel = config.get('Channels')[0]; // your channel token (username) or ID here

var channelInfo;
var userInfo;
var chatSocket;
var carinaSubscribed = false;

const apiKey = config.get('Beam.api_key');
const apiKey2 = config.get('Beam.api_key2');

BeamClient.use(new Beam.OAuthProvider(BeamClient, {
    tokens: {
        access: apiKey,
        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
    },
}));
BeamClient.request('GET', 'users/current')
    .then(response =>
        {
            userInfo = response.body;
            BeamClient.request('GET', 'channels/' + beamChannel)
                .then(response =>
                {
                    channelInfo = response.body;
                    if (typeof(beamChannel) === 'string' && beamChannel != channelInfo.token)
                    {
                        console.warn('Channel identified by token `' + beamChannel + '` has been renamed to `' + channelInfo.token + '`.');
                    }
                    return new Beam.ChatService(BeamClient).join(response.body.id);
                })
                .then(response =>
                {
                    return createBeamChatSocket(userInfo.id, channelInfo.id, response.body.endpoints, response.body.hasOwnProperty('authkey') ? response.body.authkey : null);
                })
                .catch(error =>
                {
                    if (error.statusCode == 404 && error.message == 'Channel not found.')
                    {
                        console.error('Channel with token or ID `' + beamChannel + '` does not exist.');
                        return;
                    }
                    else
                    {
                        console.error(error);
                    }
                });
        }).catch(error =>
        {
            console.error(error);
        });

function createBeamChatSocket(userId, channelId, endpoints, authkey)
{
    const socket = new Beam.Socket(ws, endpoints).boot();
    chatSocket = socket;

    socket.on('UserJoin', data =>
    {
        console.log('User with name `' + data.username + '` and ID `' + data.id + '` has joined.');
    });

    socket.on('UserLeave', data =>
    {
        console.log('User with name `' + data.username + '` and ID `' + data.id + '` has left.');
    });

    socket.on('ChatMessage', data =>
    {
        //console.log(data);
        var messageText = '';
        for (var i = 0; i < data.message.message.length; i++)
        {
            messageText += data.message.message[i].text;
        }
        console.log(data.user_name + ': ' + messageText);
        handleMessage(messageText, data.user_name, data.user_id, data.user_roles);
    });

    socket.on('error', error =>
    {
        console.error(error);
    });

    socket.on('connected', data =>
    {
        console.log('Connected to chat');
    });

    socket.on('authresult', data =>
    {
        if (data.authenticated)
        {
            console.log('Authenticated to chat as user with roles/permissions');
            if (!carinaSubscribed)
            {
                // carina.subscribe(event, data => callback); here
                console.log('Subscribed to events on Constellation.');
                carinaSubscribed = true; // chat can reconnect, let's make sure we only subscribe once
            }
        }
        else
        {
            console.log('Anonymously connected to chat.');
            console.warn('Listening to messages only');
        }
    });

    console.log('Authenticating chat...');
    return socket.auth(channelId, userId, authkey).then(() =>
    {
        console.log('Authenticated to chat.');
    });
}

function handleMessage(message, username, userId, userRoles)
{
    if (typeof(message) != 'string')
    {
        console.error('Message is not a string:', message);
    }
    else
    {
        if (false) // add conditions here
        {
            // send a message?
            chatSocket.call('msg', ['@' + username + ' Hello!']);
        }
        else if (message == '!clip' || message.startsWith('!clip '))
        {
            let authorized_userIds = config.get('Beam.authorized_userIds');
            let userIsAuthorized = authorized_userIds.includes(userId);
            let authorized_roles = config.get('Beam.authorized_roles');
            let roleIsAuthorized = userRoles.some(item => authorized_roles.indexOf(item) > -1);
            if (userIsAuthorized || roleIsAuthorized)
            {
                let BeamClient2 = new Beam.Client(new Beam.DefaultRequestRunner());
                let thatApiKey = apiKey2;
                if (typeof(thatApiKey) == 'undefined' || thatApiKey == null)
                {
                    thatApiKey = apiKey;
                }
                BeamClient2.use(new Beam.OAuthProvider(BeamClient2, {
                    tokens: {
                        access: thatApiKey,
                        expires: Date.now() + (365 * 24 * 60 * 60 * 1000)
                    },
                }));
                BeamClient2.request('GET', 'channels/'+ channelInfo.id + '/broadcast')
                    .then(response =>
                        {
                            if (response.body.hasOwnProperty('id'))
                            {
                                highlightTitle = null;
                                clipDuration = 30;
                                if (message.startsWith('!clip '))
                                {
                                    let commandArgumentString = message.substring(6);
                                    let commandArguments = commandArgumentString.trim().split(/\s+/);
                                    let requestedClipDuration = null;
                                    if (commandArguments.length > 0 && isNaN(commandArguments[0]) && isNaN(commandArguments[commandArguments.length - 1]))
                                    {
                                        highlightTitle = commandArgumentString.trim();
                                    }
                                    else if (commandArguments.length > 0 && !isNaN(commandArguments[commandArguments.length - 1]))
                                    {
                                        requestedClipDuration = parseInt(commandArguments[commandArguments.length - 1]);
                                        if (commandArguments.length > 1)
                                        {
                                            highlightTitle = commandArgumentString.substring(0, commandArgumentString.length - commandArguments[commandArguments.length - 1].length).trim();
                                        }
                                    }
                                    else if (commandArguments.length > 0 && !isNaN(commandArguments[0]))
                                    {
                                        requestedClipDuration = parseInt(commandArguments[0]);
                                        if (commandArguments.length > 1)
                                        {
                                            highlightTitle = commandArgumentString.substring(commandArguments[0].length).trim();
                                        }
                                    }
                                    if (highlightTitle != null && typeof(highlightTitle) !== 'undefined')
                                    {
                                        highlightTitle = highlightTitle.replace(/^"(.*)"$/, '$1').trim();
                                    }

                                    if (requestedClipDuration != null && requestedClipDuration < 15)
                                    {
                                        clipDuration = 15;
                                    }
                                    else if (requestedClipDuration != null && requestedClipDuration > 300)
                                    {
                                        clipDuration = 300;
                                    }
                                    else if (requestedClipDuration != null)
                                    {
                                        clipDuration = requestedClipDuration;
                                    }
                                }
                                highlightClipRequestObject = {
                                    broadcastId: response.body.id,
                                    clipDurationInSeconds: clipDuration
                                };
                                if (highlightTitle != null && typeof(highlightTitle) !== 'undefined')
                                {
                                    highlightClipRequestObject.highlightTitle = highlightTitle;
                                }
                                //console.log(highlightClipRequestObject);
                                BeamClient2.request('POST', 'clips/create', { body: highlightClipRequestObject })
                                    .then(response =>
                                    {
                                        //console.log(response.body);
                                        if (response.body.hasOwnProperty('contentId'))
                                        {
                                            let successResponse = 'Successfully created clip "' + response.body.title + '" with a duration of ' + response.body.durationInSeconds + ' seconds. https://mixer.com/' + channelInfo.token + '?clip=' + response.body.shareableId + ' \\ :D /';
                                            successResponse = successResponse.substring(0, 359);
                                            chatSocket.call('msg', [successResponse]);
                                        }
                                        else
                                        {
                                            throw "BeamAPIErrorException: " + JSON.stringify(response.body);
                                        }
                                    }).catch(error =>
                                    {
                                        console.error(error);
                                        chatSocket.call('msg', ['An error occurred creating your clip... :(']);
                                    });
                            }
                            else
                            {
                                console.error('Error: Attempted to create a highlight clip when not broadcasting... that won\'t work... *sad face emoji*'); 
                                // can we haz method to clip sections of a VoD, plez? :3
                                chatSocket.call('msg', ['You cannot create a highlight clip while the channel is not broadcasting! >.< \n So sorry... :#']);
                            }
                        }).catch(error =>
                        {
                            console.error(error);
                        });
            }
            else
            {
                chatSocket.call('whisper', [username, 'You do not have permission to use this, sorry.']);
            }
        }
    }
}