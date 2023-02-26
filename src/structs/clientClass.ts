import { Collection, REST } from 'discord.js';
import { Client as DiscordClient, Collection as DiscordCollection, Routes as DiscordRoutes } from 'discord.js';

import Command from './command';
import { join } from "path";
import { readdirSync } from "fs";
import { config } from 'dotenv';

export default class ClientClass extends DiscordClient {
  commands: Collection<string, Command>;
  events: Collection<string, Event>;

  constructor(intents: { intents: any[] }) {
    super({ // defining the client with the intents
      intents: intents.intents
    });

    this.commands = new DiscordCollection();
    this.events = new DiscordCollection();

    // Create a table in the console for the Events
    console.log('\x1b[36m%s\x1b[0m', 'Registering Events: ---------------------');
    this.registerEvents();
    console.log('\x1b[34m%s\x1b[0m', 'Registering Commands: -------------------');
    this.registerCommands();
    console.log('\x1b[32m%s\x1b[0m', '-----------------------------------------');

    config(); // load .env file
    const TOKEN: string = process.env.TOKEN ?? '';
    if (!TOKEN) {
      console.log('[ERROR] No token provided in .env file.');
      process.exit(1);
    }

    this.login(TOKEN).then(() => {
      this.updateCommands(TOKEN);
    });
  }

  async registerEvents(): Promise<void> {
    ///
    /// Registering the events
    ///
    const eventsPath = join(__dirname, '..', 'events');
    // get root path of script, aka index.ts

    const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

    for (const filePath of eventFiles) {
      const loadedEvent = require(join(eventsPath, filePath));
      const eventFileName = filePath.split('/').pop()?.split('.')[0] ?? '';
      if (!eventFileName) continue;
      console.log('\x1b[36m%s\x1b[0m', `- ${eventFileName}`);

      // register event
      this.on(eventFileName, loadedEvent.default ?? null);
    }
  }

  async registerCommands(): Promise<void> {
    ///
    /// Registering the slash commands
    ///
    const commandsPath = join(__dirname, '..', 'commands');
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));


    for (const filePath of commandFiles) {
      const loadedCommand = require(join(commandsPath, filePath));

      if (!(loadedCommand.data && loadedCommand.execute))
        return console.log(`[WARN] Command ${filePath} is missing ${loadedCommand.data ? 'execute' : 'data'} method.`);

      this.commands.set(loadedCommand.data.name, loadedCommand);
      console.log('\x1b[34m%s\x1b[0m', `- ${loadedCommand.data.name}`);

    }
  }

  async updateCommands(TOKEN: string): Promise<void> {
    const DC_REST = new REST({ version: '9' }).setToken(TOKEN);
    let commandsJSON = this.commands.map(command => command.data.toJSON());
    await DC_REST.put(
      DiscordRoutes.applicationCommands(this?.user?.id ?? ''),
      { body: commandsJSON }
    )
  }
}