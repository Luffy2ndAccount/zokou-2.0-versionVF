const { zokou } = require('../framework/zokou');
const s = require('../set') ;
const sock = require("@whiskeysockets/baileys") ;
const fs = require('fs');

function getDescriptionFromEnv(envName) {

    filePath = './app.json';
    // Lecture du fichier app.json
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const appData = JSON.parse(jsonData);

    // Recherche de la description de la variable d'environnement
    const env = appData.env[envName];
    if (env && env.description) {
        return env.description;
    } else {
        return "La description de la variable d'environnement n'a pas été trouvée.";
    }
}


zokou(
    {
        nomCom : "setvar",
        categorie : "Heroku"
    }, async (dest , zk , commandeOptions) =>{

       const {ms,repondre,superUser , arg} = commandeOptions ;
       
       if(!superUser){repondre('Commande reserver au proprietaire du bot');return};
       if(s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null){repondre('Veuillez renseigner les variables d\'environnement HEROKU_APP_NAME et HEROKU_APY_KEY'); return};
       if(!arg[0] || !(arg.join('').split('='))) {repondre('Mauvais formats ; voici le mode d\'emploie.\nSetvar NOM_OWNER=Fredora');return};
     
    const text = arg.join(" ")
     const Heroku = require("heroku-client");
   
     const heroku = new Heroku({
        token: s.HEROKU_APY_KEY,
      });

     let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        await heroku.patch(baseURI + "/config-vars", {
          body: {
                  [text.split('=')[0]]: text.split('=')[1],
          },
        });
        await repondre('variable actualiser , redemarrage en cours....') ;
    }
);

zokou(
    {
        nomCom : "getallvar",
        categorie : "Heroku"
    }, async (dest , zk , commandeOptions) =>{

       const {ms,repondre,superUser , arg} = commandeOptions ;
       
       if(!superUser){repondre('Commande reserver au proprietaire du bot');return}; 
       if(s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null){repondre('Veuillez renseigner les variables d\'environnement HEROKU_APP_NAME et HEROKU_APY_KEY'); return};
      
            const Heroku = require("heroku-client");

			const heroku = new Heroku({
				token: s.HEROKU_APY_KEY,
			});
			let baseURI = "/apps/" + s.HEROKU_APP_NAME;

            let h = await heroku.get(baseURI+'/config-vars')
let str = '*liste des variables  Heroku *\n\n'
for (vr in h) {
str+= '🍁 *'+vr+'* '+'= '+h[vr]+'\n'
}
 repondre(str)


}

);       


    zokou(
        {
            nomCom : "getvar",
            categorie : "Heroku"
        }, async (dest , zk , commandeOptions) =>{
    
           const {ms,repondre,superUser , arg} = commandeOptions ;
           
           if(!superUser){repondre('Commande reserver au proprietaire du bot');return}; 
           if(s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null){repondre('Veuillez renseigner les variables d\'environnement HEROKU_APP_NAME et HEROKU_APY_KEY'); return};
           if(!arg[0]) {repondre('Inserez le nom de la variabke en grand Charactere'); return} ;
      
           try {
            const Heroku = require("heroku-client");
               
            const heroku = new Heroku({
              token: s.HEROKU_APY_KEY,
            });
            let baseURI = "/apps/" + s.HEROKU_APP_NAME;
        let h = await heroku.get(baseURI+'/config-vars')
        for (vr in h) {
        if( arg.join(' ') ===vr ) return  repondre( vr+'= '+h[vr]) 	;
        } 
        
        } catch(e) {repondre('Erreur lors de la procedure ' + e)}
   
        });


zokou({
        nomCom : "settings",
        categorie : "Heroku"
    }, async (dest , zk , commandeOptions) => {

        const {ms,repondre,superUser ,auteurMessage} = commandeOptions ;

        if(!superUser){repondre('Commande reserver au proprietaire du bot');return};
        if(s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null){repondre('Veuillez renseigner les variables d\'environnement HEROKU_APP_NAME et HEROKU_APY_KEY'); return};


            let vars = [
                { nom: 'LECTURE_AUTO_STATUS', choix: ["oui", "non"] },
                { nom: 'TELECHARGER_AUTO_STATUS', choix: ["oui", "non"] },
                { nom: 'PM_PERMIT', choix: ["oui", "non"] },
                { nom: 'MODE_PUBLIC', choix: ["oui", "non"] },
                { nom: 'STARTING_BOT_MESSAGE', choix: ["oui", "non"] },
                { nom: 'ANTI_DELETE_MESSAGE', choix: ["oui", "non"] },
                { nom: 'ETAT', choix: ["1", "2", "3", "4"] }
                
            ];

            let send = `    ╭──────༺♡༻──────╮\n              Zokou-settings\n    ╰──────༺♡༻──────╯\n\n` ;
            
            for (v = 0; v < vars.length; v++) {

                    send += `${v + 1 }- *${vars[v].nom}*\n`
            }
            send += `\nChoisissez une variable par son chiffre`


           let msg = await  zk.sendMessage(dest,{ text : send },{quoted : ms})  ;

          console.log(msg) ;

            let encresponse = await zk.awaitForMessage({
                                            chatJid : dest,
                                            sender : auteurMessage,
                                            timeout : 60000,
                                            filter : (m) => m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo.stanzaId == msg.key.id && (m.message.extendedTextMessage.text > 0 && m.message.extendedTextMessage.text <= vars.length)
                                          }) ;

            
            let num = encresponse.message.extendedTextMessage.text - 1 ;

            let {nom , choix} = vars[num] ;

            let msg2 = `    ╭──────༺♡༻──────╮\n              Zokou-settings\n    ╰──────༺♡༻──────╯\n\n` ;
                msg2+= `*Nom* :${nom}\n`
                msg2+= `*Description* :${getDescriptionFromEnv(nom)}\n\n`
                msg2+= `┌────── ⋆⋅☆⋅⋆ ──────┐\n\n`
                for(i = 0 ; i < choix.length ; i++) {
                    msg2+= `* *${i + 1}* => ${choix[i]}\n`
                }
                msg2 += `\n└────── ⋆⋅☆⋅⋆ ──────┘\n\nVeillez entrez le chiffre correspondant a votre choix`

         let msg3 = await zk.sendMessage(dest , { text : msg2 } , { quoted : encresponse } ) ;

            
            let encresponse2 = await zk.awaitForMessage( { chatJid : dest ,
                                                         sender : auteurMessage ,
                                                        timeout : 60000,
                                                        filter : (m) => m.message.extendedTextMessage && m.message.extendedTextMessage.contextInfo.stanzaId == msg3.key.id && (m.message.extendedTextMessage.text > 0 && m.message.extendedTextMessage.text <= choix.length)
                                                     } ) ;
                
                let num2 = encresponse2.message.extendedTextMessage.text - 1 ;

               // console.log('Le numero choisi est',num2) ;


               const Heroku = require("heroku-client");
   
               const heroku = new Heroku({
                  token: s.HEROKU_APY_KEY,
                });
          
               let baseURI = "/apps/" + s.HEROKU_APP_NAME;
                  await heroku.patch(baseURI + "/config-vars", {
                    body: {
                            [nom]: choix[num2],
                    },
                  });

                  await repondre('variable actualiser , redemarrage en cours....') ;

            


     }) ;


     function changevars(nomCom , varname ) {

            zokou({
                    nomCom : nomCom ,
                    categorie : 'Heroku'
            } , async (dest, zk ,commandeOptions) => {

                const {arg ,superUser , repondre} = commandeOptions ;

                if(!superUser) { repondre("Vous n'avez pas de droit sur cette categorie de commande") ; return };
              //  if(s.HEROKU_APP_NAME == null || s.HEROKU_APY_KEY == null){repondre('Veuillez renseigner les variables d\'environnement HEROKU_APP_NAME et HEROKU_APY_KEY'); return};
                if(!arg[0]) { repondre(getDescriptionFromEnv(varname)); return} ;


                const Heroku = require("heroku-client");
   
                const heroku = new Heroku({
                   token: s.HEROKU_APY_KEY,
                 });
           
                let baseURI = "/apps/" + s.HEROKU_APP_NAME;
                   await heroku.patch(baseURI + "/config-vars", {
                     body: {
                             [varname]: arg.join(" "),
                     },
                   });

                   await repondre('variable actualiser , redemarrage en cours....') ;


            })
     } ;

     changevars("setprefix","PREFIXE") ;
     changevars("linkmenu","LIENS_MENU");
     changevars("warncount","WARN_COUNT") ;