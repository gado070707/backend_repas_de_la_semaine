var express = require('express');
var router = express.Router();
var routerRepasDuJourLundi = require('./routerRepasDuJourLundi');
var routerRepasDuJourMardi = require('./routerRepasDuJourMardi');
var routerRepasDuJourMercredi = require('./routerRepasDuJourMercredi');
var routerRepasDuJourJeudi = require('./routerRepasDuJourJeudi');
var routerRepasDuJourVendredi = require('./routerRepasDuJourVendredi');
var routerRepasDuJourSamediMidi = require('./routerRepasDuJourSamediMidi');
var routerRepasDuJourSamedi = require('./routerRepasDuJourSamedi');
var routerRepasDuJourDimancheMidi = require('./routerRepasDuJourDimancheMidi');
var routerRepasDuJourDimanche = require('./routerRepasDuJourDimanche');

router.use('/lundi', routerRepasDuJourLundi);
router.use('/mardi', routerRepasDuJourMardi);
router.use('/mercredi', routerRepasDuJourMercredi);
router.use('/jeudi', routerRepasDuJourJeudi);
router.use('/vendredi', routerRepasDuJourVendredi);
router.use('/samedi_midi', routerRepasDuJourSamediMidi);
router.use('/samedi', routerRepasDuJourSamedi);
router.use('/dimanche_midi', routerRepasDuJourDimancheMidi);
router.use('/dimanche', routerRepasDuJourDimanche);

module.exports = router;