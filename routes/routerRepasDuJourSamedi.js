var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'samedi' }));
router.get('/midi', afficherRepasDuJour({ jour: 'samedi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'samedi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'samedi' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'samedi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'samedi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'samedi' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'samedi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'samedi', moment: 'soir' }));

module.exports = router;