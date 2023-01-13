var express = require('express');
var router = express.Router();
const { afficherRepasDuJourSamediMidi, ajouterRepasduJourDansViandes, supprimerRepasDuJourSamediMidi } = require('../controller/controllerRepasDuJourSamediMidi')

router.get('/', afficherRepasDuJourSamediMidi);
router.post('/ajouter', ajouterRepasduJourDansViandes);
router.delete('/supprimer', supprimerRepasDuJourSamediMidi);

module.exports = router;