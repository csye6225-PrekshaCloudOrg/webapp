const express = require('express');
const router = express.Router();
const healthController = require('../controller/healthController');
const userController = require('../controller/userController');
const {create_user_validator, update_user_validator }= require('../validator/userSchema');
const checkPayload = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType && contentType !== 'application/json') {
        return res.status(400).send();
    }
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }
    if (Object.keys(req.body).length > 0) {
        return res.status(400).send();
    }

    if (Object.keys(req.body).length > 0 || (req._body && typeof req.body === 'object')) {
        return res.status(400).send();
    }
    next();
};

const checkPayload_User = (req, res, next) => {
    const contentType = req.headers['content-type'];
    if (contentType && contentType !== 'application/json') {
        return res.status(400).send();
    }
    if (Object.keys(req.query).length > 0) {
        return res.status(400).send();
    }

    //let input = readJsonFile(inputFile);
    let schema = readJsonFile();

    next();
};

router.get('/test', (req,res) =>{
    res.status(200).send();
});

router.head('/healthz', (req, res) => {
    res.status(405).send();
});
router.get('/healthz', checkPayload, healthController.checkHealth);
router.all('/healthz', (req, res) => {
    res.status(405).send();
});

router.post('/v2/user', create_user_validator, userController.create)
      .all('/v2/user', (req, res) => {
        res.status(405).send();
    });

router.head('/v2/user/self',(req,res) =>{
        res.status(405).send();})
      .get('/v2/user/self',checkPayload ,userController.findOne)
      .put('/v2/user/self',update_user_validator,  userController.updateUser)
      .all('/v2/user/self',(req,res) =>{
            res.status(405).send();
});
router.get('/verify/:token', checkPayload, userController.verifyToken);

router.all('*', (req,res) => {
    res.status(404).send();
})
module.exports = router;