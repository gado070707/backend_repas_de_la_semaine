var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'semaine' }));
router.get('/midi', afficherRepasDuJour({ jour: 'semaine', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'semaine', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'semaine' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'semaine', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'semaine', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'semaine' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'semaine', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'semaine', moment: 'soir' }));

module.exports = router;