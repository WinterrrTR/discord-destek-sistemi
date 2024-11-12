const Discord = require('discord.js');
const { PermissionsBitField, GatewayIntentBits, Partials } = require('discord.js')
const client = new Discord.Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageReactions,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.User,
    ],
})

const fs = require("fs");
const config = require("./config.json");

client.config = config;

fs.readdir("./events", (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        console.log(`Yüklenen eventler: ${eventName} !`)
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.on('ready', () => {
    console.log(`${client.user.tag} aktif!`);
});

client.commands = new Discord.Collection();
fs.readdir("./komutlar/", (_err, files) => {
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        let props = require(`./komutlar/${file}`);
        let commandName = file.split(".")[0];
        client.commands.set(commandName, {
            name: commandName,
            ...props
        });
        console.log(`Yüklenen komut: ${commandName}.`);
    });
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const user = interaction.user.id;
    const guild = interaction.guild;
    const category = config.category;
    const support_staff = config.support_staff;

    if (interaction.customId === 'talep_ac') {
        const existingChannel = guild.channels.cache.find(channel =>
            channel.name === `destek-${interaction.user.username.toLowerCase()}`
        );

        if (existingChannel) {
            await interaction.reply({ content: `Zaten şuanda aktif bir talep kanalınız var: ${existingChannel}`, ephemeral: true });
            return;
        }

        const supportChannel = await guild.channels.create({
            name: `destek-${interaction.user.username}`,
            type: Discord.ChannelType.GuildText,
            parent: category,
            permissionOverwrites: [
                {
                    id: guild.roles.everyone,
                    deny: [PermissionsBitField.Flags.ViewChannel],
                },
                {
                    id: user,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.AttachFiles,
                        PermissionsBitField.Flags.ReadMessageHistory,
                    ],
                },
                {
                    id: support_staff,
                    allow: [
                        PermissionsBitField.Flags.ViewChannel,
                        PermissionsBitField.Flags.SendMessages,
                        PermissionsBitField.Flags.AttachFiles,
                        PermissionsBitField.Flags.ReadMessageHistory,
                    ],
                },
            ],
        });

        const embed = {
            color: 0x2f3136,
            title: 'wtr Destek Sistemi',
            description: '* Merhabalar, talep kanalınız başarıyla oluşturuldu. \n\n * Sorun veya isteklerinizi bu kanala yazabilirsiniz.',
        };

        const closeButton = {
            type: 1,
            components: [
                {
                    type: 2,
                    label: 'Talebi Kapat',
                    style: 4,
                    customId: 'talep_kapat',
                },
            ],
        };
        await supportChannel.send({ embeds: [embed], components: [closeButton] });
        await interaction.reply({ content: `Talep kanalınız oluşturuldu: ${supportChannel}`, ephemeral: true });
    } else if (interaction.customId === 'talep_kapat') {
        const channel = interaction.channel;
        await channel.delete();
    }
});

client.login(config.token);