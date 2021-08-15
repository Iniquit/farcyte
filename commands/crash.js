module.exports = {
	name: 'crash',
	description: 'Restart the bot.',
	execute(message) {
		message.client.user.setPresence({ activities: [{ name: 'Restarting...' }], status: 'idle' });
		setTimeout(() => {process.exit();}, 0);

	},
};