var express = require('express');
var router = express.Router();
const { afficherLesRepasDeLaSemaine, recuperationDeLaDate } = require('../controller/controllerHistoriqueRepasDesJours');

router.get('/', afficherLesRepasDeLaSemaine);
router.post('/date', recuperationDeLaDate);

// router.post('/ajouter', ajouterRepasduJourDansViandes);
// router.delete('/supprimer', supprimerRepasDuJourVendredi);

module.exports = router;