import { ButtonInteraction, EmbedBuilder } from "discord.js";
// @ts-ignore
import { getCanvas } from "../utils/canvas"

module.exports = {
    data: {
        customId: "acceptPixelPlacement"
    },
    async execute (interaction: ButtonInteraction) {
        if (!interaction.message?.interaction) return await interaction.reply({
            content: "You can't accept a pixel placement that isn't yours.",
            ephemeral: true
        })
        if (interaction.user.id !== interaction.message?.interaction.user.id) return await interaction.reply({
            content: "You can't accept a pixel placement that isn't yours.",
            ephemeral: true
        })
        const originalEmbed = interaction.message.embeds[0];

        await interaction.update({
            content: "You accepted the pixel placement.",
            embeds: [],
            components: [],
            attachments: []
        });

        // get pixel placement via originalEmbed.description
        // Set pixel at 2, 2 to brown
        // Regex:
        const regex = /(\d+), (\d+)/;
        if (!originalEmbed.description) return await interaction.followUp({
            content: "Error while parsing pixel placement.",
            ephemeral: true
        })
        const match = regex.exec(originalEmbed.description);

        if (!match) return await interaction.followUp({
            content: "You can't accept a pixel placement that isn't yours.",
            ephemeral: true
        })

        const pixelX = parseInt(match[1]);
        const pixelY = parseInt(match[2]);
        const descSplitArr = originalEmbed.description.split(" ")
        const pixelColor = descSplitArr[descSplitArr.length - 1];

        const canvas = await getCanvas(interaction.guildId);
        const buffer = canvas.fillRectangle(pixelX, pixelY, pixelColor)


        // copy embed via embed builder
        const embed = new EmbedBuilder()
            .setTitle(`Pixel placed by ${interaction.user.username}#${interaction.user.discriminator}!`)
            .setDescription(originalEmbed.description)
            .setImage('attachment://canvas.png')

        return await interaction.followUp({
            content: "",
            embeds: [embed],
            components: [],
            files: [{name: 'canvas.png', attachment: buffer}]
        });
    }
}