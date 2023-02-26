// import message struct from discord.js
import { Message } from 'discord.js';

export default async function (message: Message) {
  // Ignore all bots
  if (message.author.bot) return;

  // If the message is a phishing message, handle it
  console.log(`${message.author.username}#${message.author.discriminator} ${message.content}`);
}
