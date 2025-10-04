const pool = require('../conf/bdd')

const afficherLeMode = (async function (req, res, next) {    
    try {
        conn = await pool.getConnection();


    if (req.body && Object.keys(req.body).length > 0) {
        const regex_travail = /travail/;
        const regex_vacances = /vacances/;
        let id_mode =""
        console.log('Données reçues :', req.body);
        console.log('Données reçues :', req.body.id_mode);
        id_mode = req.body.id_mode.trim();
        console.log("id_mode = " + id_mode);
        
        if (regex_travail.test(req.body.id_mode)){
            id_mode = 1
        } else if (regex_vacances.test(req.body.id_mode)){
            id_mode = 2
        } 
        console.log("id_mode = " + id_mode);
        const regex_mode = /^1$|^2$/;
        if (regex_mode.test(id_mode)){
            const query = "UPDATE persistance SET id_mode=" + id_mode;
            var rows = await conn.query(query);
            res.status(200).send({ message: 'Données reçues', data: req.body, complement: id_mode });
      } else {
        res.status(400).send({ success: false, message: 'Erreur lors de la recéption du mode ! Mauvais mode attendu ! Mode attendu = (travail|vacances) ! id_mode = ' + id_mode + " !", data: req.body });
        // res.status(200).send({ message: 'Impossible de traiter la demande. id_mode = ' + id_mode + " !", data: req.body });
      }
    } else {
        const query = "SELECT id_mode FROM persistance";
        var rows = await conn.query(query);
        let id_mode = rows[0].id_mode;
        const regex_mode = /^1$|^2$/;
        console.log("id_mode = "+ id_mode);
        
        if (regex_mode.test(id_mode)){
            if (id_mode == 1){
                id_mode = 'travail';
            } else if (id_mode == 2){
                id_mode = 'vacances';
            }
                console.log('Affichage du mode : ' + id_mode + ' !');
                res.status(200).send({ success: true, message: 'Affichage du mode : ' + id_mode + ' !', mode: id_mode });
            
        } else {
                res.status(400).send({ success: false, message: 'Erreur dans la requête ! Mauvais nombre attendu' });

}   }    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        res.status(500).send({ success: false, error: "Erreur interne du serveur" });
    } finally {
        if (conn) conn.release();
    }

});


module.exports = {
    afficherLeMode
};