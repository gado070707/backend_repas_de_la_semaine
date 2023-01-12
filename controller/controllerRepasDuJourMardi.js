const pool = require('../conf/bdd/bdd')

console.log("Connexion bdd ok");

const afficherRepasDuJourMardi = (async function (req, res, next){    
  let conn;
  conn;
  try {
      conn = await pool.getConnection();
      var query = "select v.nom AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viandes INNER JOIN `jours` j ON j.id = r.id_jours WHERE j.nom LIKE 'Mardi'";
      var rows = await conn.query(query);
      res.send(rows);
  } catch (err) {
      throw err;
  } finally {
      if (conn) return conn.release();
  }
});



const afficherViande = (async function (req, res, next){    
  let conn;
  try {
      conn = await pool.getConnection();
      var query = "select * from viandes WHERE nom = '" + req.body.nom + "'";
      var rows = await conn.query(query);
    //   var rows = await conn.query(query, req.params.id, function (error, rows) {
        // console.error(error);
        // console.log(rows);
    //    });
    res.send(rows);
  } catch (err) {
      throw err;
  } finally {
      if (conn) return conn.release();
  }

});



const supprimerRepasDuJourMardi = (async function (req, res, next){    
    let conn;
    console.log("supprimer req.body.nom = " + req.body.nom);

    verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(req.body.nom).then(async function (id){
        console.log("id = " + id);
        try {
            conn = await pool.getConnection();
            // var query = "DELETE FROM `repas du jour` WHERE id_viandes = ( SELECT id FROM viandes WHERE nom LIKE '" + req.body.nom + "'";
            var query = "DELETE FROM `repas du jour` WHERE id_viandes = " + id;
            console.log("query = " + query);
            var rows = await conn.query(query);
            console.log("typeof rows[0] = " + typeof rows[0]);
            console.log(rows[0]);
            if((typeof rows[0]) != "undefined"){
                res.status(200).json({ message: "La viande a été supprimée correctement"});
            }
            else{
                res.status(200).json({ message: "La viande n'existe pas et ne peut donc pas être supprimée"});
            }
    
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.release();
        }

    });
  });



const ajouterRepasduJourDansViandes = ( async function(req, res, next) {
    console.log("AjouterViande : " + req.body.nom);
    verification_de_la_presence_du_parametre_req_body(req,res,next).then(async ()=>{
    // Check mandatory request parameters

        if (!req.body.nom) {
            console.log("req.body.nom = " + req.body.nom);
            return res.status(400).json({ error: 'Il manque le paramètre' });
        }   

        // Check if account already exists
        verification_de_la_presence_du_nom_de_la_viande_dans_la_table_viandes(req.body.nom).then(function (nom_bdd) { 
            console.log(nom_bdd + " VS " + req.body.nom);
            if (nom_bdd == req.body.nom) {
                ajouterRepasDuJourMardi(req.body.nom);
                return res.status(200).json({ error: 'La repas sera ajouté à mardi' });
                // return res.status(409).json({ error: 'La repas sera ajouté à mardi' });
                // return 90;
            }
            else{
                nom_de_viande_a_ajouter(req.body.nom).then(()=>{
                    ajouterRepasDuJourMardi(req.body.nom);
                });
                res.status(200).json({ message: "La viande a été ajoutée correctement"});
            }
        });
    });
});



async function ajouterRepasDuJourMardi(reponse){
    console.log(" reponse : " + reponse);
    verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(reponse).then(async function(data) {
        // console.log("data = " +  data);
        // console.log("typeof data = " + typeof data);
        if(data == null){
            console.log("data = " + data);
            try {
                conn = await pool.getConnection();
                var query = "INSERT INTO `repas du jour`(`id_jours`, `id_viandes`) VALUES ((SELECT id FROM jours WHERE nom = 'Mardi'),(SELECT id FROM viandes WHERE nom LIKE '"+reponse+"'));";
                // var query = "INSERT INTO viandes VALUES (" + ((await id_max()) + 1) + "," + "'"+nom+"'" + ")";
                await conn.query(query)
            } catch (err) {
                throw err;
            } finally {
                if (conn) await conn.release();
            }
        }
        else{
            console.log("SINON data = " + data);
            return null;
        }
    });
};

  

async function nom_de_viande_a_ajouter (nom){    
    try {
        conn = await pool.getConnection();
        // var query = "INSERT INTO `repas du jour`(`id_jours`, `id_viandes`) VALUES (1," + "'"+nom+"'" + ")";
        var query = "INSERT INTO viandes VALUES (" + ((await id_max()) + 1) + "," + "'"+nom+"'" + ")";
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



async function verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd_table_repasdujour(req_nom){
    try {
        conn = await pool.getConnection();
        console.log("req_nom = " + req_nom);
        var query = "select r.id_viandes AS VIANDES FROM `repas du jour` r INNER JOIN `viandes` v ON v.id = r.id_viandes INNER JOIN `jours` j ON j.id = r.id_jours WHERE j.nom LIKE 'Mardi' AND r.id_viandes LIKE ( SELECT v.id FROM viandes v WHERE v.nom LIKE '"+req_nom+"')";
        var bdd_nom = await conn.query(query);
        // console.log("bdd_nom[0] = " + bdd_nom[0].VIANDES);
        if(typeof bdd_nom[0] != "undefined"){
            console.log("SI = " + bdd_nom[0].VIANDES);
            return bdd_nom[0].VIANDES;
        }
        else{
            console.log("SINON = " + bdd_nom[0]);
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
    afficherRepasDuJourMardi, 
    ajouterRepasduJourDansViandes,
    supprimerRepasDuJourMardi
};