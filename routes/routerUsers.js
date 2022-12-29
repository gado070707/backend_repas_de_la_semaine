var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("Création d'un utilisateur");
});

module.exports = router;
