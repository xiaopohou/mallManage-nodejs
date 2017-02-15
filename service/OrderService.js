/**
 * Created by dpwangying on 2016/11/15.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');
var sql = require('../config/sql');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {
    /*订单管理--增加订单*/
    addOrder: function (req, res) {
        console.log('----------增加订单----------');
        var uuid = req.body.uuid;//订单编号
        var carNumber = req.body.carNumber;//车牌
        var carCategory = req.body.carCategory;//车系
        var userName = req.body.userName;//预约人姓名
        var userPhone = req.body.userPhone;//预约人电话
        var appointTime = req.body.appointTime;//预约时间
        var maintainWay = req.body.maintainWay;//保养方式，四种
        var maintainCategory = req.body.maintainCategory;//保养类别，上门否
        var netId = req.body.netId;//服务网点
        var state = req.body.state;//订单状态
        console.log('---从前端接到的数据---',req.body);
        pool.getConnection(function (err, connection) {
            console.log('-----数据库操作------');
            if (err){ throw err; }
            connection.query(sql.addOrder,[uuid,carNumber,carCategory,userName,userPhone,appointTime,maintainWay,maintainCategory,netId], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'addOrder success', '', res);
                }
                connection.release();
            });
        });
    },

    /*订单管理--修改订单*/
    updateOrder: function (req, res) {
        console.log('----------修改订单----------');
        var uuid = req.body.uuid;//订单编号
        var carNumber = req.body.carNumber;//车牌
        var carCategory = req.body.carCategory;//车系
        var userName = req.body.userName;//预约人姓名
        var userPhone = req.body.userPhone;//预约人电话
        var appointTime = req.body.appointTime;//预约时间
        var maintainWay = req.body.maintainWay;//保养方式，四种
        var maintainCategory = req.body.maintainCategory;//保养类别，上门否
        var netId = req.body.netId;//服务网点
        var state = req.body.state;//订单状态
        console.log('---从前端接到的数据---',req.body);
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            console.log('-----数据库操作------');
            connection.query(sql.updateOrder,[carNumber,carCategory,userName,userPhone,appointTime,maintainWay,maintainCategory,netId,uuid], function (err,result) {
                console.log('----数据库操作结果---',result);
                if (err || result.affectedRows==0){
                    resSend.jsonSend('-1', 'error', '', res);
                    // throw err;//此处throw err可能抛出为null
                } else if (result){
                    console.log('updateOrder success');
                    resSend.jsonSend('0', 'updateOrder success', '', res);
                }
                connection.release();
            });
        });
    },

    /*订单管理--删除订单*/
    deleteOrder: function (req, res) {
        console.log('----------删除订单----------');
        var uuid = req.body.uuid;//订单编号
        console.log('---从前端接到的数据---',req.body);
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            console.log('-----数据库操作------');
            connection.query(sql.deleteOrder, uuid, function (err,result) {
                console.log('----数据库操作结果---',result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('deleteOrder success');
                    resSend.jsonSend('0', 'deleteOrder success', '', res);
                }
                connection.release();
            });
        });
    },

    /*订单管理--查询订单*/
    findOrder: function (req, res) {
        console.log('----------查询订单----------');
        var uuid = req.body.uuid;//订单编号
        var carNumber = req.body.carNumber;//车牌
        var carCategory = req.body.carCategory;//车系
        var userName = req.body.userName;//预约人姓名
        var userPhone = req.body.userPhone;//预约人电话
        var appointTime = req.body.appointTime;//预约时间
        var maintainWay = req.body.maintainWay;//保养方式，四种
        var maintainCategory = req.body.maintainCategory;//保养类别，上门否
        var netId = req.body.netId;//服务网点
        var state = req.body.state;//订单状态
        console.log('---从前端接到的数据---',req.body);
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            console.log('-----数据库操作------');
            //connection.escape()方法防止SQL注入攻击
            var sqlfindOrder;
            /*if (!userId && !userName && !userAddress){
                sqlfindOrder = 'select * from appointment';
            }else if (userId && !userName && !userAddress){
                sqlfindOrder = sql.findOrder+'userId like'+connection.escape('%'+userId+'%');
            }else if (!userId && userName && !userAddress){
                sqlfindOrder = sql.findOrder+'userName like'+connection.escape('%'+userName+'%');
            }else if (!userId && !userName && userAddress){
                sqlfindOrder = sql.findOrder+'userAddress like'+connection.escape('%'+userAddress+'%');
            }else if (userId && userName && !userAddress){
                sqlfindOrder = sql.findOrder+'userId like'+connection.escape('%'+userId+'%')+'and userName like'+connection.escape('%'+userName+'%');
            }else if (userId && !userName && userAddress){
                sqlfindOrder = sql.findOrder+'userId like'+connection.escape('%'+userId+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }else if (!userId && userName && userAddress){
                sqlfindOrder = sql.findOrder+'userName like'+connection.escape('%'+userName+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }else {
                sqlfindOrder = sql.findOrder+'userId like'+connection.escape('%'+userId+'%')+
                    'and userName like'+connection.escape('%'+userName+'%')+'and userAddress like'+connection.escape('%'+userAddress+'%');
            }*/
            connection.query('select * from appointment', function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('findOrder success');
                    resSend.jsonSend('0', 'findOrder success', result, res);
                }
                connection.release();
            });
        });
    }
};