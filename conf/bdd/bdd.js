// import mariadb
var mariadb = require('mariadb');

// create a new connection pool
const pool = mariadb.createPool({  
  host: "10.5.0.2",
  user: "root", 
  password: "root",
  database: "repas"
});

// expose the ability to create new connections
module.exports={
    getConnection: function(){
      return new Promise(function(resolve,reject){
        pool.getConnection().then(function(connection){
          resolve(connection);
        }).catch(function(error){
          reject(error);
        });
      });
    }
  } 