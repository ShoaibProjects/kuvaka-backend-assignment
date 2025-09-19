const express = require('express');
const multer = require('multer');
const leadController = require('../controllers/lead.controller');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/offer', leadController.saveOffer);
router.post('/leads/upload', upload.single('leadsFile'), leadController.uploadLeads);


module.exports = router;