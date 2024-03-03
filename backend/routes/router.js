var express = require('express');
const {Account_manager} = require("../modules/accounts/account_manager");
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.post('/getThreads/', async function (req, res, next) {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const user_threads = await controller.getThreads();

    res.json(user_threads);
});

router.post('/getUsers', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const users = await controller.getUsers();

    res.json(users);

});
router.post('/editMessage', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const edited = await controller.editMessage(req.body.message_id,req.body.editedMessage);
    if(edited)
        res.json(edited);
    else
        res.status(500).json(edited);

});

router.post('/deleteUser', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const deleted = await controller.removeUser(req.body.usernameToDelete);
    if(deleted)
        res.json(deleted);
    else
        res.status(500).json(deleted);
});
router.post('/getUsersFollowed', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const followed = await controller.getFollowed();

    res.json(followed);

});

router.post('/getFollowers', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }
    const followers = await controller.getFollowers();
    if(controller.user === null) {
        res.status(401)
        return;
    }
    res.json(followers);

});
router.post('/getThread/Messages/create', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const created = controller.createMessage(req.body.message)
    if (created)
        res.status(201).json("created message");
    else
        res.status(400).json('failed to create a message')

});

router.post('/getThread/Messages', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const messages = await controller.getThreadMessages(req.body.thread_id,req.body.page,req.body.messagesPerPage)
    if(messages == null)
        res.status(401).json('this is not your thread or the thread of your follower');
    else
        res.json(messages);

});

router.post('/getUsersNotFollowed', async (req, res) => {
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const notfollowed = await controller.getNotFollowed();
    console.log(notfollowed)
    res.json(notfollowed);

});
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if(username === undefined || password === undefined) {
        res.status(400).json("bad request");
        return;
    }
    await Account_manager.registerAccount(username, password, res);


});
router.post('/addFollower/:id', async (req, res) => {
    const { id } = req.params;
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const followed = await controller.addFollower(id);
    if(followed)
    res.json(followed);
    else
        res.status(500).json(followed)

});
router.post('/unfollow/:id', async (req, res) => {
    const { id } = req.params;
    const controller = await Account_manager.validateAccount(req.body.username, req.body.token, res)
    if (controller === null || controller.user === null) {
        res.status(401).json({message: "Unauthorized access"});
        return;
    }

    const followed = await controller.removeFollower(id);
    if(followed)
        res.json(followed);
    else
        res.status(400).json("Not following this user");

});
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const usernameRegex = /^[a-zA-Z0-9_]+$/;

    if (!usernameRegex.test(username)) {
        res.status(400).json('Invalid username. Use only alphanumeric characters and underscores.');
        return;
    }
    await Account_manager.loginAccount(username, password, res);

});
router.post('/refresh', async (req, res) => {
    const { username, refresh_token } = req.body;
    await Account_manager.refresh(username, refresh_token, res);

});
module.exports = router;
