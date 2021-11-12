export const name = 'crash';
export const description = 'Restart the bot.';
export function execute(message) {
	message.client.user.setPresence({ activities: [{ name: 'Restarting...' }], status: 'idle' });
	setTimeout(() => { process.exit(); }, 0);
}