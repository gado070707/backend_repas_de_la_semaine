var express = require('express');
var router = express.Router();
const { afficherRepasDuJour, supprimerRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')
router.get('/', afficherRepasDuJour({ jour: 'vendredi' }));
router.get('/midi', afficherRepasDuJour({ jour: 'vendredi', moment: 'midi' }));
router.get('/soir', afficherRepasDuJour({ jour: 'vendredi', moment: 'soir' }));
router.post('/ajouter', ajouterRepasduJourDansViandes({ jour: 'vendredi' }));
router.post('/ajouter/midi', ajouterRepasduJourDansViandes({ jour: 'vendredi', moment: 'midi' }));
router.post('/ajouter/soir', ajouterRepasduJourDansViandes({ jour: 'vendredi', moment: 'soir' }));
router.delete('/supprimer', supprimerRepasDuJour({ jour: 'vendredi' }));
router.delete('/supprimer/midi', supprimerRepasDuJour({ jour: 'vendredi', moment: 'midi' }));
router.delete('/supprimer/soir', supprimerRepasDuJour({ jour: 'vendredi', moment: 'soir' }));

module.exports = router;