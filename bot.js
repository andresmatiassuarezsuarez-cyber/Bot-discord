import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ❗ ELIMINADO keepAlive.js porque NO existe
// import './keepAlive.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();

// 📌 RUTA CORRECTA DE COMANDOS
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);
  const commandFiles = fs.readdirSync(folderPath).filter(f => f.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    const command = (await import(`file://${filePath}`)).default;

    if (!command?.data?.name) {
      console.warn(`⚠️ Comando omitido (sin data): ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }
}

// 📌 RUTA CORRECTA DE EVENTOS
const eventsPath = path.join(__dirname, 'src', 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(eventsPath, file);
  const event = (await import(`file://${filePath}`)).default;

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

client.login(process.env.TOKEN);

