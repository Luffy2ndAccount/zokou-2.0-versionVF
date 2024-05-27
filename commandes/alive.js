const { zokou } = require('../framework/zokou');
const {addOrUpdateDataInAlive , getDataFromAlive} = require('../bdd/alive')
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");

zokou(
    {
        nomCom : 'alive',
        categorie : 'Général'
        
    },async (dest,zk,commandeOptions) => {

 const {ms , arg, repondre,superUser} = commandeOptions;

 const data = await getDataFromAlive();

 if (!arg || !arg[0] || arg.join('') === '') {

    if(data) {
       
        const {message , lien} = data;


        var mode = "public";
        if (s.MODE != "oui") {
            mode = "privé";
        }
   
        let liens = lien.split(";") ;

        let lienchoisi ;

            if (liens.length > 0) {

                 lienchoisi = liens[Math.floor(Math.random() * liens.length)];
            }   else {

                lienchoisi == null ;
            }
        
    
     
    moment.tz.setDefault('Etc/GMT');

// Créer une date et une heure en GMT
const temps = moment().format('HH:mm:ss');
const date = moment().format('DD/MM/YYYY');

    const alivemsg = `
*Proprietaire* : ${s.NOM_OWNER}
*Mode* : ${mode}
*Date* : ${date}
*Heure* : ${temps}

 ${message}
 
 
 *Zokou_MD version 2.0*`


 if (lien === 'aucun') {
    
    return  repondre(alivemsg); 
    } ;

 if (lienchoisi.match(/\.(mp4|gif)$/i)) {
    try {
        zk.sendMessage(dest, { video: { url: lienchoisi }, caption: alivemsg }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
// Vérification pour .jpeg ou .png
else if (lienchoisi.match(/\.(jpeg|png|jpg)$/i)) {
    try {
        zk.sendMessage(dest, { image: { url: lienchoisi }, caption: alivemsg }, { quoted: ms });
    }
    catch (e) {
        console.log("🥵🥵 Menu erreur " + e);
        repondre("🥵🥵 Menu erreur " + e);
    }
} 
else  {
    
    repondre(alivemsg);
    
}

    } else {
        if(!superUser) { repondre("Salut Moi c'est Zokou-MD ; que puis-je pour vous ?") ; return};

      await   repondre("Vous n'avez pas encore enregistrer votre alive , pour ce faire ;\n apres la commande entrez votre message et un ou plusieur lien d'image ou video.");
        // repondre(" je prend mon temps pour t'expliquer ; gars a toi si tu fait faux")
     }
 } else {

    if(!superUser) { repondre ("Seul le proprietaire a le droit de modifier l'alive") ; return};

    
    const texte = [] ;
    const tlien = [] ;

        for ( i = 0 ; i < arg.length ; i++ ) {

                if (arg[i].endsWith('.jpg') || arg[i].endsWith('.png') || arg[i].endsWith('.jpeg') || arg[i].endsWith('.mp4') || arg[i].endsWith('.gif')) {

                    tlien.push(arg[i])
        } else if (arg[i] != undefined) {

            texte.push(arg[i]) ;
        }
    }

        let lienString ;

        if (tlien.length > 0) {
             lienString = tlien.join(";") ;
        } else {
            lienString = "aucun" ;
        }

    
await addOrUpdateDataInAlive(texte.join(" ") , lienString) ;

repondre('message alive actualiser avec succes') ;

}
    });