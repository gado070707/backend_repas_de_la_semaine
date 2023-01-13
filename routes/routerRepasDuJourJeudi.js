var express = require('express');
var router = express.Router();
const { afficherRepasDuJourJeudi, ajouterRepasduJourDansViandes, supprimerRepasDuJourJeudi } = require('../controller/controllerRepasDuJourJeudi')

router.get('/', afficherRepasDuJourJeudi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourJeudi);

module.exports = router;