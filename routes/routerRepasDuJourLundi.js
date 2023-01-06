var express = require('express');
var router = express.Router();
const { afficherRepasDuJourLundi, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJourLundi')

router.get('/', afficherRepasDuJourLundi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
// router.delete('/lundi/supprimer', supprimerRepasDuJourLundi);

module.exports = router;