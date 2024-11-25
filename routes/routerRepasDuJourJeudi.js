var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'jeudi'}));
router.get('/midi', afficherRepasDuJour({ jour: 'jeudi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'jeudi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'jeudi' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'jeudi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'jeudi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'jeudi' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'jeudi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'jeudi', moment: 'soir' }));

module.exports = router;