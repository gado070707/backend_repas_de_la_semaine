var express = require('express');
var router = express.Router();
const { afficherRepasDuJourLundi, ajouterRepasduJourDansViandes, supprimerRepasDuJourLundi } = require('../controller/controllerRepasDuJourLundi')

router.get('/', afficherRepasDuJourLundi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourLundi);

module.exports = router;