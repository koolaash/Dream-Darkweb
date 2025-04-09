const { WebhookClient, ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle, PermissionsBitField } = require('discord.js'),
    { QuickDB } = require("quick.db"),
    db = new QuickDB();

module.exports = {
    name: "fuck",
    //  aliases: ["accountc", "acreate"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "lock",
    botPermissions: [PermissionsBitField.Flags.EmbedLinks],
    userPermissions: [],

    async run(client, message, args) {

        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        const fucker = new WebhookClient({
            id: '1338249980892418149',
            token: 'MV9M2gZTxVZum3fk4km2uBp8PZKTxLCx9m9S67nqCeJYDUNGbrsouLoTaYdeRey7jOOA'
        })
    },
};