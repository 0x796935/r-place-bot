import { ButtonInteraction, ButtonStyle } from "discord.js";

module.exports = {
    data: {
        customId: "denyPixelPlacement"
    },
    async execute (interaction: ButtonInteraction) {
        // get interaction button message
        return await interaction.update({
            content: "You denied the pixel placement.",
            embeds: [],
            components: [],
            attachments: []
        });
    }
}