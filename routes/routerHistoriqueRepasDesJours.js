var express = require('express');
var router = express.Router();
const { afficherLeRepasDuJour, afficherLesRepasDeLaSemaine, afficherRepasDansLHistorique, recuperationDeLaDate, ajoutDesRepasDeLaSemaine, ajoutDuRepasDansLHistorique, supprimerRepasDansLHistorique } = require('../controller/controllerHistoriqueRepasDesJours');

router.post('/date', recuperationDeLaDate);
router.post('/semaine', ajoutDesRepasDeLaSemaine);

// router.get('/', afficherLeRepasDuJour);
// router.get('/', afficherLesRepasDeLaSemaine);
router.post('/', afficherLesRepasDeLaSemaine);
router.get('/midi', afficherRepasDansLHistorique);
router.get('/soir', afficherRepasDansLHistorique);
router.post('/ajouter', ajoutDuRepasDansLHistorique);
router.post('/ajouter/midi', ajoutDuRepasDansLHistorique);
router.post('/ajouter/soir', ajoutDuRepasDansLHistorique);
router.delete('/supprimer', supprimerRepasDansLHistorique);
router.delete('/supprimer/midi', supprimerRepasDansLHistorique);
router.delete('/supprimer/soir', supprimerRepasDansLHistorique);

module.exports = router;