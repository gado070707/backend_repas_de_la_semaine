var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'mercredi'}));
router.get('/midi', afficherRepasDuJour({ jour: 'mercredi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'mercredi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'mercredi' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'mercredi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'mercredi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'mercredi' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'mercredi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'mercredi', moment: 'soir' }));

module.exports = router;