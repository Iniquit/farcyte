import { readdirSync } from 'fs';
import { Client, Intents, Collection } from 'discord.js';
import { log } from './functions/utils.js';
import dotenv from 'dotenv'
dotenv.config()

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES],
	partials: ['CHANNEL'],
	...(/^\d+$/.test(process.env.REST_REQUEST_TIMEOUT_MS) && { restRequestTimeout: parseInt(process.env.REST_REQUEST_TIMEOUT_MS) }) // use defaults or override with .env
});
client.commands = new Collection();

const commandFiles = readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	import(`./commands/${file}`).then((command) => {
		client.commands.set(command.name, command);
	});

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
		log(`${message.author.tag} issued command ${cmd} with args '${args.join(' ')}'`);
	}
	catch (error) {
		console.error(error);
		message.channel.send(`Hey, something broke:\n\`${error}\``);
	}

});

client.login(process.env.TOKEN);