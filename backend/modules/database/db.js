const config = require("./config");
const {ModelFactory} = require("../models/model");
const { Sequelize } = require('sequelize');
const e = require("express");

const sequelize = new Sequelize(config.development);
const User = new ModelFactory().getUser(sequelize)
const Thread = new ModelFactory().getThread(sequelize)
const Follower = new ModelFactory().getFollowers(sequelize)
const Message = new ModelFactory().getMessage(sequelize)


User.associate({User})
Thread.associate({User})
Message.associate({Thread})
function db_init()
{
    sequelize.authenticate()
        .then(
            ()=> console.log("Connected to database successfully")
        ).catch((exception) =>{
        console.log('Unable to connect',exception)
    });


    const add_seed = async ()=> {

        try {
            const newUser = await User.create({
                username: 'testowy uzytkownik',
                password: 'testowe haslo',
                token: 'tetetete',
                refresh_token: 'teeeest',
                role: 'user',
            });
            const newUser2 = await User.create({
                username: 'testowy uzytkownikfollowujacy',
                password: 'testowe haslo',
                token: 'tetetete',
                refresh_token: 'teeeest',
                role: 'user',
            });
            const newThread = await Thread.create({
                creation_date: Date.now(),
                last_visit_date: Date.now(),
            })
            const newThread2 = await Thread.create({
                creation_date: Date.now(),
                last_visit_date: Date.now(),
            })
            newThread.setUser(newUser);
            newThread2.setUser(newUser2);
            newUser.addFollowerUser(newUser2);
        } catch (exception) {
            console.error(exception)
        }
    }


    // Synchronize the models with the database
    sequelize.sync({force: true}) // Use { force: true } only during development to recreate tables
        .then(() => {
            console.log('Database and tables synced successfully.');
        })
        .catch((err) => {
            console.error('Error syncing database:', err);
        }).then(()=>{add_seed()});



}
module.exports = {db_init,User,Thread,Follower,Message}