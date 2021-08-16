module.exports = {
	name: 'f',
	description: 'Look something up in the Unsounded transcript, but quietly',
	usage: '<text>',
	execute(message, args) {
		message.client.commands.get('find').execute(message, args, true);

	},
	};
