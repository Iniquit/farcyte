export const name = 'f';
export const description = 'Look something up in the Unsounded transcript, but quietly';
export const usage = '<text>';
export function execute(message, args) {
	message.client.commands.get('find').execute(message, args, true);

}
