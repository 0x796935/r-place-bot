import {SlashCommandBuilder, EmbedBuilder, RGBTuple} from '@discordjs/builders';
import {CommandInteraction} from 'discord.js';
// @ts-ignore
import { getCanvas } from '../utils/canvas';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get_gif')
        .setDescription('Gets the animation for the canvas of the current guild.'),

    async execute(interaction: CommandInteraction) {
        await interaction.reply('Getting canvas animation...')

        const canvas = await getCanvas(interaction.guildId);
        const buffer = await canvas.getCanvasAnimationBuffer();

        const embed = new EmbedBuilder()
            .setTitle('Canvas for current guild:')
            .setImage('attachment://canvas.gif')

        const interactionReply = await interaction.fetchReply()
        return await interactionReply.edit({
                embeds: [embed],
                files: [
                    {
                        name: 'canvas.gif',
                        attachment: buffer
                    }
                    ]
            })
    }
}