var express = require('express');
var router = express.Router();
const { afficherLesRepasDeLaSemaine, recuperationDeLaDate, ajoutDesRepasDeLaSemaine } = require('../controller/controllerHistoriqueRepasDesJours');

router.get('/', afficherLesRepasDeLaSemaine);
router.post('/date', recuperationDeLaDate);
router.post('/semaine', ajoutDesRepasDeLaSemaine);

// router.post('/ajouter', ajouterRepasduJourDansViandes);
// router.delete('/supprimer', supprimerRepasDuJourVendredi);

module.exports = router;