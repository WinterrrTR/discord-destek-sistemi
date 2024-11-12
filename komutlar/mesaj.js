const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require("../config.json");

  module.exports.run = async (client, message, args) => {
    const owner = config.owner;

    if (message.author.id !== owner) {
        return message.react('❌');
      }

    const embed = new EmbedBuilder()
      .setTitle('wtr Destek Sistemi')
      .setDescription('* Yetkililerden yardım almak için aşşağıdaki butonu kullanarak bir destek talebi oluşturabilirsin. \n\n* Çalışma saatlerimiz 06.00 - 00.00')
      .setColor('#2F3136');

    const button = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('talep_ac')
        .setLabel('Destek Talebi Oluştur')
        .setStyle(ButtonStyle.Success)
    );
    await message.delete();
    await message.channel.send({ embeds: [embed], components: [button] });
  }