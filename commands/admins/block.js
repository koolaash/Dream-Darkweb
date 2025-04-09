const discord = require("discord.js"),
    { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require('discord.js'),
    { QuickDB } = require("quick.db"),
    db = new QuickDB();

module.exports = {
    name: "block",
    //  aliases: ["accountc", "acreate"],
    description: "helps you see the last message which got deleted",
    category: "Account",
    usage: "acreate `tag_here`",
    usage: "acreate `tag_here`",
    botPermissions: [PermissionsBitField.Flags.EmbedLinks],
    userPermissions: [],

    async run(client, message, args) {
        if (!message.member.roles.cache.get(client.config.adminrole)) {
            return message.reply("This Command Is For Admins Only!")
        };

        if (!args[0]) {
            return message.reply("You forgot to mention the tag")
        };

        let tag_use = await db.get(args[0]),
            tag_block = await db.get(`block${args[0]}`);

        if (tag_use !== true) {
            return message.reply("This Tag Is Not In Use");
        };
        if (tag_block === true) {
            return message.reply(`This user is alredy blocked`);
        };

        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel("YES")
            .setCustomId("block_success")
            .setDisabled(false),
            button1 = new ButtonBuilder()
                .setStyle(ButtonStyle.Danger)
                .setLabel("NO")
                .setCustomId("block_cancel")
                .setDisabled(false),
            row = new ActionRowBuilder()
                .addComponents(button, button1);

        let msg = await message.reply({ content: `Are you sure you want to block ${args[0]} !`, components: [row] }),
            collector = msg.createMessageComponentCollector({ time: 30000 });

        collector.on("collect", async (button) => {

            if (button.user.id !== message.author.id) {
                return button.reply({ ephemeral: true, content: `This interaction is not fot you!` });
            };

            if (button.customId === "block_success") {

                // database update
                db.set(`block${args[0]}`, true);
                let acc_user = await db.get(`acc_user${args[0]}`);
                let owner = await message.guild.members.fetch(acc_user);
                let log = client.channels.cache.get(client.config.accountlog);
                log.send({
                    embeds: [
                        new discord.EmbedBuilder({
                            description: `Account Blocked ${args[0]} By ${message.author} - \`${message.author.tag}\` which is owned by ${owner} - \`${owner.user.tag}\``,
                            color: client.config.embedColour
                        })
                    ]
                });

                return message.reply({ content: `Account Blocked ${args[0]}` }) &&
                    setTimeout(() => button.message.delete().catch(() => null), 100);
            };

            if (button.customId === 'block_cancel') {
                return button.message.delete() && message.delete();
            };

        });
        collector.on("end", (_, reason) => {
            if (reason !== "messageDelete") {
                button.setDisabled(true);
                button1.setDisabled(true);
                return msg.edit({ content: "**`[Command Timed Out]`**", components: [row] })
                    .then(m => setTimeout(() => m.delete().catch(() => null), 5000));
            };
        });
    }
};
