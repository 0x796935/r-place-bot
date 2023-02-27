import {CommandInteraction, Interaction} from "discord.js";
import {client} from '../index';

const {database} = require('../utils/canvas');

export default async function (interaction: Interaction) {
    try {
        if (interaction.isCommand()) {
            ///
            /// Slash Commands
            ///
            // @ts-ignore
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
            // Check if user is banned from using the bot
            const isBanned = await database.isUserBanned(interaction.user.id)
            if (isBanned) {
                return await interaction.update({
                    content: `<@${interaction.user.id}> You are banned from placing pixels with this bot!`,
                    embeds: [],
                    components: [],
                    files: []
                });
            }


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
    } catch (error) {
        console.error(error);
        try {
            // @ts-ignore
            await interaction.reply({
                content: 'There was an error while executing this command!',
                ephemeral: true,
                embeds: []
            });
        } catch (e) {
            console.log(e);
        }
    }
}
