const path = require('path')
const dialogflow = require('dialogflow');
const uuid = require('uuid');
const querystring = require('querystring');
const https = require('https');
const PORT = process.env.PORT || 5000

var MongoClient = require('mongodb').MongoClient;

function httpsget(address, callback) {
	let data = '';
	https.get(address, (res) => {
		res.on('data', (chunk) => {
			data += chunk;
		});
		res.on('end', () => {
			typeof callback === 'function' && callback (data);
	  });
	}).on('error', (e) => {
		console.error(e);
	});
}

function vkAPIcall(method, parameters, vk_callback)
{
	httpsget("https://api.vk.com/method/" + method + "?" + querystring.stringify(parameters), vk_callback);
}

function sendVKmessage(usertosend, messagetosend, my_access_token)
{
	vkAPIcall("messages.send", {access_token: my_access_token, v: 5.92, user_id: usertosend, random_id: Math.random() * 123456789, message: messagetosend});
}

function noidea()
{
	var noget = [ "Ты о чём ?", "В смысле ?", "М ?", "Блин, сложно" ];
	return noget[Math.floor(Math.random() * noget.length)];
}

async function runSample(sessionId, querytosend,callback)
{
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'apikey.json'
});
  const sessionPath = sessionClient.sessionPath('small-talk-96170', sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: querytosend,
        languageCode: 'ru-RU',
      },
    },
  };
	const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
	if (result.intent) {
		console.log(result.queryText + " => " + result.fulfillmentText + " || " + result.intent.displayName);
		callback(result.fulfillmentText);
  } else {
    console.log(result.queryText + " => No intent matched.");
		callback(noidea());
  }
}

async function begformoney(sessionId,callback)
{
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: 'apikey.json'
});
  const sessionPath = sessionClient.sessionPath('small-talk-96170', sessionId);
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        name: 'BEG_EVENT',
        languageCode: 'ru-RU',
      },
    },
  };
	const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
	if (result.intent) {
		console.log(result.fulfillmentText + " || " + result.intent.displayName);
		callback(result.fulfillmentText);
  } else {
    console.log("No intent matched.");
		callback(noidea());
  }
}

function mongouse(callback)
{
	MongoClient.connect('mongodb://artnavsegda:dep7k36c@ds129051.mlab.com:29051/artnavsegda', function (err, client) {
//	MongoClient.connect('mongodb://localhost:27017', function (err, client) {
		if (err) throw err;
		var db = client.db('artnavsegda');
		callback(db);
	})
}

function workcycle()
{
	mongouse((db) => {
		db.collection('blog').find({}).forEach((query) => {
			vkAPIcall("messages.getConversations", {access_token: query.accesstoken, v: 5.92, filter: "unread"}, (workdata) => {
				var parsed = JSON.parse(workdata);
				parsed.response.items.forEach((element) => {
					if(element.conversation.peer.type === "user")
					{
						db.collection('blog').findOne({"users.peerid": element.conversation.peer.id}, {projection: {"users.$" : 1}}, (err, result) => {
							var sessionId = uuid.v4();
							var givemoney = false;
							if (result)	{
								sessionId = result.users[0].sessionid;
								result.users[0].messagescount++;
								db.collection('blog').updateOne({"users.peerid": element.conversation.peer.id},{$set: {"users.$.messagescount" : result.users[0].messagescount}});
								if (result.users[0].messagescount == 10)
								{
									givemoney = true;
								}
							}
							else {
								sessionId = uuid.v4();
								query.users.push({peerid : element.conversation.peer.id, sessionid : sessionId, messagescount : 1});
								db.collection('blog').save(query);
							}
							if (element.last_message.text) {
								runSample(sessionId, element.last_message.text, (result) => {
									sendVKmessage(element.conversation.peer.id, result, query.accesstoken);
								})
							}
							else {
								console.log("No text recieved");
								sendVKmessage(element.conversation.peer.id, noidea(), query.accesstoken);
							}
							if (givemoney)
							{
								setTimeout(() => {
									begformoney(sessionId,(result) => {
										sendVKmessage(element.conversation.peer.id, result, query.accesstoken);
									})
								}, 10000);
							}
							vkAPIcall("messages.markAsRead", {access_token: query.accesstoken, v: 5.92, peer_id: element.conversation.peer.id, start_message_id: element.last_message.id});
						})
					}
				})
			})
		})
	})
}

setInterval(workcycle, 5000);
