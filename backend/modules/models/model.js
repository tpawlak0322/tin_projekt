
const { DataTypes } = require('sequelize');

class ModelFactory{

    constructor() {
    }

    getUser(sequlize){
        const User = sequlize.define('User',
          {
              username: {
                  type: DataTypes.STRING,
                  allowNull: false,
              },
              password: {
                  type: DataTypes.STRING,
                  allowNull: false,
              },
              token: {
                  type: DataTypes.STRING,
                  allowNull: true,
              },
              refresh_token: {
                  type: DataTypes.STRING,
                  allowNull: true,
              },
              role: {
                  type: DataTypes.STRING,
                  allowNull: false,
              },

          }
          );
        User.associate = (models) =>{
            User.belongsToMany(models.User, {
                through: 'Follower',
                as: 'FollowerUser',
                foreignKey: 'UserId',
                otherKey: 'FollowerId',
            })
        }
        return User;
    }
    getThread(sequelize){
        const Thread = sequelize.define('Thread',
            {
                creation_date:{
                    type: DataTypes.DATE
                },
                last_visit_date:{
                    type: DataTypes.DATE
                }
            }
        );
        Thread.associate = ((models)=>{
            Thread.belongsTo(models.User,{
                foreignKey: 'user_id'
            })
        })
        return Thread;

    }
    getMessage(sequelize){
        const Message = sequelize.define('Message',
            {
                text: {
                    type: DataTypes.STRING
                },
                send_date: {
                    type: DataTypes.DATE
                },
            });
        Message.associate = (models)=> {
            Message.belongsTo(models.Thread,{
                foreignKey: 'thread_id'
            })
        }
        return Message;

    }
    getFollowers(sequelize){
        const Follower = sequelize.define('Follower',
            {
                creation_date: {
                    type: DataTypes.DATEONLY
                },
            });
        return Follower;

    }

}

module.exports = {ModelFactory}