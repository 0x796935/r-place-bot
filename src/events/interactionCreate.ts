import {Interaction} from "discord.js";
import {client} from '../index';

export default async function (interaction: Interaction) {
    if (interaction.isCommand()) {
        ///
        /// Slash Commands
        ///
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied) return interaction.fetchReply().then(interaction => interaction.edit({
                content: 'There was an error while executing this command!',
                embeds: []
            }));
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
                embeds: []
            });
        }
    } else if (interaction.isButton()) {
        ///
        /// Buttons
        ///
        const button = client.buttons.get(interaction.customId);
        if (!button) return;
        try {
            if (interaction.message.interaction && (interaction.user.id !== interaction.message.interaction.user.id)) return await interaction.reply({
                content: `<@${interaction.user.id}> You can't interact with a button that isn't yours!`
            })
            await button.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied) return interaction.fetchReply().then(interaction => interaction.edit({
                content: 'There was an error while executing this button!',
                embeds: []
            }));
            await interaction.reply({
                content: 'There was an error while executing this button!',
                ephemeral: true,
                embeds: []
            });
        }
    }
}
