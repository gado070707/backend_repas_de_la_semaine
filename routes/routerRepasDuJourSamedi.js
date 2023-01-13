var express = require('express');
var router = express.Router();
const { afficherRepasDuJourSamedi, ajouterRepasduJourDansViandes, supprimerRepasDuJourSamedi } = require('../controller/controllerRepasDuJourSamedi')

router.get('/', afficherRepasDuJourSamedi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourSamedi);

module.exports = router;