import {SlashCommandBuilder, EmbedBuilder, RGBTuple} from '@discordjs/builders';
import {CommandInteraction} from 'discord.js';
// @ts-ignore
import {getCanvas} from '../utils/canvas';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_canvas')
        .setDescription('Gets the canvas for the current guild.'),

    async execute(interaction: CommandInteraction) {
        const canvas = await getCanvas(interaction.guildId);
        const buffer = canvas.getCanvasBuffer();

        const embed = new EmbedBuilder()
            .setTitle('Canvas for current guild:')
            .setImage('attachment://canvas.png')

        return await interaction.reply({embeds: [embed], files: [{name: 'canvas.png', attachment: buffer}]});
    }
}