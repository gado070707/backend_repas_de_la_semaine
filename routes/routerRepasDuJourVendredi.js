var express = require('express');
var router = express.Router();
const { afficherRepasDuJourVendredi, ajouterRepasduJourDansViandes, supprimerRepasDuJourVendredi } = require('../controller/controllerRepasDuJourVendredi')

router.get('/', afficherRepasDuJourVendredi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourVendredi);

module.exports = router;