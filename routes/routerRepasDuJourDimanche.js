var express = require('express');
var router = express.Router();
const { afficherRepasDuJourDimanche, ajouterRepasduJourDansViandes, supprimerRepasDuJourDimanche } = require('../controller/controllerRepasDuJourDimanche')

router.get('/', afficherRepasDuJourDimanche);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourDimanche);

module.exports = router;