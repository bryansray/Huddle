exports.index = function(req, res) {
	var channelId = req.params.channelId;

	var messages = [
		{ messageId: 1, user: "Bryan Ray", text: "This is a message.", timestamp: new Date(2015, 6, 6, 10, 12, 28) },
		{ messageId: 2, user: "Curtis Schlak", text: "This is another message for the channel.", timestamp: new Date(2015, 6, 6, 10, 22, 28, 0) },
		{ messageId: 3, user: "Heather Wood", text: "I'm going to type something very long to make sure that it wraps across the screen. I want to make sure that I didn't break anything by putting it in to a javascript template.", timestamp: new Date(2015, 6, 6, 10, 32, 28, 0) },
		{ messageId: 4, user: "Heather Wood", text: "I'm going to type something very long to make sure that it wraps across the screen. I want to make sure that I didn't break anything by putting it in to a javascript template.", timestamp: new Date(2015, 6, 6, 11, 32, 28, 0) },
	];

	if (channelId === '559c0ef37f3389f0aa7655b0') {
		messages.push({ messageId: 5, user: "Curtis Schlak", text: "This is another message for the channel that I think will be beneficial.", timestamp: new Date(2015, 6, 6, 12, 22, 28, 0) })
	}

	return res.json(messages);
}