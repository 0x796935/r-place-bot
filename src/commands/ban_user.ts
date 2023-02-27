import {SlashCommandBuilder} from "@discordjs/builders";
import {CommandInteraction} from "discord.js";

const {database} = require('../utils/canvas');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban_user')
        .setDescription('OWNER ONLY: Bans a user from using the bot.')
        .addUserOption(option => option.setName('user').setDescription('The user to ban.').setRequired(true)),

    async execute(interaction: CommandInteraction) {
        // @ts-ignore
        const user = interaction.options.getUser('user');
        if (!user)
            return await interaction.reply({
                content: 'You must specify a user to ban.',
                ephemeral: true
            })

        console.log(`Banning user ${user.username}#${user.discriminator} (${user.id})`)
        await database.banUser(user.id)
        await interaction.reply(`Banning user ${user.username}#${user.discriminator} (${user.id})`)
    }
}