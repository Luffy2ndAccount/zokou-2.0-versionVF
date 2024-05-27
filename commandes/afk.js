const {zokou} = require("../framework/zokou") ;
const afkfunc = require("../bdd/afk") ;


zokou({
    nomCom : 'afk',
    categorie : 'Mods',
  } , async (dest,zk,commandeOptions) => {
  
   const {ms , repondre ,superUser , arg} = commandeOptions ;
  
   if (!superUser) {repondre('tu n\'as pas les droits pour cette commande') ; return}
  
   if (!arg[0]) {

        let result = await afkfunc.changeAfkState(1,"on") ;

        if (result === "not defined") {
            
            repondre("Vous avez pas actualiser un parametre pour l'AFk(Away From Keyboard)\n Pour enregristrer un message afk veuiller apres la commande entrer un message puis un lien d'image(le lien est optionnel)") ;
        
        } else {

            await afkfunc.changeAfkState(1,"on") ;
            repondre("Le nessage Afk a ete activer") ;
        }
    } else {

        try {

        let text = [] ;
        let url = "no url";

        arg.forEach(element => {
            
            if (element.endsWith(".jpg") || element.endsWith(".png") || element.endsWith(".jpeg")){
                url = element ;
            } else if (element != undefined) {
                text.push(element) ;
            }
        });

        await afkfunc.addOrUpdateAfk(1,text.join(" "),url) ;

        repondre("L'afk a ete enregistrer , taper afk pour l'activer") ;

        } catch (error) {
            console.log(error) ;
            repondre("Une erreur est survenue lors de l'enregistrement de l'afk") ;
        }
    }
  
  }) ;