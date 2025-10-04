var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'lundi'}));
router.get('/midi', afficherRepasDuJour({ jour: 'lundi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'lundi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'lundi'}));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'lundi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'lundi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'lundi'}));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'lundi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'lundi', moment: 'soir' }));

module.exports = router;