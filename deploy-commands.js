import "dotenv/config";
import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config.js";

// Necesario para rutas en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta correcta a la carpeta de comandos dentro de /src
const commandsPath = path.join(__dirname, "src", "commands");
const commands = [];

// Leer carpetas dentro de /src/commands
const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {
  const folderPath = path.join(commandsPath, folder);

  // Ignorar archivos sueltos
  if (!fs.lstatSync(folderPath).isDirectory()) continue;

  const commandFiles = fs
    .readdirSync(folderPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);

    try {
      const commandModule = await import(`file://${filePath}`);
      const command = commandModule.default;

      if (!command?.data) {
        console.warn(`⚠️ El archivo ${file} no exporta "data". Saltado.`);
        continue;
      }

      commands.push(command.data.toJSON());
    } catch (err) {
      console.error(`❌ Error cargando el comando ${file}:`, err);
    }
  }
}

// REST API para registrar comandos
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

try {
  console.log("🔄 Registrando comandos...");

  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log(`✅ ${commands.length} comandos registrados correctamente.`);
} catch (error) {
  console.error("❌ Error registrando comandos:", error);
}
