const Discord = require('discord.js');
const client = new Discord.Client();
const canvas = require('canvas');
const jimp = require('jimp');
const prefix = '#';
const axios = require('axios');
const fs = require('fs');
const ms = require('ms');
const path = require('path');
const moment = require('moment');
const yt = require('ytdl-core');
const request = require('request');
const devs = ['202745501345382400', '461766920400535552', '202745501345382400', '461766920400535552', '202745501345382400', '202745501345382400'];

var cooldownGames = new Set();
var cooldownSurvival = new Set();
var cooldownSetName = new Set();

let queue = [];
let songsQueue = [];
let isPlaying = false;
let dispatcher = null;
let voiceChannel = null;
let skipRequest = 0;
let skippers = [];
let ytResultList = [];
let ytResultAdd = [];
let re = /^(?:[1-5]|0[1-5]|10)$/;
let regVol = /^(?:([1][0-9][0-9])|200|([1-9][0-9])|([0-9]))$/;
let youtubeSearched = false;
let selectUser;

client.on('ready', () => {
// عند بدء البوت راح يرسل السي ام دي هذي الرسايل
  console.log('')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log(`[Start] ${new Date()}`)
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('╔[═════════════════]╗')
  console.log(' Bot Is Online')
  console.log('╔[═════════════════]╗')
  console.log('')
  console.log(`╔[ Logged in as * [ " ${client.user.username} " ] ]?`);
  console.log('')
  console.log('=[ Informations :]╗')
  console.log('')
  console.log(`╔[ Servers [ " ${client.guilds.size} " ]╗`);
  console.log(`╔[ Users [ " ${client.users.size} " ]╗`);
  console.log(`╔[ Channels [ " ${client.channels.size} " ]╗`);
  console.log('╔[═════════════════════════════════════════════════════════════════]╗')
  console.log('')
  console.log('')
  console.log('')
  client.user.setActivity('#help')
});

client.on('message', message => {
	var args = message.content.split(' ');
	var args1 = message.content.split(' ').slice(1).join(' ');
	var args2 = message.content.split(' ')[2];
	var args3 = message.content.split(' ').slice(3).join(' ');
	var command = message.content.toLowerCase().split(" ")[0];
	var games = JSON.parse(fs.readFileSync('./games/games.json', 'utf8'));
	var muf = message.mentions.users.first();
	
	if(message.author.bot) return;
	if(message.channel.type === 'dm') return;
	
// كود تغيير الاسم والافتار وحالة اللعب
	if(command == prefix + 'setname') {
		let timecooldown = '1hour';
		if(!devs.includes(message.author.id)) return;
		if(cooldownSetName.has(message.author.id)) return message.reply(`**${ms(ms(timecooldown))}** يجب عليك الانتظار`);
		if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setname \`\`GaintBot\`\``).then(msg => msg.delete(7000));
		if(args1 == client.user.username) return message.reply('**البوت مسمى من قبل بهذا الاسم**').then(msg => msg.delete(5000));
		
		cooldownSetName.add(message.author.id);
		client.user.setUsername(args1);
		message.reply(`\`\`${args1}\`\` **تم تغيير اسم البوت الى**`);
		
		setTimeout(function() {
			cooldownSetName.delete(message.author.id);
		}, ms(timecooldown));
	}
		if(command == prefix + 'setavatar') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setavatar \`\`Link\`\``).then(msg => msg.delete(7000));
			
			client.user.setAvatar(args1).catch(err => console.log(err)).then
			return message.reply('**حاول مرة اخرى في وقت لاحق**').then(msg => msg.delete(5000));
			
			let avatarbot = new Discord.RichEmbed()
			.setTitle(`:white_check_mark: **تم تغيير صورة البوت الى**`)
			.setImage(args1)
			.setTimestamp()
			.setFooter(`by: ${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
			message.channel.send(avatarbot).then(msg => msg.delete(7000));
			message.delete();
		}
		if(command == prefix + 'setplay') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setplay \`\`www.Gaint-Plus.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1);
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة اللعب الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setwatch') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setwatch \`\`www.Gaint-Plus.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'WATCHING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة المشاهدة الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
		if(command == prefix + 'setlisten') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setlisten \`\`www.Gaint-Plus.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, { type: 'LISTENING' });
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة السماع الى**`).then(msg => msg.delete(5000));
			message.delete();
		};
	    if(command == prefix + 'setstream') {
			if(!devs.includes(message.author.id)) return;
			if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}setstream \`\`www.Gaint-Plus.com\`\``).then(msg => msg.delete(7000));
			client.user.setActivity(args1, 'https://www.twitch.tv/xiaboodz_');
			message.reply(`\`\`${args1}\`\` **تم تغيير حالة البث الى**`).then(msg => msg.delete(5000));
			message.delete();
		};



// كود الوارن
    let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));
    if(command == prefix + 'warn') {
    if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('\`\`MANAGE_MESSAGES\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(5000));
    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    if(!wUser) return message.channel.send(`** ↝ Useage:** ${prefix}warn \`\`@Name\`\` reason`).then(msg => msg.delete(5000));
    if(wUser.id === message.author.id) return message.reply('**لا يمكنك اعطاء نفسك وارن**').then(msg => msg.delete(5000));
    if(wUser.hasPermission('ADMINISTRATOR')) return message.reply('**لا يمكنني اعطاء هذا الشخص وارن لانه اداري**').then(msg => msg.delete(5000));
    if (!message.guild.member(wUser).kickable) return message.reply('**لا يمكنني اعطاء هذا الشخص وارن لان رتبته فوق رتبتي**').then(msg => msg.delete(5000));
    let reason = args.slice(2).join(" ");
    if(!reason) return message.channel.send(`** ↝ Useage:** ${prefix}warn @name \`\`Reason\`\``).then(msg => msg.delete(7000));
	let muterole = message.guild.roles.find('name', 'PlayerMuted') || message.guild.roles.get(r => r.name === 'PlayerMuted');
    if(!muterole) try {
		message.guild.createRole({
			name: "PlayerMuted",
			permissions: 0
			}).then(r => {
				message.guild.channels.forEach(c => {
					c.overwritePermissions(r , {
						SEND_MESSAGES: false,
						READ_MESSAGE_HISTORY: false,
						ADD_REACTIONS: false,
						SPEAK: false
						});
				});
			});
			} catch(e) {
				console.log(e.stack);
			}

  if(!warns[wUser.id]) warns[wUser.id] = {
    warns: 0
  };

  warns[wUser.id].warns++;


  fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
    if (err) console.log(err)
  });

  wUser.send(`**◄══════════► [ Gaint-Plus ] ◄══════════►**\n\n\n** ↝ لقد اخذت وارن**\n\n** ↝ في سيرفر:**\n ↝ [ ${message.guild.name} ]\n\n** ↝ بواسطة:**\n ↝ [ ${message.author.username}#${message.author.discriminator} ]\n\n** ↝ السبب:**\n ↝ [ ${reason} ]\n\n** ↝ الوارن رقم:**\n ↝[ ${warns[wUser.id].warns} ]\n\n\n**◄══════════► [ Gaint-Plus ] ◄══════════►**`);

  let warnEmbed = new Discord.RichEmbed()
  .setTitle(':no_entry_sign: **[WARN]**')
  .setThumbnail(client.user.avatarURL)
  .setColor('#36393e')
  .addField('User:', `<@${wUser.id}>`, true)
  .addField('By:', `<@${message.author.id}>`, true)
  .addField('Reason:', `** ↝** [ **${reason}** ]`, true)
  .addField('Warn Number:', `** ↝** [ **${warns[wUser.id].warns}** ]`, true)
  .setTimestamp()
  .setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)

  let warnchannel = message.guild.channels.find(`name`, "Gaintbot-log");
  if(!warnchannel) return;

  warnchannel.send(warnEmbed);

  if(warns[wUser.id].warns == 1){
	  message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason}`);
	  message.delete();
  }

if(warns[wUser.id].warns == 2){
	let mutetime1 = "1h";
    wUser.addRole(muterole);
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();
	wUser.setMute(true);

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime1))
  }
    if(warns[wUser.id].warns == 3){
    let mutetime2 = "6h";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime2))
  }
    if(warns[wUser.id].warns == 4){
    let mutetime3 = "12h";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime3))
  }
    if(warns[wUser.id].warns == 5){
    let mutetime4 = "1d";
    wUser.addRole(muterole.id);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole);
	  wUser.setMute(false);
    }, ms(mutetime4))
  }
      if(warns[wUser.id].warns == 6){
    let mutetime5 = "3d";
    wUser.addRole(muterole);
	wUser.setMute(true);
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :zipper_mouth:`);
	message.delete();

    setTimeout(function(){
      wUser.removeRole(muterole.id);
	  wUser.setMute(false);
    }, ms(mutetime5))
  }
    if(warns[wUser.id].warns == 7){
    message.guild.member(wUser).ban({ days: 1, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
    if(warns[wUser.id].warns == 8){
    message.guild.member(wUser).ban({ days: 3, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
    if(warns[wUser.id].warns == 9){
    message.guild.member(wUser).ban({ days: 7, reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
  if(warns[wUser.id].warns == 10){

      message.guild.member(wUser).ban({ reason: reason });
	message.channel.send(`<@${wUser.id}>, \`\`الوارن رقم ${warns[wUser.id].warns}\`\` ${reason} :airplane:`);
	message.delete();
  }
}
    if(command == prefix + 'warns') {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('\`\`MANAGE_MESSAGES\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(5000));
		let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
		if(!wUser) return message.channel.send(`** ↝ Useage:** ${prefix}warns \`\`Name\`\``).then(msg => msg.delete(7000));
		if(wUser.hasPermission('ADMINISTRATOR')) return message.reply('**摇 ȡՎՠȏȑ�').then(msg => msg.delete(3000));
		 if(!warns[wUser.id]) warns[wUser.id] = {
            warns: 0
        };
		let warninfo1 = new Discord.RichEmbed()
		.setTitle(':no_entry_sign: **[WARN AMOUNT]**')
		.setThumbnail(client.user.avatarURL)
		.addField('User:', `<@${muf.id}>`, true)
		.addField('Warn Number:', `** ↝** [ ${warns[wUser.id].warns} ]`, true)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
		message.channel.send(warninfo1);
		message.delete();
	};



// كود صددام
	if(command == prefix + '9dAmm') {
		var For9dAmm = ['325165115131428864'];
		if(command === '9dAmm') return;
		if(!For9dAmm.includes(message.author.id)) return message.reply('**! هذا الامر لجنرالل صددام فقط**').then(msg => msg.delete(3000));
	let e9dAmm = new Discord.RichEmbed()
	.setTitle(`:open_file_folder: [**${message.author.username}#${message.author.discriminator}**] معلومات عن`)
	.setThumbnail(message.author.avatarURL)
	.setColor('#fdf600')
	.addField(':crown: **الاسم:**', '** ↝** !جنرالل صددام', true)
	.addField(':crown: **العمر:**', '** ↝** 20', true)
	.addField(':crown: **الرتبة:**', '** ↝** Co-Owner', true)
	.addField(':crown: **الاسم بالدسكورد:**', `<@${message.author.id}>`, true)
	.addField(':crown: **تاريخ انشاء الحساب:**', `** ↝** ${message.author.createdAt.toLocaleString()}`, true)
	.addField(':crown: **الايدي:**', `${message.author.id}`, true)
	.addField(':crown: **التاق:**', `** ↝** #${message.author.discriminator}`, true)
	.addField(':crown: **تاريخ الدخول الى السيرفر:**', `** ↝** ${message.member.joinedAt.toLocaleString()}`, true)
	.setTimestamp()
	.setFooter(`[ 9dAmm ] Is Here.`, message.author.avatarURL)
	message.channel.send(e9dAmm)
	};



// كود البنق
	if(command == prefix + 'ping') {
		if(message.author.bot) return;
		var api = `${Math.round(client.ping)}`
		let ping = new Discord.RichEmbed()
		.setDescription(`**Ping:** \`\`${client.pings[0]}ms\`\`\n**Time Taken:** \`\`${Date.now() - message.createdTimestamp}ms\`\`\n**Websocket:** \`\`${api}ms\`\``);
		message.channel.send('**Pong!**').then(m => m.edit(ping));
	};



// كود الهلب
    if(command == prefix + 'Games') {
		message.channel.send(`
◄════════════► [ Gaint-Plus ] ◄════════════►

:joystick: **اوامر الالعاب**

⫸【1】 ${prefix}لغز

⫸【2】 ${prefix}فكك

⫸【3】 ${prefix}اسرع-كتابة

⫸【4】 ${prefix}ايموجي

⫸【5】 ${prefix}علم

⫸【6】 ${prefix}

◄════════════► [ Gaint-Plus ] ◄════════════►
`);
	};
    if (command == prefix + 'help-member') {
		message.author.send(`
**◄════════════► [ Gaint-Plus ] ◄════════════►**

:dividers: **الاوامر العامة**

⫸【1】 \`\`${prefix}sug <Your Sug>\`\` 『لارسال اقتراحك الى روم الاقتراحات』

⫸【2】 \`\`${prefix}survival\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

⫸【3】 \`\`${prefix}find <someone>\`\` 『للبحث عن الاعضاء الذين يوجد في اسمائهم الحروف التي كتبتها』

⫸【4】 \`\`${prefix}discrim\`\` **OR** \`\`${prefix}disscrim 9999\`\` <- (_example_) 『للبحث عن الاعضاء الذين لديهم التاق حقك 』

⫸【5】 \`\`${prefix}id\`\` **OR** \`\`${prefix}id <mention>\`\` 『لرؤية جميع المعلومات عنك وعن الاخرين』

⫸【6】 \`\`${prefix}voice-online\`\` 『لرؤية اسماء المتواجدين بالصوت』

⫸【7】 \`\`${prefix}myid\`\` 『لرؤية الايدي الخاص بحسابك』

⫸【8】 \`\`${prefix}avatar\`\` **OR** \`\`${prefix}avatar <mention>\`\` 『لرؤية صورة البروفايل حقك او حق الاخرين』

⫸【9】 \`\`${prefix}ping\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

:joystick: **اوامر الالعاب**

⫸【1】 \`\`${prefix}لغز\`\`

⫸【2】 \`\`${prefix}فكك\`\`

⫸【3】 \`\`${prefix}اسرع-كتابة\`\`

⫸【4】 \`\`${prefix}ايموجي\`\`

⫸【5】 \`\`${prefix}علم\`\`

⫸【6】 \`\`${prefix}رياضيات\`\`

⫸【7】 \`\`${prefix}points\`\` **OR** \`\`${prefix}points <mention>\`\` 『لرؤية نقاطك او نقاط اشخاص اخرين باللعبه』

**◄════════════► [ Gaint-Plus ] ◄════════════►**`).catch(err =>{console.log('[LOG] =>' + err);
message.reply('**عندك اعدادات الخصوصيه لا يمكنني ان ارسل الى الخاص حقك**').then(msg => msg.delete(5000));
});

		message.reply('**شوف الخاص :envelope_with_arrow:**').then(msg => msg.delete(3000));
		message.delete();
	};
    if (command == prefix + 'help-staff') {
		if(!message.member.hasPermission('MUTE_MEMBERS')) return;
		message.author.send(`
**◄════════════► [ Gaint-Plus ] ◄════════════►**

:dividers: **الاوامر العامة**

⫸【1】 \`\`${prefix}sug <Your Sug>\`\` 『لارسال اقتراحك الى روم الاقتراحات』

⫸【2】 \`\`${prefix}survival\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

⫸【3】 \`\`${prefix}find <someone>\`\` 『للبحث عن الاعضاء الذين يوجد في اسمائهم الحروف التي كتبتها』

⫸【4】 \`\`${prefix}discrim\`\` **OR** \`\`${prefix}disscrim 9999\`\` <- (_example_) 『للبحث عن الاعضاء الذين لديهم التاق حقك 』

⫸【5】 \`\`${prefix}id\`\` **OR** \`\`${prefix}id <mention>\`\` 『لرؤية جميع المعلومات عنك وعن الاخرين』

【6】 \`\`${prefix}voice-online\`\` 『لرؤية اسماء المتواجدين بالصوت』

⫸【7】 \`\`${prefix}myid\`\` 『لرؤية الايدي الخاص بحسابك』

⫸【8】 \`\`${prefix}avatar\`\` **OR** \`\`${prefix}avatar <mention>\`\` 『لرؤية صورة البروفايل حقك او حق الاخرين』

⫸【9】 \`\`${prefix}ping\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

:joystick: **اوامر الالعاب**

⫸【1】 \`\`${prefix}لغز\`\`

⫸【2】 \`\`${prefix}فكك\`\`

⫸【3】 \`\`${prefix}اسرع-كتابة\`\`

⫸【4】 \`\`${prefix}ايموجي\`\`

⫸【5】 \`\`${prefix}علم\`\`

⫸【6】 \`\`${prefix}رياضيات\`\`

⫸【7】 \`\`${prefix}points\`\` **OR** \`\`${prefix}points <mention>\`\` 『لرؤية نقاطك او نقاط اشخاص اخرين باللعبه』

:name_badge: **اوامر الستاف**

⫸【1】 \`\`${prefix}warn <mention> <reason>\`\` 『لاعطاء شخص تحذير』

⫸【2】 \`\`${prefix}warns <mention>\`\` 『لمعرفة عدد التحذيرات لدى الشخص』

⫸【3】 \`\`${prefix}say <somewords>\`\` 『لجعل البوت يتكلم عنك』

⫸【4】 \`\`${prefix}clear <number>\`\` 『لمسح الشات بعدد』

**◄════════════► [ Gaint-Plus ] ◄════════════►**`);
		message.reply('**شوف الخاص :envelope_with_arrow:**').then(msg => msg.delete(3000));
		message.delete();
	};
    if(command == prefix + 'help-admin') {
		if(!message.member.hasPermission('ADMINISTRATOR')) return;
		message.author.send(`
**◄════════════► [ Gaint-Plus ] ◄════════════►**

:dividers: **الاوامر العامة**

⫸【1】 \`\`${prefix}sug <Your Sug>\`\` 『لارسال اقتراحك الى روم الاقتراحات』

⫸【2】 \`\`${prefix}survival\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

⫸【3】 \`\`${prefix}find <someone>\`\` 『للبحث عن الاعضاء الذين يوجد في اسمائهم الحروف التي كتبتها』

⫸【4】 \`\`${prefix}discrim\`\` **OR** \`\`${prefix}disscrim 9999\`\` <- (_example_) 『للبحث عن الاعضاء الذين لديهم التاق حقك 』

⫸【5】 \`\`${prefix}id\`\` **OR** \`\`${prefix}id <mention>\`\` 『لرؤية جميع المعلومات عنك وعن الاخرين』

【6】 \`\`${prefix}voice-online\`\` 『لرؤية اسماء المتواجدين بالصوت』

⫸【7】 \`\`${prefix}myid\`\` 『لرؤية الايدي الخاص بحسابك』

⫸【8】 \`\`${prefix}avatar\`\` **OR** \`\`${prefix}avatar <mention>\`\` 『لرؤية صورة البروفايل حقك او حق الاخرين』

⫸【9】 \`\`${prefix}ping\`\` 『لمعرفة شروط السرفايفل وكيفية الدخول』

:joystick: **اوامر الالعاب**

⫸【1】 \`\`${prefix}لغز\`\`

⫸【2】 \`\`${prefix}فكك\`\`

⫸【3】 \`\`${prefix}اسرع-كتابة\`\`

⫸【4】 \`\`${prefix}ايموجي\`\`

⫸【5】 \`\`${prefix}علم\`\`

⫸【6】 \`\`${prefix}رياضيات\`\`

⫸【7】 \`\`${prefix}points\`\` **OR** \`\`${prefix}points <mention>\`\` 『لرؤية نقاطك او نقاط اشخاص اخرين باللعبه』

:name_badge: **اوامر الستاف**

⫸【1】 \`\`${prefix}warn <mention> <reason>\`\` 『لاعطاء شخص تحذير』

⫸【2】 \`\`${prefix}warns <mention>\`\` 『لمعرفة عدد التحذيرات لدى الشخص』

⫸【3】 \`\`${prefix}say <somewords>\`\` 『لجعل البوت يتكلم عنك』

⫸【4】 \`\`${prefix}clear <number>\`\` 『لمسح الشات بعدد』

:crown: **الاوامر الادارية**

⫸【1】 \`\`${prefix}server\`\` 『لرؤية جميع المعلومات عن السيرفر』

⫸【2】 \`\`${prefix}bot\`\` 『لرؤية جميع المعلومات عن البوت』

⫸【3】 \`\`${prefix}warn-staff <mention> <reason>\`\` 『لاعطاء ستاف تحذير』

⫸【4】 \`\`${prefix}warns-staff <mention>\`\` 『لمعرفة عدد التحذيرات لدى الستاف』

⫸【5】 \`\`${prefix}setname <new name>\`\` 『لتغيير اسم البوت』

⫸【6】 \`\`${prefix}setavatar <link>\`\` 『لتغيير صورة البوت』

⫸【7】 \`\`${prefix}setplay <playing>\`\` 『لتغيير حالة لعب البوت』

⫸【8】 \`\`${prefix}setlisten <listening>\`\` 『لتغيير حالة سمع البوت』

⫸【9】 \`\`${prefix}setwatch <watching>\`\` 『لتغيير حالة مشاهدة البوت』

⫸【10】 \`\`${prefix}setstream <streaming>\`\` 『لتغيير حالة بث البوت』

⫸【11】 \`\`${prefix}bc <bc words>\`\` 『لارسال رسالة الى جميع اعضاء السيرفر』

**◄════════════► [ Gaint-Plus ] ◄════════════►**`);
		message.reply('**شوف الخاص :envelope_with_arrow:**').then(msg => msg.delete(3000));
		message.delete();
	};



// كود معلومات عن البوت
    if (command == prefix + 'bot') {
		if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('\`\`ADMINISTRATOR\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(3000));;
    message.channel.send({
        embed: new Discord.RichEmbed()
            .setTitle(`:page_with_curl: [**__${client.user.username}#${client.user.discriminator}__**] **معلومات عن بوت**`)
            .setThumbnail(client.user.avatarURL)
            .setColor('#36393e')
            .addField(':white_check_mark: **__البنق__**', `** ↝** [ **${client.pings[0]}ms** ]`, true)
            .addField(':white_check_mark: **__الذاكرة المستخدمة__**', `** ↝** [ **${(process.memoryUsage().rss / 1048576).toFixed()}MB** ]`, true)
			.addField(':white_check_mark: **__مطور البوت__**', `** ↝** [ <@${client.users.get('346629187504832513').id}> ]`, true)
			.addField(':white_check_mark: **__تم انشاء البوت في__**', `** ↝** [ ${moment(client.user.createdAt).format('LLL')} ]`, true)
            .addField(':white_check_mark: **__عدد السيرفرات__**', `** ↝** [ **${client.guilds.size}** ]`, true)
            .addField(':white_check_mark: **__عدد الرومات__**', `** ↝** [ **${client.channels.size}** ]` , true)
            .addField(':white_check_mark: **__عدد الاعضاء__**',`** ↝** [ **${client.users.size}** ]` , true)
            .addField(':white_check_mark: **__تاق البوت__**', `** ↝** [ #**${client.user.discriminator}** ]` , true)
			.addField(':white_check_mark: **__البرفكس__**', `** ↝** [ **${prefix}** ]`, true)
            .addField(':white_check_mark: **__ايدي البوت__**', `**${client.user.id}**` , true)
            .setFooter(`This Bot was Developed For [${message.guild.name}]`, client.user.avatarURL)
			.setTimestamp()
    })
};



// كود معلومات السيرفر
	if(command == prefix + 'server') {
    let botCount = message.guild.members.filter(m=>m.user.bot).size
  	let memberCount = [message.guild.memberCount] - [botCount]
		if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('\`\`ADMINISTRATOR\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(3000));
    message.guild.fetchBans().then(bans => {
      var bansSize = bans.size;
      var server = new Discord.RichEmbed()
      .setTitle(`:books: [ **__${message.guild.name}__** ] **معلومات عن سيرفر**`)
      .addField(`:crown: **__Server Owner__**`, `** ↝** [ ${message.guild.owner} ]`, true)
      .addField(`:id: **__Server ID__**`, `**${message.guild.id}**`, true)
      .addField(`:satellite: **__Server Type__**`, `** ↝** [ **${message.guild.region}** ]`, true)
      .addField(`:date: **__Server Created At__**`, `** ↝** [ **${moment(message.guild.createdAt).format("LL")}** ]`, true)
      .addField(`:first_place: **__Roles Amount__**`, `** ↝** [ **${message.guild.roles.size}** ]`, true)
      .addField(`:name_badge: **__Bans Amount__**`, `** ↝** [ **${bansSize}** ]`, true)
      .addField(`:bar_chart: **__Channels Amount__**`, `** ↝** [ **${message.guild.channels.size}** ]`, true)
      .addField(`:pencil: **__Categores Amount__**`, `** ↝** [ **${message.guild.channels.filter(m=>m.type == 'category').size}** ]`, true)
      .addField(`:pencil: **__Channels Text Amount__**`, `** ↝** [ **${message.guild.channels.filter(m=>m.type == 'text').size}** ]`, true)
      .addField(`:microphone2: **__Channels Voice Amount__**`, `** ↝** [ **${message.guild.channels.filter(m=>m.type == 'voice').size}** ]`, true)
	  .addField(`:zzz: **__AFK Channel__**`, `** ↝** [ **${message.guild.afkChannel || 'لا يوجد'}** ]`, true)
      .addField(`:robot: **__Bots Count__**`, `** ↝** [ **${botCount}** ]`, true)
      .addField(`:busts_in_silhouette: **__Members Count__**`, `** ↝** [ **${memberCount}** ]`, true)
	  .addField(`:green_heart: **__Online Members__**`, `** ↝** [ **${message.guild.members.filter(m=>m.presence.status == 'online').size}** ]`, true)
	  .addField(`:yellow_heart: **__Idle Members__**`, `** ↝** [ **${message.guild.members.filter(m=>m.presence.status == 'idle').size}** ]`, true)
	  .addField(`:red_circle: **__Dnd Members__**`, `** ↝** [**${message.guild.members.filter(m=>m.presence.status == 'dnd').size}** ]`, true)
	  .addField(`:black_circle: **__Offline Members__**`, `** ↝** [ **${message.guild.members.filter(m=>m.presence.status == 'offline').size}** ]`, true)
	  .addField(`:bust_in_silhouette: **__Last Member__**`, `** ↝** [ ${Array.from(message.channel.guild.members.values()).sort((a, b) => b.joinedAt - a.joinedAt).map(m => `<@!${m.id}>`).splice(0, 1)} ]`, true)
	  .setFooter(`This Bot was Developed For [${message.guild.name}]`, client.user.avatarURL)
	  .setTimestamp()
	  .setColor('#36393e')
	  .setThumbnail(client.user.avatarURL)
	  message.channel.send(server)
     })
    };



// كود الايدي
	var year = message.author.createdAt.getFullYear()
	var month = message.author.createdAt.getMonth()
	var day = message.author.createdAt.getDate()
	if(command == prefix + 'id') {
		if (args1 == '') {
			var z = message.author;
			var accountCreatedAt = ['** ↝** [ **' + moment(z.createdAt).format('D/M/YYYY h:mm a') + '** ]\n ↝ [ \`\`' + moment(z.createdAt).fromNow() + '\`\` ]']
			}else {
				var z = message.mentions.users.first();
				var accountCreatedAt = ['** ↝** [ **' + moment(z.createdAt).format('D/M/YYYY h:mm a') + '** ]\n ↝ [ \`\`' + moment(z.createdAt).fromNow() + '\`\` ]']
			}
			let d = z.createdAt;
			let n = d.toLocaleString();
			let x;
			let y;
			if (z.presence.game !== null) {
				y = `${z.presence.game.name}`;
				} else {
					y = ":zzz:";
				}
				if (z.bot) {
					var w = 'Bot';
					}else {
						var w = 'Member';
					}
					let idPlayer = new Discord.RichEmbed()
					.setColor('#36393e')
					.addField(':bust_in_silhouette: **__الاسم:__**', `** ↝** [ <@${z.id}> ]`, true)
					.addField(':id: **__الايدي:__**', `**${z.id}**`, true)
					.addField(':video_game: **__يلعب:__**', `** ↝** [ ${y} ]`, true)
					.addField(':red_circle: **__الحالة:__**', `** ↝** [ **${z.presence.status}** ]`, true)
					.addField(':robot: **__نوع الحساب:__**', `** ↝** [ **${w}** ]`, true)
					.addField(':hash: **__التاق حق الحساب:__**', `** ↝** [ **#${z.discriminator}** ]`,true)
					.addField(':calendar_spiral: **__تاريخ دخول الدسكورد:__**', `${accountCreatedAt}`, true)
					.addField(':spy: **__النك نيم:__**', `** ↝** [ **${z.nickname || 'لا يوجد'}** ]`, true)
					.setThumbnail(`${z.avatarURL}`)
					.setFooter(`This Bot was Developed For [ ${message.guild.name} ] .`, client.user.avatarURL)
					.setTimestamp()
					message.channel.send(idPlayer);
					if (!message) return message.reply('**لم اجد الشخص المطلوب**');
	};



// كود الساي
	if(command == prefix + 'say') {
		if(!message.member.hasPermission('MANAGE_MESSAGES')) return message.reply('\`\`MANAGE_MESSAGES\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(3000));
		if(!args1) return;
	var say = new Discord.RichEmbed()
	.setDescription(`**${args1}**`)
	.setColor('#36393e')
	message.channel.send(say);
	message.delete();
	};



// كود السرفايفل
	if(command == prefix + 'survival') {
		if(args1) return;
		message.author.send(':no_entry: **قوانين دخول سيرفر السرفايفل** :no_entry: \n\n**- 1 ?** ۏ㡇ԊϏȣ ȡ戟 Ȧ 䧏Ȋ ȡܔ 䌡 ȟԑȭ \n**- 2 ?** ۏ㡇┈ 爡Պ㡜n**- 3 ?** ۏ㡇⋎ҭȠۡ졇√ׇ`\n\n**Version ?** 1.13 \n**࠭ޭɠȡЎ硠ȡ졓Ѡȡԑއ** \n**ˑ獠ȡ졑磠ȡȦȣѠ狟ˈ** \n*survival join ȓ䟠ɣȭ堑ȝʠ\n**狤˙Ѡȡҏ** \n\n**ȐǠˣ ҝן 䤤皠˓筪* \n*survival join \n**䒥 ̇宥 爡ǠԊĎР爑䪪')
		message.reply('**شوف الخاص :envelope_with_arrow:**').then(msg => msg.delete(5000))
		message.delete();
	};
	if(command == prefix + 'survival-dc') {
		if(message.author.id !== '282350776456839169') return message.reply('**هذا الامر فقط لاونر سيرفر السرفايفل**');
		if(!muf) return message.reply('**منشن الشخص**');
		if(!cooldownSurvival.has(muf.id)) return message.channel.send(`<@${muf.id}> Is not found in **Cooldown.**`);
		
		cooldownSurvival.delete(muf.id);
		message.reply(`Successfully remove <@${muf.id}> from **Cooldown**`);
	}



// كود الافاتار
    if(command == prefix + 'avatar') {
		var msg1;
		if(muf) {
			var msg1 = muf;
			}else {
				var msg1 = message.author;
			}
			
			var avatarImage = new Discord.RichEmbed()
			.setColor('#36393e')
			.setTitle(`:white_check_mark: <@${msg1.id}>'s **Avatar:**`)
			.setImage(`${msg1.avatarURL}`)
			.setTimestamp()
			.setFooter(msg1.tag, msg1.avatarURL)
			
			message.channel.send(avatarImage);
	};



// كود مسح الشات
    if(command == prefix + 'clear') {
		if(message.author.bot) return;
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply('\`\`MANAGE_MESSAGES\`\` **انت لا تمتلك صلاحية**').then(msg => msg.delete(5000));
		if(args1 > 100) return message.reply('**الرجاء اختيار رقم من 2 الى 100**').then(msg => msg.delete(3000));
		if(args1 < 2) return message.reply('**الرجاء اختيار رقم من 2 الى 100**').then(msg => msg.delete(3000));
		if(isNaN(args1)) return message.reply('**الرجاء اختيار رقم من 2 الى 100**').then(msg => msg.delete(3000));

		message.channel.bulkDelete(args1);
        message.reply(`**( ${args1} ) عدد الرسائل التي تم مسحها**`).then(m => m.delete(3000));
	};



// كود البحث عن الاعضاء
  if(command == prefix + 'find') {
    let size = 1;
    if(message.author.bot) return;
	if(!message.guild.member) return;
    if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}find (اي حرف من الاسم الي تبيه)`);

      var playersFind = new Discord.RichEmbed()
      .setTitle(`:white_check_mark: **كود البحث عن الاعضاء بواسطة الاسم**`)
      .setThumbnail(client.user.avatarURL)
      .setDescription(`**\n ↝ البحث عن الاعضاء الموجود بداخل اسمائهم:**\n " ${args1} "\n\n** ↝ عدد الاعضاء:**\n " ${message.guild.members.filter(m=>m.user.username.toUpperCase().includes(args1.toUpperCase())).size} "\n\n\`\`\`════════════════════════════════════════════════════════════════════════════════════════\n\n${message.guild.members.filter(m=>m.user.username.toUpperCase().includes(args1.toUpperCase())).map(m=>size++ + '. ' + m.user.tag).slice(0,20).join('\n') || 'لا يوجد اعضاء بهذه الاحرف'}\n\n════════════════════════════════════════════════════════════════════════════════════════\`\`\``)
      .setColor('#36393e')
      .setTimestamp()
      .setFooter(message.author.tag, message.author.avatarURL)

      message.channel.send(playersFind);
      message.delete();
  };
// كود الدسكريم
  if(command == prefix + 'discrim') {
    let size = 1;
    if(message.author.bot) return;
	if(!message.guild.member) return;
	
	if(args1 == '') {
		var tagPlayer = message.author.discriminator;
	}else {
		var tagPlayer = args1;
		if(isNaN(args1)) return message.channel.send(`** ↝ Useage:** ${prefix}discrim Or ${prefix}discrim 0001 <- (example)`);
		if(args1.length != 4) return message.reply('**يجب ان يتكون التاق من 4 ارقام**');
	}

      var playersFind = new Discord.RichEmbed()
      .setTitle(`:white_check_mark: **كود البحث عن الاعضاء بواسطة التاق**`)
      .setThumbnail(client.user.avatarURL)
      .setDescription(`**\n ↝ البحث عن الاعضاء الذين لديهم التاق التالي:**\n " #${tagPlayer} "\n\n** ↝ عدد الاعضاء:**\n " ${client.users.filter(m=>m.discriminator == tagPlayer).size} "\n\n\`\`\`════════════════════════════════════════════════════════════════════════════════════════\n\n${client.users.filter(m=>m.discriminator == tagPlayer).map(m=>size++ + '. ' + m.tag).slice(0,20).join('\n') || ' لا يوجد اعضاء بهذه الارقام'}\n\n════════════════════════════════════════════════════════════════════════════════════════\`\`\``)
      .setColor('#36393e')
      .setTimestamp()
      .setFooter(message.author.tag, message.author.avatarURL)

      message.channel.send(playersFind);
      message.delete();
  };



	if(command == prefix + 'bc') {
		if(!message.member.hasPermission('ADMINISTRATOR')) return message.reply('\`\`ADMINISTRATOR\`\` **انت لا تمتلك صلاحية**')
		if(!args1) return message.channel.send(`** ↝ Useage:** ${prefix}bc (كلامك)`);

		let bcSure = new Discord.RichEmbed()
		.setTitle(`:mailbox_with_mail: **هل انت متأكد انك تريد ارسال هذه الرسالة الى** ${message.guild.memberCount} **عضو؟**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setDescription(`**\n:envelope:  ↝ الرسالة**\n\n${args1}`)
		.setTimestamp()
		.setFooter(message.author.tag, message.author.avatarURL)

		message.channel.send(bcSure).then(msg => {
			msg.react('✅').then(() => msg.react('❎'));
			message.delete();


			let yesEmoji = (reaction, user) => reaction.emoji.name === '✅'  && user.id === message.author.id;
			let noEmoji = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id;

			let sendBC = msg.createReactionCollector(yesEmoji);
			let dontSendBC = msg.createReactionCollector(noEmoji);

			sendBC.on('collect', r => {
				message.guild.members.forEach(member => {
					member.send(args1.replace(`[user]`, member)).catch();
					if(message.attachments.first()){
						member.sendFile(message.attachments.first().url).catch();
					}
				})
				message.channel.send(`:timer: **يتم الان الارسال الى** \`\`${message.guild.memberCount}\`\` **عضو**`).then(msg => msg.delete(5000));
				msg.delete();
			});
			dontSendBC.on('collect', r => {
				msg.delete();
				message.reply(':white_check_mark: **تم الغاء رسالتك**').then(msg => msg.delete(5000));
			});
		})
	};


// كود myid
    if(command == prefix + 'myid') {
		
		let embedID = new Discord.RichEmbed()
		.setDescription(`<@${message.author.id}>'s ID: **${message.author.id}**`)
		
		message.channel.send(embedID);
	};
	
	
	
	if(message.channel.type === 'dm') {
		
		let dirctMessageBot = new Discord.RichEmbed()
		.setTitle('**[BOT DIRECT]** Direct Message To The Bot')
		.addField(`Sent By:`, `<@${message.author.id}>`)
		.setColor('RANDOM')
		.setThumbnail(message.author.avatarURL)
		.addField(`Message: `, `\n\n\`\`\`${message.content}\`\`\``)
		.setTimestamp()
		.setFooter(message.author.tag, message.author.avatarURL)
		
		client.users.get('346629187504832513').send(dirctMessageBot);
	};
	
	
	
// كود معلومات الانفايت
	if(command == prefix + 'invite-info') {
		let oi = message.mentions.users.first() ? message.mentions.users.first().id : message.author.id;
		let Tag = message.mentions.users.first() ? message.mentions.users.first().tag : message.author.tag;
		let Username = message.mentions.users.first() ? message.mentions.users.first().username : message.author.username;
		let Avatar = message.mentions.users.first() ? message.mentions.users.first().avatarURL : message.author.avatarURL;
		
		message.guild.fetchInvites().then(invs => {
			let member = client.guilds.get(message.guild.id).members.get(oi);
			let personalInvites = invs.filter(i => i.inviter.id === oi);
			let urll = invs.filter(i => i.inviter.id === oi);
			let link = urll.reduce((p , v) => v.url +` , Total de membros recrutados no convite: ${v.uses}.\n`+ p, `\nServidor: ${message.guild.name} \n `);
			let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
			let inviteCode = personalInvites.reduce((p, v) => v.code);
			let possibleInvites = [['Total de membros recrutados:']];
			possibleInvites.push([inviteCount, inviteCode]);
			let user = message.mentions.users.first() || message.author;
			let mem = message.guild.member(user);
			let millisJoined = new Date().getTime() - mem.joinedAt.getTime();
			let daysJoined = millisJoined / 1000 / 60 / 60 / 24;
			
			var inviteInfo = new Discord.RichEmbed()
			.setTitle(`:incoming_envelope: **[INVITE INFO]** ${Username}`)
			.setThumbnail(client.user.avatarURL)
			.addField('**الدعوات**', `** ↝** [ شخص **${Number(inviteCount)}** ]`)
			.addField('**تم الانضمام للسيرفر من**', `** ↝** [ يوم **${daysJoined.toFixed(0)}** ]`)
			.addField('**رابط دعوة الانضمام**', `** ↝** [ **https://discord.gg/${inviteCode || 'Zm2U6we'}** ]`)
			.setColor('#36393e')
			.setTimestamp()
			.setFooter(Tag, Avatar)
			
			message.channel.send(inviteInfo);
			});
	};



// كود الفويس اونلاين
	if(command == prefix + 'voice-online') {
		let size = 1;

		let voiceOnline = new Discord.RichEmbed()
		.setTitle(':white_check_mark: **امر الفويس اونلاين**')
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setDescription(`**\n ↝ عدد المتواجدين صوت**\n" ${message.guild.members.filter(member => member.voiceChannel).size} "\n\n\`\`\`════════════════════════════════════════════════════════════════════════════════════════\n\n${message.guild.members.filter(m=>m.voiceChannel).map(m=>size++ + '. ' + m.user.tag).slice(0,20).join('\n')}\n\n════════════════════════════════════════════════════════════════════════════════════════\`\`\``)
		.setTimestamp()
		.setFooter(message.author.tag, message.author.avatarURL)
		
		message.channel.send(voiceOnline);
	};



// الالعاب
	if(!games[message.author.id]) games[message.author.id] = {
		laz: 0,
		fkk: 0,
		fast: 0,
		emoji: 0,
		flag: 0,
		math: 0,
	};
	
	if(command == prefix + 'لغز') {
		let type = require('./qlaz.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qLaz = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يقوم بحل اللغز التالي:\n\n ↝ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qLaz).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بحل اللغز بالوقت المناسب, **مجموع نقاطك**`);
				games[won.id].laz++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بحل اللغز بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'فكك') {
		let type = require('./qfkk.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFkk = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يقوم بتفكيك الجملة التالية:\n ↝ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qFkk).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بتفكيك الكلمة بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].fkk++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بتفكيك الكلمة بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'اسرع') {
		let type = require('./qfast.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFast = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يكتب الجملة التالية:\n\n ↝ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qFast).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة الجملة بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].fast++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة الجملة بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'ايموجي') {
		let type = require('./qemoji.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qEmoji = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يقوم بكتابة اسم الايموجي التالي:`)
		.setImage(item.type)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qEmoji).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة اسم الايموجي بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].emoji++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة اسم الايموجي بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'علم') {
		let type = require('./qflag.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qFlag = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يقوم بكتابة اسم العلم التالي:`)
		.setImage(item.type)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qFlag).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة اسم العلم بالوقت المناسب، **مجموع نقاطك**`);
				games[won.id].flag++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بكتابة اسم العلم بالوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'رياضيات') {
		let type = require('./qmath.json');
		let item = type[Math.floor(Math.random() * type.length)];
		let filter = response => {
		return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
		};
		var lazPoints = games[message.author.id].laz;
		var fkkPoints = games[message.author.id].fkk;
		var fastPoints = games[message.author.id].fast;
		var emojiPoints = games[message.author.id].emoji;
		var flagPoints = games[message.author.id].flag;
		var mathPoints = games[message.author.id].math;
		var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
		
		if(cooldownGames.has(message.author.id)) return message.reply('**جاوب على السؤال اولا**');
		cooldownGames.add(message.author.id);
		
		let qMath = new Discord.RichEmbed()
		.setTitle('')
		.setDescription(`اسرع واحد يحسب المعادلة التالية:\n\n ↝ **${item.type}**`)
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTimestamp()
		.setFooter(``)
		
		message.channel.send(qMath).then(() => {
			message.channel.awaitMessages(filter, { maxMatches: 1, time: 10000, errors: ['time'] })
			.then((collected) => {
				let won = collected.first().author;
				message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` **لقد قمت بحساب المعادلة بشكل صحيح بالوقت المناسب، مجموع نقاطك**`);
				games[won.id].math++;
				cooldownGames.delete(message.author.id);
				fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
					if(err) console.error(err)
				})
			})
			.catch(collected => {
				message.channel.send(`:x: **لم يقم احد بحساب المعادلة في الوقت المناسب**`);
				cooldownGames.delete(message.author.id);
			})
		})
	}
	if(command == prefix + 'نقاطي') {
		if(!games[message.author.id]) games[message.author.id] = {
			laz: 0,
			fkk: 0,
			fast: 0,
			emoji: 0,
			flag: 0,
			math: 0,
		};
		
		if(args1 == '') {
			var lazPoints = games[message.author.id].laz;
			var fkkPoints = games[message.author.id].fkk;
			var fastPoints = games[message.author.id].fast;
			var emojiPoints = games[message.author.id].emoji;
			var flagPoints = games[message.author.id].flag;
			var mathPoints = games[message.author.id].math;
			var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
			var playerName = message.author.tag;
			var playerAvatar = message.author.avatarURL;
		}else {
			if(!games[muf.id]) games[muf.id] = {
				laz: 0,
				fkk: 0,
				fast: 0,
				emoji: 0,
				flag: 0,
				math: 0,
			};
			
			var lazPoints = games[muf.id].laz;
			var fkkPoints = games[muf.id].fkk;
			var fastPoints = games[muf.id].fast;
			var emojiPoints = games[muf.id].emoji;
			var flagPoints = games[muf.id].flag;
			var mathPoints = games[muf.id].math;
			var allPoints = lazPoints + fkkPoints + fastPoints + emojiPoints + flagPoints + mathPoints;
			var playerName = muf.tag;
			var playerAvatar = muf.avatarURL;
		}
		
		let pointsPlayer = new Discord.RichEmbed()
		.setThumbnail(client.user.avatarURL)
		.setColor('#36393e')
		.setTitle(`**\n:crown: [ مجموع النقاط [ ${allPoints}\n**`)
		.addField('**نقاط لعبة الالغاز:**', ` ↝ [ **${lazPoints}** ] ↜`, true)
		.addField('**نقاط لعبة فكك:**', ` ↝ [ **${fkkPoints}** ] ↜`, true)
		.addField('**نقاط لعبة اسرع كتابة:**', ` ↝ [ **${fastPoints}** ] ↜`, true)
		.addField('**نقاط لعبة الايموجي:**', ` ↝ [ **${emojiPoints}** ] ↜`, true)
		.addField('**نقاط لعبة الاعلام:**', ` ↝ [ **${flagPoints}** ] ↜`, true)
		.addField('**نقاط في لعبة الحساب:**', ` ↝ [ **${mathPoints}** ] ↜`, true)
		.setTimestamp()
		.setFooter(playerName, playerAvatar)
		
		message.channel.send(pointsPlayer);
		
		fs.writeFile("./games/games.json", JSON.stringify(games), (err) => {
			if(err) console.error(err)
		});
	};
});

client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
    if(command == prefix + 'sug') {
		if(message.author.bot) return;
		if(message.channel.type === 'dm') return;
		var member = message.author.id;
		var channel = message.guild.channels.find('name', '⫸【『الاقتراحات』】');
		if(!channel) return;
		var sug = message.content.split(' ').slice(1).join(' ');
        if(!sug) return message.channel.send(`** ↝ Useage:** ${prefix}sug <اقتراحك>`).then(msg => msg.delete(5000));
		message.delete();
		
		var sugDone = new Discord.RichEmbed()
		.setTitle(`**تم ارسال اقتراحك بنجاح ! شكرا على اقتراحك**`)
		.setColor('#36393e')
		.setThumbnail(client.user.avatarURL)
		.setDescription(`**\n ↝ اقتراحك هو**\n\n${sug}`)
		.setTimestamp()
		.setFooter(message.author.tag, message.author.avatarURL)
		
		var sugSure = new Discord.RichEmbed()
		.setThumbnail(client.user.avatarURL)
		.setTitle(`**هل انت متأكد من انك تريد ارسال اقتراحك ؟ معك دقيقة قبل الالغاء**`)
		.setDescription(`**\n ↝ اقتراحك هو**\n\n${sug}\n\n:white_check_mark: للارسال\n\n:negative_squared_cross_mark: للالغاء`)
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
		.setTimestamp()
		.setColor('#36393e')
		message.channel.send(sugSure).then(msg => {
			msg.react('✅').then(() => msg.react('❎'))

let YesFilter = (reaction, user) => reaction.emoji.name === '✅'  && user.id === message.author.id;
let NoFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === message.author.id;

let Yes = msg.createReactionCollector(YesFilter, { time: 60000 });
let No = msg.createReactionCollector(NoFilter, { time: 60000 });

Yes.on("collect", r => {
	message.channel.send(sugDone).then(msg => msg.delete(6000));
	msg.delete();
	var newsug = new Discord.RichEmbed()
	.setTitle(`**:bell: اقــــــتـــراح جـــــديــــــد :bell:**`)
	.setDescription(`** ↝ من**\n<@${member}>\n\n** ↝ الاقتراح هو**\n\n${sug}`)
	.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	.setTimestamp()
	.setThumbnail(client.user.avatarURL)
	.setColor('#36393e')
	channel.send(newsug).then(message => {
		message.react('👍').then(() => message.react('👎'))
	})
})
No.on("collect", r => {
	message.reply('**:x: تم الغاء اقتراحك**').then(message => {message.delete(4000)})
	msg.delete();
})
   })
	}
});

client.on('message', message => {
	var command = message.content.toLowerCase().split(" ")[0];
	var mc = message.content.split(' ').slice(1).join(' ');
	var player = message.author.id;
	
	if(command == prefix + 'survival-join') {
		if(message.author.bot) return;
		if(message.channel.type === 'dm') return;
		if(!message.guild.channels.get('472937440454377472')) return;
		if(cooldownSurvival.has(message.author.id)) return message.reply('**لقد قمت بالتقديم مسبقا**');
		if(!mc) return message.channel.send(`** ↝ Useage:** ${prefix}survival-join <اسمك بماين كرافت>`).then(msg => msg.delete(5000));
		if(mc.length > 20) return message.reply('**هذا ليس اسم بماين كرافت**').then(msg => msg.delete(3000));
		if(mc.length < 3) return message.reply('**هذا ليس اسم بماين كرافت**').then(msg => msg.delete(3000));
		
		cooldownSurvival.add(message.author.id);
		
		var done = new Discord.RichEmbed()
		.setDescription(`**تم ارسال تقديمك بنجاح !**\n\n** ↝ اسمك بماين كرافت**\n[ ${mc} ]`)
		.setColor('#36393e')
		.setThumbnail(client.user.avatarURL)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL);

		var apply = new Discord.RichEmbed()
		.setThumbnail(client.user.avatarURL)
		.setDescription(`** ↝ الاسم**\n<@${player}>\n\n** ↝ الاسم بماين كرافت**\n[ ${mc} ]`)
		.setTimestamp()
		.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)

		message.channel.send(done).then(msg => msg.delete(5000));
		message.guild.channels.get("472937440454377472").send(apply).then(msg => {
			msg.react('✅').then(() => msg.react('❎'))

			let YesFilter = (reaction, user) => reaction.emoji.name === '✅'  && user.id === ('282350776456839169');
			let NoFilter = (reaction, user) => reaction.emoji.name === '❎' && user.id === ('282350776456839169');

			let aceept = msg.createReactionCollector(YesFilter);
			let noaccept = msg.createReactionCollector(NoFilter);

noaccept.on('collect', r => {
	var survivalRole = message.guild.roles.find('name', '• Survival');
	if(message.member.roles.has('name', '• Survival')) {
		message.member.removeRole(survivalRole);
	}
	message.author.send('**لقد تم رفضك من سيرفر السرفايفل**');
	msg.delete();
	})

aceept.on('collect', r => {
	message.author.send('**لقد تم قبولك بسيرفر السرفايفل**\n\n** ↝ IP**: _217.195.190.59:25648_\n** ↝ Version**: _1.13_');
	var survivalRole = message.guild.roles.find('name', '• Survival');
	if(!survivalRole) return message.guild.owner.send(`\`\`• Survival\`\` **الرجاء صنع رتبة باسم**`);
	message.member.addRole(survivalRole);
			})
		})
	}
});

// عند مسح رساله او تعديلها
client.on('messageDelete', message => {
	if(message.author.bot) return;
	if(message.content.toUpperCase().startsWith(prefix || '#' || '!' || '->')) return;
	var MsgDelete = new Discord.RichEmbed()
	.setTitle(`:wastebasket: **[MESSAGE DELETE]**`)
	.setThumbnail(client.user.avatarURL)
	.setColor('#36393e')
	.setDescription(`**\n ↝ الاسم:**\n<@${message.author.id}>\n\n** ↝ الرسالة التي تم مسحها:**\n\`\`\`${message}\`\`\`\n** ↝ في روم:**\n${message.channel}`)
	.setTimestamp()
	.setFooter(`${message.author.username}#${message.author.discriminator}`, message.author.avatarURL)
	if(!message.guild.channels.find('name', 'Gaintbot-log')) return;
	message.guild.channels.find('name', 'Gaintbot-log').send(MsgDelete);
});

client.on('messageUpdate', (oldMessage, newMessage) => {
	if(newMessage.author.bot) return;
	var guild = newMessage.guild;
	const MsgEdit = new Discord.RichEmbed()
	.setTitle(`:gear: **[MESSAGE EDIT]**`)
	.setThumbnail(client.user.avatarURL)
	.setColor('#36393e')
	.setDescription(`**\n ↝ الاسم:**\n<@${newMessage.author.id}>\n\n** ↝ قبل التعديل:**\n\`\`\`${oldMessage}\`\`\`\n** ↝ بعد التعديل:**\n\`\`\`${newMessage}\`\`\`\n** ↝ في روم:**\n${newMessage.channel}`)
	.setTimestamp()
	.setFooter(`${newMessage.author.username}#${newMessage.author.discriminator}`, newMessage.author.avatarURL)
	if(!guild.channels.find('name', 'Gaintbot-log')) return;
	guild.channels.find('name', 'Gaintbot-log').send(MsgEdit);
});

// عند صناعة رتبه او مسحها
 client.on("roleCreate", rc => {
	 var channel = rc.guild.channels.find("name", "Gaintbot-log");
	 if(!channel) return;
	 rc.guild.fetchAuditLogs()
	 .then(logs => {
		 let user = logs.entries.first().executor.id
		 var roleCreate = new Discord.RichEmbed()
		 .setTitle(':white_check_mark: **[ROLE CREATE]**')
		 .setThumbnail(client.user.avatarURL)
		 .setDescription(`**\n ↝ اسم الرتبة:**\n\`\`${rc.name}\`\`\n\n** ↝ بواسطة:**\n<@${user}>`)
		 .setColor('#36393e')
		 .setTimestamp()
		 .setFooter(`This Bot was Developed For [ ${rc.guild.name} ]`, client.user.avatarURL)
		 
		 channel.send(roleCreate);
	 })
});

client.on("roleDelete", rd => {
	 var channel = rd.guild.channels.find("name", "Gaintbot-log");
	 if(!channel) return;
	 rd.guild.fetchAuditLogs()
	 .then(logs => {
		 let user = logs.entries.first().executor.id
		 var roleDelete = new Discord.RichEmbed()
		 .setTitle(':negative_squared_cross_mark: **[ROLE DELETE]**')
		 .setThumbnail(client.user.avatarURL)
		 .setDescription(`**\n ↝ اسم الرتبة:**\n\`\`${rd.name}\`\`\n\n** ↝ بواسطة:**\n<@${user}>`)
		 .setColor('#36393e')
		 .setTimestamp()
		 .setFooter(`This Bot was Developed For [ ${rd.guild.name} ]`, client.user.avatarURL)
		 
		 channel.send(roleDelete);
	 })
});

// عند صناعة روم او مسحه
client.on('channelCreate', cc => {
	if(!cc.guild) return;
	 var channel = cc.guild.channels.find('name', 'Gaintbot-log');
	 if(!channel) return;
	 cc.guild.fetchAuditLogs()
	 .then(logs => {
		 let user = logs.entries.first().executor.id
		 var channelCreate = new Discord.RichEmbed()
		 .setTitle(':white_check_mark: **[CHANNEL CREATE]**')
		 .setThumbnail(client.user.avatarURL)
		 .setDescription(`**\n ↝ اسم الروم:**\n<#${cc.id}>\n\n** ↝ بواسطة:**\n<@${user}>`)
		 .setColor('#36393e')
		 .setTimestamp()
		 .setFooter(`This Bot was Developed For [ ${cc.guild.name} ]`, client.user.avatarURL)
		 
		 channel.send(channelCreate);
	 })
});

client.on('channelDelete', dc => {
	 var channel = dc.guild.channels.find("name", "Gaintbot-log");
	 if(!channel) return;
	 dc.guild.fetchAuditLogs()
	 .then(logs => {
		 let user = logs.entries.first().executor.id
		 var channelDelete = new Discord.RichEmbed()
		 .setTitle(':negative_squared_cross_mark: **[CHANNEL DELETE]**')
		 .setThumbnail(client.user.avatarURL)
		 .setDescription(`**\n ↝ اسم الروم:**\n#${dc.name}\n\n** ↝ بواسطة:**\n<@${user}>`)
		 .setColor('#36393e')
		 .setTimestamp()
		 .setFooter(`This Bot was Developed For [ ${dc.guild.name} ]`, client.user.avatarURL)
		 
		 channel.send(channelDelete);
	 })
});

client.on('guildMemberAdd', member => {
	let botCount = member.guild.members.filter(m=>m.user.bot).size;
	let memberCount = member.guild.memberCount - botCount;
	let channelMC = member.guild.channels.get('473493833813065755');
	let channelBC = member.guild.channels.get('473516097359052800');
	
	if(channelMC) {
		channelMC.setName(`⟫『  ${memberCount} عدد الاعضاء 』⟪`);
	};
	if(channelBC) {
		channelBC.setName(`⟫『 ${botCount} عدد البوتات 』⟪`);
	};

    var memberjoin = new Discord.RichEmbed()
    .setTitle(`:arrow_right: **[JOIN MEMBER]**`)
    .setThumbnail(client.user.avatarURL)
    .setDescription(`**\n:tada: <@${member.user.id}> Joined The Server!\n\nMember Number: ${member.guild.memberCount}\n\n**`)
    .addField(':date: **تاريخ الدخول الى الدسكورد:**', `${moment(member.user.createdAt).format('D/M/YYYY h:mm a')} **\n** \`${moment(member.user.createdAt).fromNow()}\``, true)
    .addField(':date: **تاريخ الدخول الى السيرفر:**', `${moment(member.joinedAt).format('D/M/YYYY h:mm a ')} \n\`\`${moment(member.joinedAt).startOf(' ').fromNow()}\`\``, true)
    .setTimestamp()
    .setFooter(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
    if(!member.guild.channels.find('name', 'Gaintbot-log')) return;
    member.guild.channels.find('name', 'Gaintbot-log').send(memberjoin);
});



client.on('guildMemberRemove', member => {
	let botCount = member.guild.members.filter(m=>m.user.bot).size;
	let memberCount = member.guild.memberCount - botCount;
	let channelMC = member.guild.channels.get('473493833813065755');
	let channelBC = member.guild.channels.get('473516097359052800');
	
	if(channelMC) {
		channelMC.setName(`⟫『  ${memberCount} عدد الاعضاء 』⟪`);
	};
	if(channelBC) {
		channelBC.setName(`⟫『 ${botCount} عدد البوتات 』⟪`);
	};

	var memberleft = new Discord.RichEmbed()
	.setTitle(`:arrow_upper_left: **[LEFT MEMBER]**`)
	.setThumbnail(client.user.avatarURL)
	.setDescription(`**\n<@${member.user.id}> Leave The Server :broken_heart:\n**`)
	.setTimestamp()
	.setFooter(`${member.user.username}#${member.user.discriminator}`, member.user.avatarURL)
	
	if(!member.guild.channels.find('name', 'Gaintbot-log')) return;
	member.guild.channels.find('name', 'Gaintbot-log').send(memberleft);
});
   
   
      client.on("message", message => {
    if (message.content.toLowerCase() === prefix + "help") {
        message.delete(5000)
        if(!message.channel.guild) return;
        const e = new Discord.RichEmbed()
        .setColor('#36393e')
        .setTitle('Check Your DM’s | انظر الى الخاص')
     const embed = new Discord.RichEmbed()
         .setColor('#36393e')
         .setTitle('')
         .setURL('')
         .setDescription(`
 **
╭━━━╮╱╱╱╱╱╱╭╮╭━━━╮
┃╭━╮┃╱╱╱╱╱╭╯╰┫╭━╮┃
┃┃╱╰╋━━┳┳━╋╮╭┫┃╱╰╋━━┳╮╭┳━━┳━━╮
┃┃╭━┫╭╮┣┫╭╮┫┃┃┃╭━┫╭╮┃╰╯┃┃━┫━━┫
┃╰┻━┃╭╮┃┃┃┃┃╰┫╰┻━┃╭╮┃┃┃┃┃━╋━━┃
╰━━━┻╯╰┻┻╯╰┻━┻━━━┻╯╰┻┻┻┻━━┻━━╯



الأوامر | Commands

    البرفكس الخاص بالبوت [ # ] Bot Prefix

    لعرض النقاط الخاصة بك [ #points - #نقاطي ] To display your points

    قائمة المتصدرين للسيرفر [ #top - #توب ] Guild Leaderboard    ( قريبا | Comming Soon )

    قائمة المتصدرين في كافة السيرفرات [ #gtop - #الأفضل ] Global Leaderboardoard    ( قريبا | Comming Soon )

    Number of games [ 10 ] عدد الألعاب

▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

الألعاب

#فكك | #spelling

#اسرع كتابة | #fasttyping

#عواصم | #captials

#لغز | #puzzle

#سؤال | #question ( قريبا | Comming Soon )

#ايموجي | #emoji

#علم | #flags

#ترجم | #translate ( قريبا | Comming Soon )

#اعكس | #reverse  ( قريبا | Comming Soon )

#احسب | #maths

#انمي | #anime

#pubg | ببجي

  سيرفر الرئيسي | Offical Server [ <:globe_with_meridians:409259794554290177> ]

سيرفر الدعم الفني | Support Server [ <:support:494431949192953866> ]



▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬

     مبرمج البوت | Developers


[ <@202745501345382400> ]

[ <@461766920400535552> ]

© 2018 جاينت قايمز | GaintGames

[ We will support fully English language Coming soon ]

 **
`)
   message.channel.send(e).then(m => m.delete(5000))
   message.author.sendEmbed(embed).catch(error => message.reply(':cry: Your DM’s is CLosed | خاصك مغلق :cry:'))
   
   }
   });
  

client.on('message', message =>{
    if(message.content === '#بنق'){
let start = Date.now(); message.channel.send('pong').then(message => { 
message.edit(`\`\`\`js
Time taken: ${Date.now() - start} ms
Discord API: ${client.ping.toFixed(0)} ms\`\`\``);
    });
    }
});




let points = JSON.parse(fs.readFileSync('./PL/plPTS.json', 'utf8')); 
client.on('message', message => { 
if (!points[message.author.id]) points[message.author.id] = { 
    points: 0, 
  }; 
if (message.content.startsWith(prefix + 'برامج')) { 
    if(!message.channel.guild) return message.reply('**:x: هذا الأمر للسيرفرات فقط**').then(m => m.delete(3000)); 
const type = require('./PL/pl.json'); 
const item = type[Math.floor(Math.random() * type.length)]; 
const filter = response => { 
    return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase()); 
}; 
message.channel.send('**لديك 15 ثانيه لتعرف اسم أي برنامج .**').then(msg => { 
    
msg.channel.sendFile(`${item.image}`).then(() => { 
        message.channel.awaitMessages(filter, { maxMatches: 1, time: 15000, errors: ['time'] }) 
        .then((collected) => { 
        message.channel.send(`${collected.first().author} ✅ \`\`${allPoints + 1}\`\` لقد قمت بكتابة اسم البرنامج بالوقت المناسب, **مجموع نقاطك**`);
        console.log(`[Typing] ${collected.first().author} typed the word.`); 
            let userData = points[message.author.id]; 
            userData.points++; 
          }) 
          .catch(collected => { 
            message.channel.send(`**تم الانتهاء من الوقت  حظ اوفر المره القادمه :stopwatch: الاجابه هي : __${item.answers}__ **`); 
            console.log('[Typing] Error: No one type the word.'); 
          }) 
        }) 
    }) 
} 
}); 
    
client.on('message', message => { 
if (message.content.startsWith(prefix + 'points')) { 
    if(!message.channel.guild) return message.reply('**هذا الأمر للسيرفرات فقط**').then(m => m.delete(3000)); 
    let userData = points[message.author.id]; 
    let embed = new Discord.RichEmbed() 
    .setAuthor(`${message.author.tag}`, message.author.avatarURL) 
    .setColor('#36393e') 
    .setDescription(`نقاطك: \`${userData.points}\``) 
    message.channel.sendEmbed(embed) 
  }   
  fs.writeFile("./PL/plPTS.json", JSON.stringify(points), (err) => { 
    if (err) console.error(err) 
  }) 
}); 
   

client.on('message', message => {
        if(message.content.startsWith(prefix + 'profile')) {
            let args = message.content.split(' ').slice(1).join(' ');
            if (!args) return message.channel.send("**Please provide a Minecraft username. ❌**");
            var link = (`https://blocksmc.com/player/${args}`);
            message.channel.send(link);
        }
    });


client.login(process.env.BOT_TOKEN);
