// import message struct from discord.js
import { Message } from 'discord.js';
import { handlePhishingMessage } from '../utils/handlePhishing';

export default async function (message: Message) {
  // Ignore all bots
  if (message.author.bot) return;

  // If the message is a phishing message, handle it
  handlePhishingMessage(message);
}
