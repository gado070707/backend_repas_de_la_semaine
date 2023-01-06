var express = require('express');
var router = express.Router();
const { afficherRepasDuJourLundi } = require('../controller/controllerRepasDuJour')

/* GET viandes page. */
// router.get('/', afficherRepasDuJourLundi);
router.get('/lundi', afficherRepasDuJourLundi);
// router.post('/lundi/ajouter', ajouterRepasDuJourLundi);
// router.delete('/lundi/supprimer', supprimerRepasDuJourLundi);

module.exports = router;