var express = require('express');
const {Account_manager} = require("../modules/accounts/account_manager");
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/getThread/:username', async function (req, res, next) {
    const controller = await Account_manager.validateAccount(req.params.username, req.body.token, res)

    if (controller === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }
    console.log(controller);
    controller.get_record(req.params.username);
    res.render('index', {title: 'Express'});
});
router.post('/3', function(req,res) {
    const username = req.body.username;
    res.render('index', {title: username});
});

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    await Account_manager.registerAccount(username, password, res);

});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    await Account_manager.loginAccount(username, password, res);

});
router.post('/refresh', async (req, res) => {
    const { username, refresh_token } = req.body;
    await Account_manager.refresh(username, refresh_token, res);

});
module.exports = router;
