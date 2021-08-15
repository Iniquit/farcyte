const fs = require('fs');
const { Client, Intents, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
	console.log('Unsounded Search is awake!');
	client.user.setActivity('/find');
});


client.on('messageCreate', message => {

	// Ignore bots (including myself)
	if (message.author.bot) return;

	// Command handling
	if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

	const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
	const cmd = args.shift().toLowerCase();

	if (!client.commands.has(cmd)) return;

	try {
		client.commands.get(cmd).execute(message, args);
		const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		console.log(`[${new Date().toLocaleDateString('en-US', options)}]: Command ${cmd} issued by ${message.member.user.tag} with args '${args.join(' ')}'`);
	}
	catch (error) {
		console.error(error);
		message.channel.send(`Hey, something broke:\n\`${error}\``);
	}

});

client.login(process.env.TOKEN);