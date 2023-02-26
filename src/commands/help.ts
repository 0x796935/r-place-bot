import { SlashCommandBuilder, EmbedBuilder, RGBTuple } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { client } from '../index';

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Shows the help menu.'),
  async execute(interaction: CommandInteraction) {
    // List all the commands in an embed

    const embed = new EmbedBuilder()
      .setTitle('Help Menu')
      .setDescription('List of all the commands')
      .setColor([0, 153, 255] as RGBTuple)

    embed.addFields(
      client.commands.map(command => { return { name: command.data.name, value: command.data.description } })
    )


    return interaction.reply({
      embeds: [embed]
    });
  }
}