const Bcrypt = require('bcryptjs');
const authorize = require("./auth");
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");

let LoginSchema=require('./crud.model');

var newUsers = function (request, response){
    console.log(request.body);
    try {
        request.body.password = Bcrypt.hashSync(request.body.password, 10);
        var user = new LoginSchema(request.body);
        var result = user.save();
        response.send({
            result:result,
            message:"Saved Successfully"
        });
    } catch (error) {
        response.status(500).send(error);
    }
};

var authendication =function(req, res, next) {
    let getUser;  
    LoginSchema.findOne({
        username: req.body.username
    }).then(user => {
        if (!user) {    
            return res.status(401).json({
                message: "Username is does not exist"
            });
        }
        getUser = user;
        return Bcrypt.compare(req.body.password, user.password);
    }).then(response => {
        if (!response) {
            return res.status(401).json({
                message: "Authentication failed"
            });
        }
        let jwtToken = jwt.sign({
            username: getUser.username,
            userId: getUser._id
        }, "longer-secret-is-better", {
            expiresIn: "1h"
        });
        res.status(200).json({
            token: jwtToken,
            expiresIn: 3600,
            _id: getUser._id
        });
    }).catch(err => {
        return res.status(401).json({
            message: "Invalid"
        });
    });
}

var getUsers = function(req, res){
    LoginSchema.find((error, data) => {
        if (error) {
            return next(error)
        } else {
            res.send({
                result:data,
                message:"Success"
            });
        }
    })
};

var getId =function (req, res){
    LoginSchema.findById(req.params.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.send({
                result:data,
                message:"Success"
            });
        }
    })
}

var deleteId =function (req, res){
    LoginSchema.findByIdAndRemove(req.body.id, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.send({
                result:data,
                message:"Deleted"
            });
        }
    })
}

var updateId =function (req, res){
    LoginSchema.findByIdAndUpdate(req.body.id, {$set:req.body}, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.send({
                result:data,
                message:"Updated"
            });
        }
    })
}


module.exports={
    authendication:authendication,
    getUsers:getUsers,
    getId:getId,
    newUsers:newUsers,
    deleteId:deleteId,
    updateId:updateId
}