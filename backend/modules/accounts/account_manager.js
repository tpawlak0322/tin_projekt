const {AdminController, GuestController, UserController} = require( "../controllers/controller");
const bcrypt = require("bcrypt");
const db = require('../database/db')
const {sign, verify} = require("jsonwebtoken");


const secret_key = 'fnsjiudfjioswejdoisakdaodajoidjawsd';
const secret_refresh_key = 'vmnx,cbjknxckvjbnxgjdiojgo';
class Account_manager {

    /**
     *
     * @returns {IController}, null if validatoin fails
     */
    static async validateAccount(username,token,res){

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
            case 'Admin':
                return new AdminController();
            case 'User':
                return new UserController();
            case 'Guest':
                return new GuestController();
        }

    }


    static async registerAccount(username, password,res) {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            const user = await db.User.create({
                username,
                password: hashedPassword,
                role: 'User',

            });

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

            // Compare the entered password with the hashed password
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate and send a JWT token
            const tokens = await createTokens(user)
            const token = tokens.token;
            const refreshToken = tokens.refreshToken;
            res.json({ username,token, refreshToken});

        } catch (error) {
            console.error('Error logging in:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    static async refresh(username,refresh_token,res){
        const user = await db.User.findOne({ where: { username } });
        console.log(user.refresh_token,refresh_token);
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
        const refreshToken = tokens.token;
        res.json({ username,token, refreshToken});


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