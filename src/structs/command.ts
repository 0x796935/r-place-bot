import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export default class Command {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}