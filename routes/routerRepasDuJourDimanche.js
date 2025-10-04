var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'dimanche' }));
router.get('/midi', afficherRepasDuJour({ jour: 'dimanche', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'dimanche', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'dimanche' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'dimanche', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'dimanche', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'dimanche' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'dimanche', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'dimanche', moment: 'soir' }));

module.exports = router;