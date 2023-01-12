var express = require('express');
var router = express.Router();
const { afficherRepasDuJourMardi, ajouterRepasduJourDansViandes, supprimerRepasDuJourMardi } = require('../controller/controllerRepasDuJourMardi')

router.get('/', afficherRepasDuJourMardi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourMardi);

module.exports = router;