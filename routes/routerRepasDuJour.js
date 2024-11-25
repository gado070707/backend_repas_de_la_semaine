var express = require('express');
var router = express.Router();
var routerRepasDuJourLundi = require('./routerRepasDuJourLundi');
var routerRepasDuJourMardi = require('./routerRepasDuJourMardi');
var routerRepasDuJourMercredi = require('./routerRepasDuJourMercredi');
var routerRepasDuJourJeudi = require('./routerRepasDuJourJeudi');
var routerRepasDuJourVendredi = require('./routerRepasDuJourVendredi');
var routerRepasDuJourSamedi = require('./routerRepasDuJourSamedi');
var routerRepasDuJourDimanche = require('./routerRepasDuJourDimanche');
var routerRepasDuJourSemaine = require('./routerRepasDuJourSemaine');
var routerHistoriqueRepasDesJours = require('./routerHistoriqueRepasDesJours');
const { afficherRepasDuJour, ajouterRepasduJourDansViandes } = require('../controller/controllerRepasDuJour')


router.use('/lundi', routerRepasDuJourLundi);
router.use('/mardi', routerRepasDuJourMardi);
router.use('/mercredi', routerRepasDuJourMercredi);
router.use('/jeudi', routerRepasDuJourJeudi);
router.use('/vendredi', routerRepasDuJourVendredi);
router.use('/samedi', routerRepasDuJourSamedi);
router.use('/dimanche', routerRepasDuJourDimanche);
router.use('/semaine', routerRepasDuJourSemaine);
router.use('/historiquerepasdesjours', routerHistoriqueRepasDesJours);


// router.use('/l', afficherRepasDuJour({ jour: 'lundi' }));
// router.use('/m', afficherRepasDuJour({ jour: 'mardi' }));
// app.get('/afficher/lundi', afficherRepasDuJour({ jour: 'lundi' }));
// app.get('/afficher/mardi', afficherRepasDuJour({ jour: 'lundi' }));
// router.post('/ajouter', ajouterRepasduJourDansViandes);
// router.delete('/supprimer', supprimerRepasDuJourLundi);

module.exports = router;