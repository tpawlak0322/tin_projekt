const {AdminController, GuestController, UserController} = require( "../controllers/controller");
const bcrypt = require("bcrypt");
const db = require('../database/db')
const {sign, verify} = require("jsonwebtoken");


const secret_key = 'fnsjiudfjioswejdofsafsafisakdjgaojgfvbhjgjkhbgvkbhjfghyfgdfsbjhbhjfdsabhjdfsbjkfdsjdajoidjawsd';
const secret_refresh_key = 'vmnx,cbjknxcfsafsafasfashdyrtythfghfnvbngfyhkjhgjghjhgvjbnxgjdiojgo';
class Account_manager {
    /**
     *
     * @returns {IController}, null if validation fails
     */
    static async validateAccount(username,token,res){

        if(token === null || username == null)
            return new GuestController();
        const user = await db.User.findOne({where: {username}});
        if(user === null || user.token !== token)
        {
            return null;
        }
        try {
            verify(token,secret_key);

        } catch (error) {
            console.error('expired token')
            return null;
        }
        const controllerType = user.role;
        switch (controllerType){
            case 'admin':
                return new AdminController(user);
            case 'user':
                return new UserController(user);
            default:
                return new GuestController(user);
        }

    }


    static async registerAccount(username, password,res) {

        const usernameRegex = /^[a-zA-Z0-9_]+$/;

        if (!usernameRegex.test(username)) {
            res.status(400).json('Invalid username. Use only alphanumeric characters and underscores.');
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await db.User.findOne(
            {where: {username: username}}
        )
        if(existingUser != null)
        {
            res.status(400).json("user already exists");
            return
        }
        try {
            const user = await db.User.create({
                username,
                password: hashedPassword,
                role: 'user',

            });
            await db.Thread.create({
                creation_date: Date.now(),
                last_visit_date: Date.now(),
                user_id: user.id
            })
            res.json({username, message: 'User registered successfully'});
        } catch (error) {
            console.error('Error registering user:', error);
            res.status(500).json({message: 'Internal server error'});
        }
    }
    static async loginAccount(username, password,res) {
        try {

            const user = await db.User.findOne({ where: { username } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            const tokens = await createTokens(user)
            const token = tokens.token;
            const refreshToken = tokens.refreshToken;
            const role = user.role;
            console.log('refreshtoken',refreshToken)
            res.json({ username,token, refreshToken,role});

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async refresh(username,refresh_token,res){
        const user = await db.User.findOne({ where: { username } });
        if(!username || !refresh_token)
        {
            res.status(500).json({message: "Bad request"});
            return;
        }

        if(user === null || user.refresh_token !== refresh_token)
        {
            res.status(401).json({message: "Unauthorized access"});
            return;
        }
        try {
            verify(refresh_token,secret_refresh_key);

        } catch (error) {
            console.log(error)

            res.status(401).json({message: "Unauthorized access"});
            return null;
        }

        const tokens = await createTokens(user)
        const token = tokens.token;
        const refreshToken = tokens.refreshToken;
        const role = user.role;
        res.json({ username,token, refreshToken,role});


    }

}
async function createTokens(user){
    const token = sign({ userId: user.id }, secret_key, { expiresIn: '1m' });
    const refreshToken = sign({ userId: user.id }, secret_refresh_key, { expiresIn: '7d' });
    user.token = token;
    user.refresh_token = refreshToken;
    await user.save();
    return {token,refreshToken};
}
module.exports = {Account_manager}