import { Collection, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
// Importing clientClass
import ClientClass from './structs/clientClass';

///
/// Creating the client
///
const client = new ClientClass({ // create a new discord client
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
  ],
});



export { client };