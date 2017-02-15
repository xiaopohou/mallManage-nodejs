/**
 * Created by dpwangying on 2016/10/31.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');
var sql = require('../config/sql');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {
    /*用户管理--增加用户*/
    addUser: function (req, res) {
        console.log('----------增加用户----------');
        var userId = req.body.userId;//用户编号
        var userName = req.body.userName;//用户姓名
        var userAddress = req.body.userAddress;//用户地址
        var userCar = req.body.userCar;//用户车牌
        var userPhone = req.body.userPhone;//用户联系电话
        pool.getConnection(function (err, connection) {
            console.log('-----------'+userId);
            if (err){ throw err; }
            connection.query(sql.addUser,[userId,userName,userAddress,userCar,userPhone], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'addUser success', '', res);
                }
                connection.release();
            });
        });
    },

    /*用户管理--修改用户*/
    updateUser: function (req, res) {
        console.log('----------修改用户----------');
        console.log(req.body);
        var userId = req.body.userId;//用户编号
        var userName = req.body.userName;//用户姓名
        var userAddress = req.body.userAddress;//用户地址
        var userCar = req.body.userCar;//用户车牌
        var userPhone = req.body.userPhone;//用户联系电话
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.updateUser,[userName,userAddress,userCar,userPhone,userId], function (err,result) {
                console.log(result);
                if (err || result.affectedRows==0){
                    resSend.jsonSend('-1', 'error', '', res);
                    // throw err;//此处throw err可能抛出为null
                } else if (result){
                    console.log('updateUser success');
                    resSend.jsonSend('0', 'updateUser success', '', res);
                }
                connection.release();
            });
        });
    },

    /*用户管理--删除用户*/
    deleteUser: function (req, res) {
        console.log('----------删除用户----------');
        var userId = req.body.userId;//用户编号
        // var userName = req.body.userName;//用户姓名
        // var userAddress = req.body.userAddress;//用户地址
        // var userCar = req.body.userCar;//用户车牌
        // var userPhone = req.body.userPhone;//用户联系电话
        console.log(userId);
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.deleteUser, userId, function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('deleteUser success');
                    resSend.jsonSend('0', 'deleteUser success', '', res);
                }
                connection.release();
            });
        });
    },

    /*用户管理--查询用户*/
    findUser: function (req, res) {
        console.log('----------查询用户----------');
        var userId = req.body.userId;//用户编号
        var userName = req.body.userName;//用户姓名
        var userAddress = req.body.userAddress;//用户地址
        var userCar = req.body.userCar;//用户车牌
        var userPhone = req.body.userPhone;//用户联系电话
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            //connection.escape()方法防止SQL注入攻击
            // var sqlFindUser = sql.findUser+'userId like'+connection.escape('%'+userId+'%')+
            //         'and userName like'+connection.escape('%'+userName+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            var sqlfindUser;
            if (!userId && !userName && !userAddress){
                sqlfindUser = 'select * from user_info';
            }else if (userId && !userName && !userAddress){
                sqlfindUser = sql.findUser+'userId like'+connection.escape('%'+userId+'%');
            }else if (!userId && userName && !userAddress){
                sqlfindUser = sql.findUser+'userName like'+connection.escape('%'+userName+'%');
            }else if (!userId && !userName && userAddress){
                sqlfindUser = sql.findUser+'userAddress like'+connection.escape('%'+userAddress+'%');
            }else if (userId && userName && !userAddress){
                sqlfindUser = sql.findUser+'userId like'+connection.escape('%'+userId+'%')+'and userName like'+connection.escape('%'+userName+'%');
            }else if (userId && !userName && userAddress){
                sqlfindUser = sql.findUser+'userId like'+connection.escape('%'+userId+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }else if (!userId && userName && userAddress){
                sqlfindUser = sql.findUser+'userName like'+connection.escape('%'+userName+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }else {
                sqlfindUser = sql.findUser+'userId like'+connection.escape('%'+userId+'%')+
                    'and userName like'+connection.escape('%'+userName+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }
            connection.query(sqlfindUser, function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('findUser success');
                    resSend.jsonSend('0', 'findUser success', result, res);
                }
                connection.release();
            });
        });
    }
};