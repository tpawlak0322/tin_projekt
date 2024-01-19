



class IController {
    accountID = -1;
    constructor(accountID) {
    this.accountID = accountID;
    }
    get_record(username){
        console.error('This feature is not implemented');
    }
    get_all_records(){
        console.error('This feature is not implemented');
    }
    delete_record(){
        console.error('This feature is not implemented');
    }
}
class AdminController extends IController {

    constructor(accountID) {
        super(accountID);
    }
}

class UserController extends IController {

    constructor(accountID) {
        super(accountID);

    }

    getAllUsers(){

    }

}
class GuestController extends IController {

    constructor() {
        super(-1);
    }
}
module.exports = {IController,AdminController,UserController,GuestController}