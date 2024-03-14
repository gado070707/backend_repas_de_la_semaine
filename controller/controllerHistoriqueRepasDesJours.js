const pool = require('../conf/bdd/bdd')

const afficherLesRepasDeLaSemaine = (async function (req, res, next) {
    let conn;
    try {
        conn = await pool.getConnection();
        //   var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viandes INNER JOIN `jours` j ON j.id = r.id_jours WHERE j.nom LIKE 'Vendredi'";
        // var query = "SELECT v.nom, h.datedujour, " +
        //       const query1 = "SELECT v.nom, h.datedujour, "
        // const query2 = "CASE"
        // const query3 = "WHEN h.dejeuner = 1 THEN 'Déjeuner'"
        // const query4 = "WHEN h.diner = 1 THEN 'Dîner'"
        // const query5 = "ELSE 'KO'"
        // const query6 = "END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id";
        // var query = query1 + query2 + query3 + query4 + query5 + query6;

        const query = "SELECT v.nom, h.datedujour, CASE WHEN h.dejeuner = 1 THEN 'Déjeuner' WHEN h.diner = 1 THEN 'Dîner' ELSE 'KO' END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id";
        var rows = await conn.query(query);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();
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
    console.log("samedi = " + samedi);
    console.log("dimanche = " + dimanche);

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
            const query2 = "SELECT v.nom, h.datedujour, CASE WHEN h.dejeuner = 1 THEN 'Déjeuner' WHEN h.diner = 1 THEN 'Dîner' ELSE 'KO' END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%Y-%m-%d') AND DATE_FORMAT('" + dimanche + "', '%Y-%m-%d') ORDER BY h.datedujour ASC";
            // const query2 = "SELECT h.datedujour FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id WHERE h.datedujour BETWEEN DATE_FORMAT('" + lundi + "', '%d/%m/%Y à %H:%i:%s') AND DATE_FORMAT('" + dimanche + "', '%d/%m/%Y à %H:%i:%s') ORDER BY h.datedujour ASC";
            // const options = { timeZone: 'Europe/Paris' };
            // const lundi_ = lundi.toLocaleString('fr-FR', options);
            // const query2 = "SELECT v.nom, h.datedujour, CASE WHEN h.dejeuner = 1 THEN 'Déjeuner' WHEN h.diner = 1 THEN 'Dîner' ELSE 'KO' END AS MOMENT FROM `historiquerepasdesjours` h LEFT JOIN `viandes` v ON v.id = h.id_viande LEFT JOIN `repas du jour` r ON r.id_viandes = v.id WHERE h.datedujour BETWEEN '2023-09-11' AND '2023-09-17' ORDER BY h.datedujour ASC";
            const repas = await conn.query(query2);

            console.log(repas);

            res.json({
                repas: repas
            });
        } else {
            res.json({ message: "Aucun enregistrement trouvé" });
            // return false; // La date n'existe pas en base de données
        }


        // const query = "SELECT * FROM `historiquerepasdesjours`";
        //     var rows = await conn.query(query);
        //     res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.release();

    }
});


const ajoutDesRepasDeLaSemaine = (async function (req, res, next) {
    const lundi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_lundi);
    const mardi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_mardi);
    const mercredi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_mercredi);
    const jeudi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_jeudi);
    const vendredi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_vendredi);
    const samedi = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_samedi);
    let dimanche = recuperationDeLEnsembleDesJoursDeLaSemaineFormater(req.body.date_dimanche);
    
    
    console.log(req.body.date_dimanche);
    console.log(req.body.repas_dimanche);
    // dimanche.dimanche.setDate(dimanche.dimanche.getDate() - 7);
    console.log("Date dimanche = " + dimanche.dimanche );
    // res.json({ message: "Aucun enregistrement trouvé",
    //            requete: req.body });

    let query = "INSERT INTO `historiquerepasdesjours`(`id_viande`, `datedujour`, `dejeuner`, `diner`)";
    query += " VALUES ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_lundi + "'),'" + lundi.lundi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_mardi + "'),'" + mardi.mardi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_mercredi + "'),'" + mercredi.mercredi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_jeudi + "'),'" + jeudi.jeudi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_vendredi + "'),'" + vendredi.vendredi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_samedi_midi + "'),'" + samedi.samedi + "', '0', '1'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_samedi + "'),'" + samedi.samedi + "', '1', '0'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_dimanche_midi + "'),DATE_SUB('" + dimanche.dimanche + "',INTERVAL 7 DAY), '0', '1'),";
    query += " ((SELECT MAX(v.id) FROM `viandes` v WHERE v.nom = '" + req.body.repas_dimanche + "'),DATE_SUB('" + dimanche.dimanche + "',INTERVAL 7 DAY), '1', '0')";
    let conn;
    try {
        conn = await pool.getConnection();
        const retourDInformation = await conn.query(query);
        console.log("retourDInformation = " + retourDInformation);
        res.json({
            message: "Les repas ont été insérés"
        });
    } catch (err) {
        console.log(err);
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



function conversionDeLaDatePourMariaDB(date) {
    // Créez un objet Date à partir de la chaîne de caractères
    var dateObj = new Date(date);

    // Obtenez l'année, le mois et le jour de la date
    var year = dateObj.getFullYear();
    var month = (dateObj.getMonth() + 1).toString().padStart(2, '0'); // Ajoutez 1 au mois car il est basé sur 0-index
    var day = dateObj.getDate().toString().padStart(2, '0');

    // Créez la nouvelle chaîne de caractères au format "yyyy-MM-dd"
    var formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
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




function recuperationDeLEnsembleDesJoursDeLaSemaineFormater(date) {
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
    dimanche = conversionDeLaDatePourMariaDB(dimanche)
    samedi = conversionDeLaDatePourMariaDB(samedi)
    vendredi = conversionDeLaDatePourMariaDB(vendredi)
    jeudi = conversionDeLaDatePourMariaDB(jeudi)
    mercredi = conversionDeLaDatePourMariaDB(mercredi)
    mardi = conversionDeLaDatePourMariaDB(mardi)
    lundi = conversionDeLaDatePourMariaDB(lundi)
    return { lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche };
}





module.exports = {
    afficherLesRepasDeLaSemaine,
    recuperationDeLaDate,
    ajoutDesRepasDeLaSemaine
};