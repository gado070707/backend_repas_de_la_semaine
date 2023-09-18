const pool = require('../conf/bdd/bdd')

const afficherLesRepasDeLaSemaine = (async function (req, res, next){    
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



const recuperationDeLaDate = (async function (req, res, next){
    console.log(" req.body.date = " + req.body.date);
    const nouvelleDate = conversionDeLaDate(req.body.date);
    console.log("nouvelleDate = " + nouvelleDate);
    // const query = "SELECT * FROM historiquerepasdesjours WHERE datedujour LIKE '?'";
    const query = "SELECT * FROM historiquerepasdesjours WHERE datedujour LIKE '" + nouvelleDate + "'";
    // const query = "SELECT * FROM historiquerepasdesjours";
    let conn;
    try {
        conn = await pool.getConnection();
    // const [nombreDEnregistrement] = await conn.query(query, nouvelleDate);
    const [nombreDEnregistrement] = await conn.query(query);
    console.log([nombreDEnregistrement]);
    // const nouvelleDate2 = conversionDeLaDate(nombreDEnregistrement.datedujour);
    // console.log("nouvelleDate2 = " + nouvelleDate2);
    console.log("nombreDEnregistrement.length = " + [nombreDEnregistrement].length);
    if ([nombreDEnregistrement].length > 0) {
        res.json({ message: "Nombre d'enregistrement ", Nombre: [nombreDEnregistrement].length });
        // return true; // La date existe en base de données
      } else {
          res.json({ message: "Nombre d'enregistrement ", Nombre: [nombreDEnregistrement].length });
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



function envoyerLaSemaine(){
    if (recuperationDeLaDate){
        // res
    }
}


function conversionDeLaDate(dateRecu){
// Date initiale au format donné

const initialDate = new Date(dateRecu);

// Soustrayez 3 jours de la date initiale pour obtenir la date souhaitée
initialDate.setDate(initialDate.getDate() - 3);

// Obtenez la nouvelle date au format "YYYY-MM-DD"
const nouvelleDate = initialDate.toISOString().split('T')[0];
console.log("Nouvelle date : ", nouvelleDate);
return nouvelleDate;
}




module.exports = {
    afficherLesRepasDeLaSemaine,
    recuperationDeLaDate
};