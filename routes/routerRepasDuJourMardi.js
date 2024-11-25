var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'mardi'}));
router.get('/midi', afficherRepasDuJour({ jour: 'mardi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'mardi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'mardi'}));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'mardi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'mardi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'mardi'}));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'mardi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'mardi', moment: 'soir' }));

module.exports = router;