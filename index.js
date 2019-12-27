console.log("=> LOADING")
const fs = require('fs')
const Doc = require('discord.js-docs')
const Discord = require('discord.js')
const client = new Discord.Client()
const data = require('./data.json')
const {token} = require('./private.json')
const prefix = "*"
const types = [
    "class",
    "interface",
    "typedef",
    "prop",
    "method",
    "event"
]
const support = "https://discord.gg/3vC2XWK"
var doc;
var deprecated, github, npm, yay, labs;
var currentDocName = "stable"

client.login(token)

client.on("error", err => console.log("=> "+err.message.toUpperCase()));

client.on("ready", async function() {
    labs = client.guilds.get("507389389098188820")
	deprecated = client.emojis.get("605323302059376670")
	github = client.emojis.get("605387724534317156")
	npm = client.emojis.get("605387724102565890")
	yay = client.emojis.get("557124850326437888")
    nul = client.emojis.get("559100717445546087")
    doc = await Doc.fetch(currentDocName)
    if (doc) await client.user.setActivity(`${docpath(doc)}`, { type: "WATCHING" })
    console.log("=> READY")
})

client.on("message", async function(message) {
    if (message.system || message.author.bot) return;
    if (!isCommand(message.content)) return;


	if (message.content == prefix + "versions") {
        const embed = new Discord.RichEmbed()
            .setColor(toLib(doc).color)
            .setDescription(`Here are the ${data.libraries.length} Discord libraries supported by the bot as well as links to the various documentations available.\n${nul}`)
            .setAuthor(client.user.username,client.user.avatarURL)
        data.libraries.forEach(lib=>{
            embed.addField(lib.name,
                `Versions : ${lib.versions.map(version=>"`"+version+"`").join(", ")}\n`+
                `[${github} GitHub](${lib.github}) · [${npm} NPM](${lib.npm}) · [${yay} Docs](${lib.url})\n`+
                nul.toString()
            ,true)
        })
        const lib = data.libraries[Math.floor(Math.random()*data.libraries.length)]
        embed.setFooter(`Example : ${prefix}version ${lib.versions[0]}`,lib.image)
        await message.channel.send(embed)
    }


    else if (message.content == prefix + "info"){
        console.log(client.guilds.map(guild=>guild.toString()).join("\n"))
        const embed = new Discord.RichEmbed()
            .setColor(toLib(doc).color)
            .setAuthor(client.user.username,client.user.avatarURL)
            .setDescription(
                `I help members of **${client.guilds.size}** guilds.\n`+
                `My owner is \`Ghom#9700\`.\n[Link to DiscordBots page](https://discordbots.org/bot/554108430298775564)`
            )
            .setThumbnail(client.user.avatarURL)
        message.channel.send(embed)
    }


    else if (message.content.startsWith(prefix + "version")) {
        let embed = new Discord.RichEmbed()
        const dockey = message.content.replace(prefix + "version", "").trim()
        try{
        	const newdoc = await Doc.fetch(dockey)
        	const olddoc = doc
    		doc = newdoc
    		await client.user.setActivity(`${docpath(doc)}`, { type: "WATCHING" })
	        embed.setAuthor(docpath(doc), toLib(doc).image)
	        embed.setDescription(`The change of deposit is made! ${yay}`)
	        embed.setColor(toLib(doc).color)
        }catch(error){
        	embed.setAuthor(docpath(doc), toLib(doc).image)
            embed.setDescription(`the deposit change is refused ¯\\_(ツ)_/¯\n> Use the \`${prefix}versions\` command to get a list of versions.`)
            embed.setColor("#D10004")
        }
        message.channel.send(embed).catch(error => sendError(error, message.channel))
    }


    else if (
        message.content == prefix + "help" ||
        message.content == `${message.guild.me}`
    ) {
        await message.delete().catch(err => {})
        let link = await client.generateInvite(["ATTACH_FILES","USE_EXTERNAL_EMOJIS"])
        let embed = new Discord.RichEmbed()
            .setColor(toLib(doc).color)
            .setAuthor(`Bot invitation link`, client.user.avatarURL)
            .setDescription(
                `Gateway between the Discord.js docs and Discord.\n` +
                `Bot in open source, its code is shared below.\n` +
                `🔗 [Invitation link](${link}) | 🔗 [Support server](${support})`
            )
            .setThumbnail("https://i1.wp.com/rubydiscord.bitnamiapp.com/wp-content/uploads/2017/12/discord-logo.png?resize=300%2C300")
        await message.channel.send(embed).catch(error => sendError(error, message.channel))
        embed = new Discord.RichEmbed()
            .setColor(toLib(doc).color)
            .setAuthor(`How to use documentations ?`, toLib(doc).image)
            .setDescription(
                `**Syntax** : \`*Parent [Child [Child [Child [...]]]]\`\n` +
                `**Rules** ↓\n` +
                `🔹 Write your arguments as if they were a path.\n` +
                `🔹 Your arguments must be separated by spaces.\n` +
                `🔹 You can not start your path with a child.\n` +
                `**To test** ↓ \`\`\`\n` +
                `\t*client\n` +
                `\t*versions\n` +
                `\t*guildmember user send\n` +
                `\t* (that too!)\n` +
                `\`\`\``
            )
            .setImage("https://cdn.discordapp.com/attachments/554206505897951252/605747204564451349/discorddevbanniere.png")
        await message.channel.send(embed).catch(error => sendError(error, message.channel))
        await message.channel.send({
            files: [{
                attachment: __filename,
                name: 'SourceCode.JS'
            }]
        }).catch(error => sendError(error, message.channel))
        embed = new Discord.RichEmbed()
            .setColor("#F2D553")
            .setFooter(`Date of publication of the file`, labs.iconURL.replace(/\.(?:png|jpg|jpeg)/i,'.gif'))
            .setTimestamp()
        message.channel.send(embed).catch(error => sendError(error, message.channel))
    }


    else if (message.content.startsWith(prefix)) {
    	if(message.content == "*"){
    		const embed = embedDoc(doc)
    			.setAuthor(`Current documentation : ${toLib(doc).name}`,toLib(doc).image)
    		message.channel.send(embed).catch(error => sendError(error, message.channel))
    	}else{
            let regex = /(?:\.|\s)+/g
            if(message.content.toLowerCase().includes("options.")){
                regex = /\s+/g
            }
            const args = message.content
                .replace(prefix, "")
                .trim()
                .split(regex)
	        let docElement = doc.get(...args)
	        if (args.length == 0) return;
	        if (docElement == null) return;
	        message.channel.send(embedDoc(docElement)).catch(error => sendError(error, message.channel))
    	}
    }
})

function sendError(error, channel) {
    const embed = new Discord.RichEmbed()
        .setColor("#a83232")
        .setTitle("❌ An error occurred while sending a message.")
        .setDescription("```js\n" + error.message + "\n```")
    channel.send(embed).catch(console.error)
}

function isCommand(text) {
    return /^\*[^*]*$/.test(text)
}

function toLib(doc){
    return data.libraries.find(lib=>lib.repo==(doc.repo||doc.doc.repo))
}

function embedDoc(doc) {

    const embed = new Discord.RichEmbed().setColor(toLib(doc).color)

    // HEADER

    let current = doc
    const family = []

    while (current) {
    	family.push(current)
    	current = current.parent
    }

    family.reverse()

    let author = `${family.map(parent => parent.name).join(".")}`
    let title = `Structure : ${toLib(doc).repo}.${family.map(parent=>parent.docType).join(".")}`
    let authorImage = toLib(doc).image

    if (doc.type) {
    	title += `\nType : ${doc.type.join(" ")}`
    }
    if (doc.extends){
    	title += `\nExtends : ${doc.extends.join(", ")}`
    }
    if (doc.deprecated) {
    	embed.setColor("#c8aa14")
    	authorImage = deprecated.url
    }

    const params = doc.childrenOfType("param") || []

    if(doc.docType == "event"){
        author = author.replace(doc.name, "") + `on( "${doc.name}", callback( ${params.map(param => param.name).join(", ")}))`
    }else if(doc.docType == "method"){
        author += `( ${params.map(param => param.name).join(", ")})`
    }

    // BODY

    let description = []

    if (doc.description){
    	description.push(normalize(doc.description))
    }
    if (doc.construct) {
    	description.push("```js\n"+
    		`const ${doc.construct.name.toLowerCase()} = new ${doc.construct.name}(\n\t${doc.construct.params.map(param=>param.name).join(",\n\t")}\n);\n`+
    		`\n${doc.construct.params.map(param=>`// ${param.optional ? "[" : ""}${param.name}${param.optional ? "]" : ""} : ${param.type.join(" ")}`).join("\n")}`+
    	"\n```")
    }
    if (doc.returns) {
        description.push("```js\n"+
    		`return ${(Array.isArray(doc.returns) ? doc.returns : doc.returns.types)
				.join(" ")
				.replace(/,/g,"")
				.replace(/</g,"( ")
				.replace(/>/g,")")
				.replace(/\)/g,") ")
				.replace(/\(/g,"( ")
				.replace(/\|/g," || ")
				.replace(/ \(/g,"(")
				.replace(/ \)/g,")")
				.split(/\s+/g)
                .join(" ")
            }\n${doc.returns.description ? doc.returns.description.split("\n").map(line=>`// ${line}`).join("\n") : ""}`+
    	"\n```")
    }

    types.forEach(type => {
        const children = doc.childrenOfType(type)
        if (children) {
            embed.addField(type, children.map(child => child.deprecated ?  `${child.name} ${deprecated}` : child.name).sort((a, b) => a.localeCompare(b)).join("\n").slice(0,1023), true)
        } 
    })

    if (doc.examples) {
        embed.addField("Examples", doc.examples.map(example => "```js\n" + example + "\n```").join(" "), false)
    }

    // FOOTER

    if (doc.meta) {
        embed.setFooter(`→ ${doc.meta.path.replace(/\//g," / ")} / ${doc.meta.file} - line ${doc.meta.line}`, toLib(doc).image)
    }

    embed.setAuthor(author,authorImage)
    embed.setTitle(title)
    embed.setDescription(description.join(" ")) 

	return embed
}

function normalize(texte){
	let Texte = texte
		.slice(0)
		.replace(/<info>/g,"*")
		.replace(/<\/info>/g,"*")
		.replace(/<warn>/g,"**")
		.replace(/<\/warn>/g,"**")
		.replace(/<br>/g,"\n")
	let arrex = texte.split("")
	let nCatch = 0
	arrex.forEach((char,i)=>{
		if(char === "\n" || char === "\\"&&arrex[i+1]==="n"){
			nCatch ++
		}else if(char === "\r" || char === "\\"&&arrex[i+1]==="r"){
			nCatch ++
		}else if(char === "\v" || char === "\\"&&arrex[i+1]==="v"){
			nCatch ++
		}
	})
	if(nCatch < 5){
		Texte = Texte
			.replace(/\n/g,	" ")
			.replace(/\\n/g," ")
			.replace(/\r/g,	" ")
			.replace(/\\r/g," ")
			.replace(/\v/g,	" ")
			.replace(/\\v/g," ")
	}
	return Texte
}

function quote(texte){
	return texte.split("\n").map(line=>"> "+line).join("\n")
}

function docpath(docElement){
	return `${toLib(docElement).name} 🔹 ${docElement.project||docElement.doc.project}#${docElement.branch||docElement.doc.branch}`
}
