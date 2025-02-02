const pool = require('../conf/bdd')



async function estPresenteTViande(repas){
    return new Promise(async (resolve, reject) => {

    try {
        conn = await pool.getConnection();
        var query = "SELECT nom FROM viandes v WHERE v.nom = " + "'"+repas+"'" + ";";
        var rows = await conn.query(query);
        if(typeof rows[0] !== "undefined"){
            resolve(true);
        }
        else{
            resolve(false);
        }
        
    } catch (err) {
        throw err;
    } 
    finally {
        if (conn) await conn.release();
    }
});
}




async function estPresenteTHistoriqueRepasDesJours(repas, date, moment){
    return new Promise(async (resolve, reject) => {
    try {
        conn = await pool.getConnection();
        // console.log(repas + " , " + date + " , " + moment );
        
        var query = "SELECT COUNT(*) AS nombre FROM historiquerepasdesjours h ";
            query += "WHERE h.id_viande = ( SELECT MAX(v.id) FROM viandes v WHERE v.nom = '" + repas +"') ";
            query += "AND h.datedujour = '" + date + "'";
            query += "AND h.id_moment = ( SELECT m.id FROM moments m WHERE m.nom = '" + moment + "');";

        var rows = await conn.query(query);
        const num = Number(rows[0].nombre);
        // // console.log(rows[0].nombre);
        // console.log("num = " + num);
        

        if(num > 0){
            resolve(true);
        }
        else{
            resolve(false);
        }
    } catch (err) {
        throw err;
    } 
    finally {
        if (conn) await conn.release();
    }
});
}




async function nom_de_viande_a_ajouter (nom){
    return new Promise(async (resolve, reject) => {
    try {
        conn = await pool.getConnection();
        var query = "INSERT INTO viandes (nom) VALUES (" + "'"+nom+"'" + ")";
        await conn.query(query)
        resolve(true);
    } catch (err) {
        reject(false);
        throw err;
        
    } finally {
        if (conn) await conn.release();
    }
});
};



async function requete_ajout_historique (repas,date,moment){
    return new Promise(async (resolve, reject) => {
        const regex_moment = /^midi$|^soir$/;
        let moment_num = 0;
        // console.log("moment = "+ moment);
        
        if (regex_moment.test(moment)){
            if (moment == 'midi'){
                moment_num = 2;
            } else if (moment == 'soir'){
                moment_num = 3;
            }
        }
    
    try {
        conn = await pool.getConnection();
        let query = "INSERT INTO `historiquerepasdesjours`(`id_viande`, `datedujour`, `id_moment`)";
        query += " VALUES ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + repas + "'),'" + date + "', '" + moment_num + "');";
        await conn.query(query);
        resolve(true);
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        reject(false);
    } finally {
        if (conn) conn.release(); // Assurez-vous de libérer la connexion
    }
});
}



async function requete_suppression_historique (repas,date,moment){
    return new Promise(async (resolve, reject) => {
        const regex_moment = /^midi$|^soir$/;
        let moment_num = 0;
        // console.log("moment = "+ moment);
        
        if (regex_moment.test(moment)){
            if (moment == 'midi'){
                moment_num = 2;
            } else if (moment == 'soir'){
                moment_num = 3;
            }
        }
    
    try {
        conn = await pool.getConnection();
        let query = "DELETE FROM repas.historiquerepasdesjours ";
            query += "WHERE datedujour = '" + date + "' ";
            // query += "AND (SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + repas + "') "
            query += "AND id_moment = " + moment_num + " ;";
        await conn.query(query);
        resolve(true);
    } catch (error) {
        console.error("Erreur lors de l'exécution de la requête :", error);
        reject(false);
    } finally {
        if (conn) conn.release();
    }
});
}





const afficherLeRepasDuJour = (async function (req, res, next) {
    let conn;
    const date_formate = await conversionDeLaDatePourMariaDB(req.body.data.date);
    if (typeof req.body.data.date == 'undefined' ) {
        console.error("Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! ");
        res.status(500).send({ success: false, error: "Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! " });
    } else {
        try {
            conn = await pool.getConnection();
            // console.log(req.body.data.date);
            // console.log(date_formate);
            // console.log(date_formate.jour);
            
            const query = "SELECT v.nom FROM historiquerepasdesjours h INNER JOIN viandes v ON v.id = h.id_viandes WHERE h.datedujour = '" + date_formate + "'";
            var rows = await conn.query(query);
            // console.log("----------------------------------------------------------");
            // console.log(rows);
            // console.log("----------------------------------------------------------");
            
            if (rows.length > 0) {
                res.status(200).send({ success: true, data: rows });
            } else {
                res.status(200).send({ success: false, message: "Aucun repas disponible" });
            }
        } catch (error) {
            console.error("Erreur lors de l'exécution de la requête :", error);
            res.status(500).send({ success: false, error: "Erreur interne du serveur" });
        } finally {
            if (conn) conn.release(); // Assurez-vous de libérer la connexion
        }
        
    }
});





const afficherLesRepasDeLaSemaine = (async function (req, res, next) {
    const date_formate = await conversionDeLaDatePourMariaDB(req.body.data.date);
    const { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche } = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.data.date);    
    // console.log(req.body.data.date);
    
    const jour = await obtenirLeNomDuJourEnToutesLettres(req.body.data.date);
    let conn = await pool.getConnection();
    if (typeof req.body.data.date == 'undefined' ) {
        console.error("Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! ");
        res.status(500).send({ success: false, error: "Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! " });
    } else {
        try {
            // console.log(date_formate);
            const query = "SELECT v.nom, CASE WHEN h.id_moment = 2 THEN 'midi' WHEN h.id_moment = 3 THEN 'soir' END AS moment, h.datedujour FROM historiquerepasdesjours h INNER JOIN viandes v ON v.id = h.id_viande WHERE h.datedujour = '" + date_formate + "'";
            
                const [nombreDEnregistrement] = await conn.query(query);
                if ([nombreDEnregistrement].length > 0) {                    
                    // const query2 = "SELECT v.nom AS repas, h.datedujour AS date, DAYNAME(h.datedujour) AS jour, CASE WHEN h.id_moment = 2 THEN 'midi' WHEN h.id_moment = 3 THEN 'soir' ELSE 'KO' END AS moment FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viande = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%Y-%m-%d') AND DATE_FORMAT('" + dimanche + "', '%Y-%m-%d') ORDER BY h.datedujour ASC";

                    let query2 = "SELECT v.nom AS repas, ";
                        //   query2 += "h.datedujour AS date,";
                          query2 += "(SELECT ";
                          query2 += "CONCAT( ";
                          query2 += "DAYNAME(h.datedujour), ' ', ";
                          query2 += "DAY(h.datedujour), ' ', ";
                          query2 += "DATE_FORMAT(h.datedujour, '%M %Y')";
                          query2 += ") AS date_formattee ";
                          query2 += "FROM DUAL) AS date,";
                          query2 += "CASE WHEN h.id_moment = 2 THEN 'midi' WHEN h.id_moment = 3 THEN 'soir' ELSE 'KO' END AS moment FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viande = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%Y-%m-%d') AND DATE_FORMAT('" + dimanche + "', '%Y-%m-%d') ORDER BY date DESC";
                    const repas = await conn.query(query2);
                    // console.log(repas);
                    // console.log("----------------------------------------------------------");
                    // console.log(repas);
                    // console.log("----------------------------------------------------------");
                    if (repas.length > 0) {
                        res.status(200).send({ success: true, data: repas });
                    } else {
                        res.status(200).send({ success: false, message: "Aucun repas disponible" });
                    }
                }

        } catch (error) {
            console.error("Erreur lors de l'exécution de la requête :", error);
            res.status(500).send({ success: false, error: "Erreur interne du serveur" });
        } finally {
            if (conn) conn.release(); // Assurez-vous de libérer la connexion
        }
        
    }
});




const recuperationDeLaDate = (async function (req, res, next) {
    // console.log(" req.body.date = " + req.body.date);
    const nouvelleDate = conversionDeLaDate(req.body.date);
    const { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche } = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date);
    // const { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche } = recuperationDeLEnsembleDesJoursDeLaSemaine(req.body.date);

    // console.log("lundi : " + lundi);
    // console.log("dimanche : " + dimanche);
    // console.log("mercredi : " + mercredi);
    // console.log("jeudi : " + jeudi);
    // console.log("vendredi : " + vendredi);
    // console.log("samedi = " + samedi);
    // console.log("dimanche = " + dimanche);

    // console.log("nouvelleDate = " + nouvelleDate);
    // const query = "SELECT * FROM historiquerepasdesjours WHERE datedujour LIKE '?'";
    const query = "SELECT * FROM historiquerepasdesjours WHERE datedujour LIKE '" + nouvelleDate + "'";
    // const query = "SELECT * FROM historiquerepasdesjours";
    let conn;
    try {
        conn = await pool.getConnection();
        // const [nombreDEnregistrement] = await conn.query(query, nouvelleDate);
        const [nombreDEnregistrement] = await conn.query(query);
        // console.log([nombreDEnregistrement]);
        // const nouvelleDate2 = conversionDeLaDate(nombreDEnregistrement.datedujour);
        // console.log("nouvelleDate2 = " + nouvelleDate2);
        // console.log("nombreDEnregistrement.length = " + [nombreDEnregistrement].length);
        if ([nombreDEnregistrement].length > 0) {
            const query2 = "SELECT v.nom, h.datedujour, CASE WHEN h.id_moment = 2 THEN 'midi' WHEN h.id_moment = 3 THEN 'soir' ELSE 'KO' END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viande = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%Y-%m-%d') AND DATE_FORMAT('" + dimanche + "', '%Y-%m-%d') ORDER BY h.datedujour ASC";
            // const query2 = "SELECT h.datedujour FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%d/%m/%Y à %H:%i:%s') AND DATE_FORMAT('" + dimanche + "', '%d/%m/%Y à %H:%i:%s') ORDER BY h.datedujour ASC";
            // const options = { timeZone: 'Europe/Paris' };
            // const lundi_ = lundi.toLocaleString('fr-FR', options);
            // const query2 = "SELECT v.nom, h.datedujour, CASE WHEN h.dejeuner = 1 THEN 'midi' WHEN h.diner = 1 THEN 'soir' ELSE 'KO' END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id WHERE h.datedujour BETWEEN '2023-09-11' AND '2023-09-17' ORDER BY h.datedujour ASC";
            const repas = await conn.query(query2);

            // console.log(repas);

            res.json({
                repas: repas
            });
        } else {
            res.json({ message: "Aucun enregistrement trouvé" });
            // return false; // La date n'existe pas en base de données
        }


        // const query = "SELECT * FROM `historiquerepasdesjours`";
        //     var repas = await conn.query(query);
        //     res.send(repas);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();

    }
});


const afficherRepasDansLHistorique = (async function (req, res, next) {
    
    let conn;
    const date_formate = await conversionDeLaDatePourMariaDB(req.body.data.date);
    if (typeof req.body.data.date == 'undefined' ) {
        console.error("Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! ");
        res.status(500).send({ success: false, error: "Erreur. Impossible de récupérer la date. Date = " + req.body.data.date + " ! " });
    } else {
        try {
            conn = await pool.getConnection();
            // console.log(req.body.data.date);
            // console.log(date_formate);
            // console.log(date_formate.jour);
            
            const query = "SELECT h.datedujour, v.nom, CASE WHEN h.id_moment = 2 THEN 'midi' WHEN h.id_moment = 3 THEN 'soir' END moment FROM historiquerepasdesjours h INNER JOIN viandes v ON v.id = h.id_viande WHERE h.datedujour = '" + date_formate + "' AND h.id_moment = ( SELECT id FROM moments WHERE nom = '" +req.body.data.moment + "')";
            var rows = await conn.query(query);

            if (rows.length > 0) {
                res.status(200).send({ success: true, data: rows });
            } else {
                res.status(200).send({ success: false, message: "Aucun repas disponible" });
            }
        } catch (error) {
            console.error("Erreur lors de l'exécution de la requête :", error);
            res.status(500).send({ success: false, error: "Erreur interne du serveur" });
        } finally {
            if (conn) conn.release(); // Assurez-vous de libérer la connexion
        }
        
    }
    
});




const ajoutDuRepasDansLHistorique = (async function (req, res, next) {
    // Formater la date afin qu'elle puisse correspondre avec une date de MariaDB
    // console.log("req.body.date = " + req.body.date );
    const ancienn_date = req.body.date;
    // console.log("Ancienne date = " + ancienn_date);
    
    // const regex = /(\w+) (\d{1,2}) (\w+) (\d{4})/;
    const regex = /\w+\s+(\d{1,2})\s+([\wéèêëàâäôöûüç-]+)\s+(\d{4})/i;

    const match = ancienn_date.match(regex);
    let date_formate;   
    if (!match) {
        // console.log("non match");
        date_formate = await conversionDeLaDatePourMariaDB(ancienn_date);
    } else {
        // console.log("match");
        date_formate = await transformer_une_date(ancienn_date);
        date_formate = await conversionDeLaDatePourMariaDB(date_formate);
    }

    // console.log("date_formate = " + date_formate);
    
    const verif_viande = await estPresenteTViande(req.body.repas);
    const verif_historique = await estPresenteTHistoriqueRepasDesJours(req.body.repas,date_formate,req.body.moment);

    if (verif_viande) {
        if (verif_historique){
            res.status(200).send({ success: true, message: "Le repas existe déjà dans l'historique." });
        } else {
            await requete_ajout_historique(req.body.repas,date_formate,req.body.moment);
            res.status(200).send({ success: true, message: "Ajout du repas " + req.body.repas + " dans l'historique !"});
        }
    } else {
        await nom_de_viande_a_ajouter(req.body.repas);
        if (verif_historique){
            res.status(200).send({ success: true, message: "Le repas existe dans l'historique mais pas dans la table viande" });
        } else {
            await requete_ajout_historique(req.body.repas,date_formate,req.body.moment);
            res.status(200).send({ success: true, message: "Ajout du repas " + req.body.repas + " dans l'historique et dans la table viande !"});
        }
    }
});



const supprimerRepasDansLHistorique = (async function (req, res, next) {
    // Formater la date afin qu'elle puisse correspondre avec une date de MariaDB
    const date_formate = await conversionDeLaDatePourMariaDB(req.body.date);
    const verif_historique = await estPresenteTHistoriqueRepasDesJours(req.body.repas,date_formate,req.body.moment);


    if (verif_historique){
        await requete_suppression_historique(req.body.repas,date_formate,req.body.moment);
        res.status(200).send({ success: true, message: "Suppression du repas " + req.body.repas + " dans l'historique !"});
    } else {
        res.status(200).send({ success: true, message: "Le repas n'existe pas. Inutile de le supprimer" });
    }
});



const ajoutDesRepasDeLaSemaine = (async function (req, res, next) {
    const lundi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_lundi);
    const mardi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_mardi);
    const mercredi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_mercredi);
    const jeudi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_jeudi);
    const vendredi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_vendredi);
    const samedi = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_samedi);
    let dimanche = await recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_dimanche);
    
    
    // console.log(req.body.date_dimanche);
    // console.log(req.body.repas_dimanche);
    // dimanche.dimanche.setDate(dimanche.dimanche.getDate() - 7);
    // console.log("Date dimanche = " + dimanche.dimanche );
    // res.json({ message: "Aucun enregistrement trouvé",
    //            requete: req.body });

    let query = "INSERT INTO `historiquerepasdesjours`(`id_viande`, `datedujour`, `id_moment`)";
    query += " VALUES ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_lundi + "'),'" + lundi.lundi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_mardi + "'),'" + mardi.mardi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_mercredi + "'),'" + mercredi.mercredi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_jeudi + "'),'" + jeudi.jeudi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_vendredi + "'),'" + vendredi.vendredi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_samedi_midi + "'),'" + samedi.samedi + "', '2'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_samedi + "'),'" + samedi.samedi + "', '3'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_dimanche_midi + "'),DATE_SUB('" + dimanche.dimanche + "',INTERVAL 7 DAY), '2'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_dimanche + "'),DATE_SUB('" + dimanche.dimanche + "',INTERVAL 7 DAY), '3')";
    let conn;
    try {
        conn = await pool.getConnection();
        const retourDInformation = await conn.query(query);
        // console.log("retourDInformation = " + retourDInformation);
        res.json({
            message: "Les repas ont été insérés"
        });
    } catch (err) {
        // console.log(err);
        console.error(err);
        throw err;
    } finally {
        if (conn) return conn.release();

    }
});


function envoyerLaSemaine() {
    if (recuperationDeLaDate) {
        // res
    }
}


function conversionDeLaDate(dateRecu) {
    // Date initiale au format donné

    const initialDate = new Date(dateRecu);

    // Soustrayez 3 jours de la date initiale pour obtenir la date souhaitée
    initialDate.setDate(initialDate.getDate() - 3);

    // Obtenez la nouvelle date au format "YYYY-MM-DD"
    const nouvelleDate = initialDate.toISOString().split('T')[0];
    // console.log("Nouvelle date : ", nouvelleDate);
    return nouvelleDate;
}



async function conversionDeLaDatePourMariaDB(date) {
    return new Promise(async (resolve) => {

    // Créez un objet Date à partir de la chaîne de caractères
    var dateObj = new Date(date);

    // Obtenez l'année, le mois et le jour de la date
    var year = dateObj.getFullYear();
    var month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Ajoutez 1 au mois car il est basé sur 0-index
    var day = dateObj.getDate().toString().padStart(2, '0');

    // Créez la nouvelle chaîne de caractères au format "yyyy-MM-dd"
    var formattedDate = `${year}-${month}-${day}`;
    resolve(formattedDate);
    });
}



function recuperationDeLEnsembleDesJoursDeLaSemaine(date) {
    const inputDate = new Date(date);
    const dayOfWeek = inputDate.getDay(); // 0 (dimanche) à 6 (samedi)

    // Pour revenir au début de la semaine (dimanche), soustrayez le jour de la semaine
    const dimanche = new Date(inputDate);
    dimanche.setDate((inputDate.getDate() - dayOfWeek) + 7);

    // Pour obtenir la fin de la semaine (samedi), ajoutez 6 jours à la date de début
    // const samedi = new Date(dimanche);
    // samedi.setDate(dimanche.getDate() + 6);
    const samedi = new Date(dimanche);
    samedi.setDate(dimanche.getDate() - 1);

    const vendredi = new Date(samedi);
    vendredi.setDate(samedi.getDate() - 1);

    const jeudi = new Date(vendredi);
    jeudi.setDate(vendredi.getDate() - 1);

    const mercredi = new Date(jeudi);
    mercredi.setDate(jeudi.getDate() - 1);

    const mardi = new Date(mercredi);
    mardi.setDate(mercredi.getDate() - 1);

    const lundi = new Date(mardi);
    lundi.setDate(mardi.getDate() - 1);

    return { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche };
}




async function recuperationDeLEnsembleDesJoursDeLaSemaineFormater(date) {
    return new Promise(async (resolve) => {        
        const inputDate = new Date(date);
        const dayOfWeek = inputDate.getDay(); // 0 (dimanche) à 6 (samedi)


        // Pour revenir au début de la semaine (dimanche), soustrayez le jour de la semaine
        let dimanche = new Date(inputDate);
        dimanche.setDate((inputDate.getDate() - dayOfWeek) + 7);

        // Pour obtenir la fin de la semaine (samedi), ajoutez 6 jours à la date de début
        // const samedi = new Date(dimanche);
        // samedi.setDate(dimanche.getDate() + 6);
        let samedi = new Date(dimanche);
        samedi.setDate(dimanche.getDate() - 1);
        let vendredi = new Date(samedi);
        vendredi.setDate(samedi.getDate() - 1);
        let jeudi = new Date(vendredi);
        jeudi.setDate(vendredi.getDate() - 1);
        let mercredi = new Date(jeudi);
        mercredi.setDate(jeudi.getDate() - 1);
        let mardi = new Date(mercredi);
        mardi.setDate(mercredi.getDate() - 1);
        let lundi = new Date(mardi);
        lundi.setDate(mardi.getDate() - 1);
        dimanche = await conversionDeLaDatePourMariaDB(dimanche);
        samedi = await conversionDeLaDatePourMariaDB(samedi);
        vendredi = await conversionDeLaDatePourMariaDB(vendredi);
        jeudi = await conversionDeLaDatePourMariaDB(jeudi);
        mercredi = await conversionDeLaDatePourMariaDB(mercredi);
        mardi = await conversionDeLaDatePourMariaDB(mardi);
        lundi = await conversionDeLaDatePourMariaDB(lundi);
        
        // console.log(lundi);
        // console.log(mardi);
        
        resolve({ lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche});

    });
}




async function obtenirLeNomDuJourEnToutesLettres(dateString){
    return new Promise((resolve) => {
        const date = new Date(dateString);
        const jourEnToutesLettres = date.toLocaleDateString("fr-FR", { weekday: "long" });
        // console.log(jourEnToutesLettres);
        resolve(jourEnToutesLettres);
    });
}



// Transformer une date de "jeudi 6 février 2025" en "05-02-25"
async function transformer_une_date(ancienne_date){
    return new Promise((resolve, reject) => {


        // Tableau des mois en français
        const moisFr = {
            "janvier": "01",
            "février": "02",
            "mars": "03",
            "avril": "04",
            "mai": "05",
            "juin": "06",
            "juillet": "07",
            "août": "08",
            "septembre": "09",
            "octobre": "10",
            "novembre": "11",
            "décembre": "12"
        };
    
        // Regex pour extraire le jour, le mois et l'année
        const regex = /\w+\s+(\d{1,2})\s+([\wéèêëàâäôöûüç-]+)\s+(\d{4})/i;
        const match = ancienne_date.match(regex);
    
        if (!match) {
            reject("Format de date incorrect");
        }
    
        let [_, jour, mois, annee] = match;
        
        // Ajout de zéro si le jour est sur un chiffre
        jour = jour.padStart(2, '0');
        
        // Conversion du mois en nombre
        const moisNum = moisFr[mois.toLowerCase()];
        
        if (!moisNum) {
            reject("Mois non reconnu");
        }
    
        // Récupérer les deux derniers chiffres de l'année
        annee = annee.slice(-2);
    
        // Format final
        resolve(`${jour}-${moisNum}-${annee}`);
    });
}




module.exports = {
    afficherLesRepasDeLaSemaine,
    afficherLeRepasDuJour,
    recuperationDeLaDate,
    ajoutDesRepasDeLaSemaine,
    ajoutDuRepasDansLHistorique,
    afficherRepasDansLHistorique,
    supprimerRepasDansLHistorique
};