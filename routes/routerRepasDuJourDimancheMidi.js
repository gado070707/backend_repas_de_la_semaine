var express = require('express');
var router = express.Router();
const { afficherRepasDuJourDimancheMidi, ajouterRepasduJourDansViandes, supprimerRepasDuJourDimancheMidi } = require('../controller/controllerRepasDuJourDimancheMidi')

router.get('/', afficherRepasDuJourDimancheMidi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourDimancheMidi);

module.exports = router;