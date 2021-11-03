const express=require('express');
 const crudcontrollers=require('./crudcontrollers');

 var crudRouting=express.Router();

 crudRouting.route('/dump').get(crudcontrollers.getUsers);
 crudRouting.route('/login').post(crudcontrollers.authendication);
 crudRouting.route('/get-admin/:id').get(crudcontrollers.getId);
 crudRouting.route('/addUser').post(crudcontrollers.newUsers);
 crudRouting.route('/delete').delete(crudcontrollers.deleteId);
 crudRouting.route('/update').put(crudcontrollers.updateId);

module.exports=crudRouting;