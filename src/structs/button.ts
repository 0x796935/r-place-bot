import {Interaction} from 'discord.js';

export default class Button {
    data: {
        customId: string;
    }
    execute: (interaction: Interaction) => Promise<void>;
}
