const db = require('../database/db')
const {Op} = require("sequelize");


class IController {
    /**
     *
     * @type {User}
     */
    user = null;

    /**
     *
     * @param user {User}
     */
    constructor(user) {
        this.user = user;
    }

    get_record(username) {
        console.error('This feature is not implemented');
    }

    get_all_records() {
        console.error('This feature is not implemented');
    }

    delete_record() {
        console.error('This feature is not implemented');
    }

    async getThreads() {
        console.error('This feature is not implemented');
    }

    async getThreadMessages(thread_id) {
        console.error('This feature is not implemented');
    }

    async createThread() {
        console.error('This feature is not implemented');
    }

    async getUsers() {
        console.error('This feature is not implemented');
    }

    async getFollowed() {
        console.error('This feature is not implemented');
    }

    async getNotFollowed() {
        console.error('This feature is not implemented');
    }

    async addFollower(id_to_follow) {
        console.error('This feature is not implemented');

    }

    async removeFollower(id_to_follow) {
        console.error('This feature is not implemented');

    }

    async createMessage(message) {
        console.error('This feature is not implemented');

    }
    async removeUser(username) {
        console.error('This feature is not implemented');
    }

    async getFollowers(){
        console.error('This feature is not implemented');

    }
    async editMessage(message_id,editedMessage) {

    }
    }


class UserController extends IController {

    /**
     *
     * @param user {User}
     */
    constructor(user) {
        super(user);

    }

    getAllUsers() {

    }
    async getFollowers() {
        try {
            const users = await db.User.findAll({
                include: [{
                    model: db.User,
                    as: 'FollowerUser',
                    through: { attributes: ['creation_date'] }
                }],
            });


            const result = users.map(user => ({
                username: user.username,
                followers: user.FollowerUser.map(follower => ({
                    id: follower.id,
                    username: follower.username,
                    creation_date: follower.Follower.creation_date,

                })),
            }));

            console.log(result);
            return result;
        } catch (error) {
            console.error(error);
            return null;
        }
    }



    async createMessage(message) {


        const firstThread = await db.Thread.findOne({
            where: {
                user_id: this.user.id
            }
        });

        if (firstThread) {
            const createdMessage = await db.Message.create({
                text: message,
                thread_id: firstThread.id
            });

            console.log('Message created:', createdMessage);
        } else {
            console.log('Thread not found for the user.');
            return false;
        }
        return true;

    }

    async getThreads() {
        const followers = await this.getFollowed()
        return await db.Thread.findAll({
            where: {
                [Op.or]: [
                    {user_id: this.user.id},
                    {user_id: {[Op.in]: followers.map(follower => follower.id)}}
                ]
            },
            include: [
                {
                    model: db.User,
                    attributes: ['username'],
                },
            ],
        });

    }

    async getThreadMessages(thread_id, page = 1, messagesPerPage = 10) {
        const currentThread = await db.Thread.findOne({
            where: {
                id: thread_id
            }
        });


        if (currentThread.user_id !== this.user.id) {
            const isFollower = await db.User.findOne({
                where: {
                    id: currentThread.user_id,
                },
                include: [{
                    model: db.User,
                    as: 'FollowerUser',
                    where: {
                        id: this.user.id,
                    },
                }],
            });

            if (!isFollower) {
                return null;
            }
        }


        const offset = (page - 1) * messagesPerPage;


        const messages = await db.Message.findAll({
            where: {
                thread_id: currentThread.id
            },
            limit: messagesPerPage,
            offset: offset,
        });

        const totalMessagesCount = await db.Message.count({
            where: {
                thread_id: currentThread.id
            }
        });

        return {
            messages,
            totalMessagesCount,
        };
    }

    async createThread() {
        db.Thread.create({
            user_id: this.user.id,
            creation_date: Date.now(),
            last_visit_date: Date.now(),
        });

    }

    async getUsers() {
        return db.User.findAll(
            {
                attributes: ['id', 'username'],
            }
        );
    }
    async editMessage(message_id,editedMessage) {
        try{
            const message = await db.Message.findOne(
                {
                    where: {id: message_id}
                }
            )
            if(editedMessage === ''){
                await message.destroy();
            }
            else {
                console.log(message.text)
                console.log(message_id)

                message.text = editedMessage
                console.log(message.text)
                await message.save();
            }
        }catch (e) {
            console.log(e.text)
            return false;
        }
        return true;


    }
    async removeFollower(id_to_follow) {
        try {
            const existingFollower = await db.Follower.findOne({
                where: {
                    UserId: id_to_follow,
                    FollowerId: this.user.id,
                },
            });

            if (!existingFollower) {
                console.log('Not following this user.');
                return false;
            }
            await existingFollower.destroy()


            console.log('Successfully removed follower.');
            return true;

        } catch (error) {
            console.error('Error removing follower:', error.message);
            return true;

        }

    }
    async removeUser(username) {
        try {

            const userToDelete = await db.User.findOne({
                where: {
                    username: username
                }
            })

            if (!userToDelete) {
                console.log('User does not exist.');
                return;
            }
            await userToDelete.destroy()


            console.log('Successfully removed user.');
            return true;
        } catch (error) {
            console.error('Error removing user:', error.message);
            return false;

        }

    }
    async addFollower(id_to_follow) {
        try {

            const existingFollower = await db.Follower.findOne({
                where: {
                    UserId: id_to_follow,
                    FollowerId: this.user.id,
                },
            });

            if (existingFollower) {
                console.log('Already following this user.');
                return false;
            }


            await db.Follower.create({
                UserId: id_to_follow,
                FollowerId: this.user.id,
                creation_date: Date.now()
            });

            console.log('Successfully added follower.');
        } catch (error) {
            console.error('Error adding follower:', error.message);
            return false;
        }
        return true;
    }

    async getNotFollowed() {
        const followedUsers = await db.User.findAll({
            attributes: ['id'],
            include: [
                {
                    model: db.User,
                    as: 'FollowerUser',
                    where: {
                        id: this.user.id,
                    },
                },
            ],
            raw: true,
        });

        const followedUserIds = followedUsers.map((user) => user.id);
        followedUserIds.push(this.user.id)
        return await db.User.findAll({
            attributes: ['id', 'username'],
            where: {
                id: {
                    [Op.notIn]: followedUserIds,
                },
            },
        });

    }

    async getFollowed() {
        return await db.User.findAll({
            attributes: ['id', 'username'],
            include: [
                {
                    model: db.User,
                    as: 'FollowerUser',
                    where: {
                        id: this.user.id,
                    },
                },
            ],
        });
    }
}

class AdminController extends UserController {

    /**
     *
     * @param user {User}
     */
    constructor(user) {
        super(user);
    }

    async getThreads() {
        return await super.getThreads()
    }

    async addFollower(id_to_follow) {
        return await super.addFollower(id_to_follow)
    }

}

class GuestController extends IController {

    constructor() {
        super(null);
    }

    async getThreads() {
        return await db.Thread.findAll({
            include: [
                {
                    model: db.User,
                    where: {
                        role: "admin"
                    },
                    attributes: ['username'],
                },

            ],

        });

    }

    async getThreadMessages(thread_id) {
        const currentThread = await db.Thread.findOne({
            where: {
                id: thread_id,

            }
        });
        if (currentThread.user_id == null)
            return null;
        const user = await db.User.findOne({
            where: {
                id: currentThread.user_id
            }
        })
        if (user == null)
            return null

        const messages = await db.Message.findAll({
            where: {
                thread_id: currentThread.id
            }
        })
        return messages;


    }

}

module.exports = {IController, AdminController, UserController, GuestController}