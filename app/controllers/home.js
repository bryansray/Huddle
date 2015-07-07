export let index = function(req, res) {
	var messages = [
		{ id: 1, user: "Curtis Schlak", text: "This is a message for the room.", timestamp: new Date() }, 
		{ id: 2, user: "Bryan Ray", text: "This is a really long  message for the room that will hopefully wrap below whenever it goes down. Perhaps we can get it to wrap a couple times if we're extremely long winded..", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 3, user: "Heather Wood", text: "This is another message from Heather that will be medium sized.", timestamp: new Date() },
		{ id: 4, user: "Bryan Ray", text: "This is a really long  message for the room that will hopefully wrap below whenever it goes down. Perhaps we can get it to wrap a couple times if we're extremely long winded.This is a really long  message for the room that will hopefully wrap below whenever it goes down. Perhaps we can get it to wrap a couple times if we're extremely long winded.", timestamp: new Date() },
	];

	res.render('home/index', { messages: messages });
};