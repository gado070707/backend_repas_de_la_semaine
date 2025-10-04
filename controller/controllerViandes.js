const pool = require('../conf/bdd')

const afficherViandes = (async function (req, res, next){    
  let conn;

  conn;
  try {
      // establish a connection to MariaDB
      conn = await pool.getConnection();

      // create a new query
      var query = "select * from viandes";

      // execute the query and set the result to a new variable
      var rows = await conn.query(query);

      // return the results
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



const supprimerViande = (async function (req, res, next){    
    let conn;
    try {
        conn = await pool.getConnection();
        var query1 = "SELECT * FROM viandes WHERE nom = '" + req.body.nom + "'";
        var rows1 = await conn.query(query1);
        if((typeof rows1[0]) !== "undefined"){
            console.log("if = query1[0].nom = " +  rows1[0].nom);
            var query2 = "DELETE FROM viandes WHERE nom = '" + req.body.nom + "'";
            var rows2 = await conn.query(query2);
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



const ajouterViande = ( async function(req, res, next) {
    verification_de_la_presence_du_parametre_req_body(req,res,next).then(async ()=>{
    // Check mandatory request parameters
        if (!req.body.nom) {
            return res.status(400).json({ error: 'Il manque le paramètre' });
        }   

        // Check if account already exists
        verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd(req.body.nom).then(function (nom_bdd) { 
            console.log(nom_bdd + " VS " + req.body.nom);
            if (nom_bdd == req.body.nom) {
                return res.status(409).json({ error: 'La viandes existe déjà ok ok' });
            }
            else{
                nom_de_viande_a_ajouter(req.body.nom)
                res.status(200).json({ message: "La viande a été ajoutée correctement"});
            }
        });
    });
});

  

async function nom_de_viande_a_ajouter (nom){    
    try {
        conn = await pool.getConnection();
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




async function verification_de_la_presence_du_nom_de_la_viande_dans_la_bdd(req_nom){
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



module.exports = { afficherViandes, afficherViande, supprimerViande, ajouterViande };