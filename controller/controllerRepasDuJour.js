const { response } = require('express');
const pool = require('../conf/bdd')



const afficherRepasDuJour = function (options){ 
    return (async function (req, res, next){    
        let conn;
        conn;

        if (options.jour == null) console.error("options.jour est null");
        if (options.moment == null) console.error("options.moment est null");

        try {
            console.log("jour == " + options.jour);
            console.log("req == " + req);
            
            conn = await pool.getConnection();
            if (options.moment == null && options.jour != "semaine") {
                var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE j.nom LIKE '"+options.jour+"';";
            } 
            else if (options.moment == null && options.jour == "semaine") {
                var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment";
            }
            else if (options.moment != null && options.jour != "semaine") {
                var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE j.nom LIKE '"+options.jour+"' AND m.nom = '" + options.moment + "';";
            }
            else if (options.moment != null && options.jour == "semaine") {
                var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE m.nom = '" + options.moment + "';";
            }
            var rows = await conn.query(query);
            res.send(rows);
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.release();
        }
    });
}



const supprimerRepasDuJour = function (options) { 
    return (async function (req, res, next){    
        let conn;
        console.log("supprimer req.body.nom = " + req.body.nom);
        verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(options, req.body.nom).then(async function (id){
            try {
                conn = await pool.getConnection();
                // var query = "DELETE FROM `repas du jour` WHERE id_viande = ( SELECT id FROM viandes WHERE nom LIKE '" + req.body.nom + "'";
                // `id_jour`, `id_viande`, `id_moment`
                if (options.moment == null && options.jour != "semaine") {
                    // var query = "DELETE FROM `repas du jour` WHERE id_viande = " + id;
                    var query = "DELETE FROM `repas du jour` WHERE id_viande = " + id + " AND id_jour = '" + options.jour + "';";
                }
                else if (options.moment == null && options.jour == "semaine") {
                    console.log("Suppression des repas de toute la semaine");
                    var query = "DELETE FROM `repas du jour` ";
                        query += "WHERE id_jour in (";
                        query += "SELECT id FROM jours WHERE jours.nom in ('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche')) ";
                        query += "AND id_viande = '" + id + "'";
                        query += "AND id_moment in (2,3);";
                }
                else if (options.moment != null && options.jour != "semaine") {
                    console.log(id + " " + options.jour + " " + options.moment + " !");
                    // var query = "DELETE FROM `repas du jour` WHERE id_viande = " + id + " AND id_jour = '" + options.jour + "' AND id_moment = (SELECT id FROM moments WHERE nom = '" + options.moment + "');";
                    var query = "DELETE FROM `repas du jour` WHERE id_viande = " + id + " AND id_jour = ( SELECT id FROM jours WHERE nom = '" + options.jour + "' ) AND id_moment = (SELECT id FROM moments WHERE nom = '" + options.moment + "');";
                }
                else if (options.moment != null && options.jour == "semaine") {
                    
                    var query =  "DELETE FROM `repas du jour`";
                        query += "WHERE id_jour in (";
                        query += "SELECT id FROM jours WHERE jours.nom in ('lundi','mardi','mercredi','jeudi','vendredi','samedi','dimanche'))";
                        query += "AND id_viande = '" + id + "'";
                        query += "AND id_moment = (SELECT id FROM moments WHERE nom = '" + options.moment + "');";

                }
                var rows = await conn.query(query);
                // console.log("typeof rows[0] = " + typeof rows[0]);
                // console.log(rows[0]);
                if((typeof rows[0]) != "undefined"){
                    res.status(200).json({ message: "Le repas a été supprimée correctement"});
                }
                else{
                    res.status(200).json({ message: "Le repas avec l'id suivant \"" + id + "\" n'existe pas dans la table \"repasdujour\" et ne peut donc pas être supprimée"});
                }
        
            } catch (err) {
                throw err;
            } finally {
                if (conn) return conn.release();
            }

        });
    });
}




const ajouterRepasduJourDansViandes = function (options){
    
    return ( async function(req, res, next) {
        console.log("AjouterViande : " + req.body.nom);
        verification_de_la_presence_du_parametre_req_body(req,res,next).then(async ()=>{
        // Check mandatory request parameters

        if (!req.body.nom) {
            console.log("req.body.nom = " + req.body.nom);
            return res.status(400).json({ error: 'Il manque le paramètre req.body.nom' });
        }   

        if (!options.jour) {
            console.log("options.jour = " + options.jour);
            return res.status(400).json({ error: 'Il manque le paramètre options.jour' });
        }   

        if (!options.moment) { // Il n'est pas obligatoire
            console.log("options.moment = " + options.moment);
            // return res.status(400).json({ error: 'Il manque le paramètre options.moment' });
        }   
            // Check if account already exists
            verification_de_la_presence_du_nom_de_la_viande_dans_la_table_viandes(req.body.nom).then(function (nom_bdd) { 
                console.log(nom_bdd + " VS " + req.body.nom);
                if (nom_bdd == req.body.nom) {
                    ajouterRepasDuJour(options, req.body.nom);
                    console.warn("Le repas " + req.body.nom + " ne peut pas être ajouté car elle existe déjà");
                    return res.status(409).json({ message: "Le repas " + req.body.nom + " ne peut pas être ajouté car elle existe déjà",
                                                nom: req.body.nom,
                                                presence: 1 });
                }
                else{
                    nom_de_viande_a_ajouter(req.body.nom).then(()=>{
                        ajouterRepasDuJour(options, req.body.nom);
                    });
                    res.status(200).json({ message: "Le repas \"" + req.body.nom + "\" a été ajoutée correctement",
                                        nom: req.body.nom,
                                        presence: 0});
                }
            });
        });
    });
}


async function ajouterRepasDuJour(options,reponse){
    console.log(" reponse :: " + reponse);
    verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(options, reponse).then(async function(data) {
        console.log("data :: " +  data);
        console.log("options.jour :: " +  options.jour);
        console.log("options.moment :: " +  options.moment);
        // console.log("typeof data = " + typeof data);
        if(data == null){
            console.log("data ::: " + data);
            console.log("options.jour ::: " +  options.jour);
            console.log("reponse ::: " + reponse);
            
            try {
                conn = await pool.getConnection();
                if (options.moment == null && options.jour != "semaine") {
                    var query = "INSERT INTO `repas du jour`(`id_jour`, `id_viande`, `id_moment`)";
                        query += "VALUES";
                        query += "((SELECT id FROM jours WHERE nom = '"+options.jour+"'),(SELECT id FROM viandes WHERE nom = '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = '"+options.jour+"'),(SELECT id FROM viandes WHERE nom = '"+reponse+"'), 3);";
                } 
                else if (options.moment == null && options.jour == "semaine") {
                    var query = "INSERT INTO `repas du jour` (`id_jour`, `id_viande`, `id_moment`)"; 
                        query += "VALUES";
                        query += "((SELECT id FROM jours WHERE nom = 'lundi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'mardi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'mercredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'jeudi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'vendredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'samedi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'dimanche'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 3),";
                        query += "((SELECT id FROM jours WHERE nom = 'lundi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'mardi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'mercredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'jeudi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'vendredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'samedi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2),";
                        query += "((SELECT id FROM jours WHERE nom = 'dimanche'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), 2);";
                }
                else if (options.moment != null && options.jour != "semaine") {
                    // var query = "INSERT INTO `repas du jour`(`id_jour`, `id_viande`, `id_moment`) VALUES ((SELECT id FROM jours WHERE nom = '"+options.jour+"'),(SELECT id FROM viandes WHERE nom = '"+reponse+"'),(SELECT id FROM moments WHERE nom = '"+options.moment+"'));";
                    var query = "INSERT INTO `repas du jour`(`id_jour`, `id_viande`, `id_moment`) VALUES ((SELECT id FROM jours WHERE nom = '"+options.jour+"'),(SELECT MAX(id) FROM viandes WHERE nom = '"+reponse+"'),(SELECT id FROM moments WHERE nom = '"+options.moment+"'));";
                }
                else if (options.moment != null && options.jour == "semaine") {
                    var query = "INSERT INTO `repas du jour`(`id_jour`, `id_viande`, `id_moment`)";
                        query += "VALUES";
                        query += "((SELECT id FROM jours WHERE nom = 'lundi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'mardi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'mercredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'jeudi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'vendredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'samedi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'dimanche'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'lundi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'mardi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'mercredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'jeudi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'vendredi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'samedi'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"')),";
                        query += "((SELECT id FROM jours WHERE nom = 'dimanche'), (SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'), (SELECT id FROM moments WHERE nom = '"+options.moment+"'));";
                }
                // var query = "INSERT INTO viandes VALUES (" + ((await id_max()) + 1) + "," + "'"+nom+"'" + ")";
                await conn.query(query)
            } catch (err) {
                throw err;
            } finally {
                if (conn) await conn.release();
            }
        }
        else{
            console.log("SINON data = " + data); // data correspond à l'ID de repas du jour
            console.log("SINON reponse = " + reponse); // data correspond à Le repas
            return null;
        }
    });
};

  

async function nom_de_viande_a_ajouter (nom){
    try {
        conn = await pool.getConnection();
        var query = "INSERT INTO viandes (nom) VALUES (" + "'"+nom+"'" + ")";
        await conn.query(query)
    } catch (err) {
        throw err;
    } finally {
        if (conn) await conn.release();
    }
};





async function id_max(){
    try {
        conn = await pool.getConnection();
        var query = "SELECT MAX(v.id) AS MAXI FROM viandes v;";
        return await conn.query(query).then( v => v[0].MAXI );
    } catch (err) {
        throw err;
    } 
    finally {
        if (conn) conn.release();
    }
}



const verification_de_la_presence_du_parametre_req_body = (async function (req, res, next){    
    let conn;
    try {
        conn = await pool.getConnection();
        var query = "select * from viandes WHERE nom = '" + req.body.nom + "'";
        var rows = await conn.query(query);
      //   var rows = await conn.query(query, req.params.id, function (error, rows) {
          // console.error(error);
          // console.log(rows);
      //    });
      // res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
    }
  
  });




async function verification_de_la_presence_du_nom_de_la_viande_dans_la_table_viandes(req_nom){
    try {
        conn = await pool.getConnection();
        var query = "SELECT nom FROM viandes v WHERE v.nom = " + "'"+req_nom+"'" + ";";
        var bdd_nom = await conn.query(query);
        if(typeof bdd_nom[0] !== "undefined"){
            return bdd_nom[0].nom;
        }
        else{
            return null;
        }
        
    } catch (err) {
        throw err;
    } 
    finally {
        if (conn) await conn.release();
    }
}



async function verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(options,req_nom){
    console.log("options |= " + options);
    console.log("options.jour |= " + options.jour);
    console.log("options.moment |= " + options.moment);
    
    try {
        conn = await pool.getConnection();
        console.log("req_nom = " + req_nom);
        if (options.moment == null && options.jour != "semaine") {
            var query = "select DISTINCT r.id_viande AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE j.nom = '"+options.jour+"' AND r.id_viande in ( SELECT v.id FROM viandes v WHERE v.nom = '"+req_nom+"');";
        } 
        else if (options.moment == null && options.jour == "semaine") {
            var query = "select DISTINCT r.id_viande AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE r.id_viande in ( SELECT v.id FROM viandes v WHERE v.nom = '"+req_nom+"');";
        }
        else if (options.moment != null && options.jour != "semaine") {
            var query = "select DISTINCT r.id_viande AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE j.nom = '"+options.jour+"' AND r.id_viande in ( SELECT v.id FROM viandes v WHERE v.nom = '"+req_nom+"') AND m.nom = '"+options.moment+"';";
        }
        else if (options.moment != null && options.jour == "semaine") {
            var query = "select DISTINCT r.id_viande AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viande INNER JOIN `jours` j ON j.id = r.id_jour INNER JOIN `moments` m ON m.id = r.id_moment WHERE r.id_viande in ( SELECT v.id FROM viandes v WHERE v.nom = '"+req_nom+"') AND m.nom = '"+options.moment+"';";
        }
        
        var bdd_nom = await conn.query(query);

        // console.log("Structure de bdd_nom :", JSON.stringify(bdd_nom, null, 2));
        
        if (Array.isArray(bdd_nom) && bdd_nom.length > 0) {
            console.log("Données extraites :", bdd_nom.map(row => row.VIANDES));
        } else {
            console.log("Aucune donnée trouvée ou structure inattendue.");
        }

        if(typeof bdd_nom[0] != "undefined"){
            console.log("SI = " + bdd_nom[0].VIANDES); 
            return bdd_nom[0].VIANDES; // retourne l'ID
        }
        else{
            console.log("SINON ::: " + bdd_nom[0]);
            return null;
        }
        
    } catch (err) {
        throw err;
    } 
    finally {
        if (conn) await conn.release();
    }
}



module.exports = {
    afficherRepasDuJour, 
    ajouterRepasduJourDansViandes,
    supprimerRepasDuJour
};