import { Interaction } from "discord.js";
import { client } from '../index';

export default async function (interaction: Interaction) {

  if (!interaction.isCommand()) return;
  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if(interaction.replied) return interaction.fetchReply().then(interaction => interaction.edit({content: 'There was an error while executing this command!', embeds: []}));
    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true, embeds: [] });
  }
}
