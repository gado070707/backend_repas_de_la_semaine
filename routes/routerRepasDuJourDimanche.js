var express = require('express');
var router = express.Router();
const { afficherRepasDuJourMercredi, ajouterRepasduJourDansViandes, supprimerRepasDuJourMercredi } = require('../controller/controllerRepasDuJourMercredi')

router.get('/', afficherRepasDuJourMercredi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourMercredi);

module.exports = router;