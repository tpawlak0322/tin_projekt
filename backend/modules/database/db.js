const config = require("./config");
const {ModelFactory} = require("../models/model");
const { Sequelize } = require('sequelize');
const e = require("express");
const bcrypt = require("bcrypt");

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
            const password = 'admin'
            const hashedPassword = await bcrypt.hash(password, 10);

            const newAdmin = await User.create({
                username: 'admin',
                password: hashedPassword,
                role: 'admin',
            });

            const newThread = await Thread.create({
                creation_date: Date.now(),
                last_visit_date: Date.now(),
            })
            const newThread2 = await Thread.create({
                creation_date: Date.now(),
                last_visit_date: Date.now(),
            })
            newThread.setUser(newAdmin);
        } catch (exception) {
            console.error(exception)
        }
    }


    sequelize.sync({force: false})
        .then(() => {
            console.log('Database and tables synced successfully.');
        })
        .catch((err) => {
            console.error('Error syncing database:', err);
        }).then(()=>{add_seed()});



}
module.exports = {db_init,User,Thread,Follower,Message,sequelize}