const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require('discord.js');

class TicketCommand {
    constructor() {
        this.data = new SlashCommandBuilder()
        .setName('ticket')
        .setDescription('Set ticket channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('Channel to set')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('message')
            .setDescription('Message to set in the channel')
            .setRequired(true)
        )
    }

    /**
     * @param {ChatInputCommandInteraction} interaction 
     */
    async execute(interaction) {
        if (interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageChannels)) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral })
            const chnl = interaction.options.getChannel('channel')
            const msg = interaction.options.getString('message')

            const ticket_create = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('Create your ticket')
            .setStyle(ButtonStyle.Success)

            const row = new ActionRowBuilder()
            .addComponents(ticket_create)

            try {
                await chnl.send({ content: `${msg}`, components: [row], });
                await interaction.editReply({ content: `Message sent to ${chnl}`, flags: MessageFlags.Ephemeral });
            } catch (error) {
                console.log(error);
            }

        } else {
            await interaction.reply({ content: 'I do not have permission to execute this command', flags: MessageFlags.Ephemeral })
        }
    }   
}

module.exports = new TicketCommand();