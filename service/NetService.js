/**
 * Created by dpwangying on 2016/10/27.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');
var sql = require('../config/sql');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {
    /*网点管理--增加网点*/
    addNet: function (req, res) {
        console.log('----------增加网点----------');
        var netId = req.body.netId;//网点号
        var netName = req.body.netName;//网点名
        var netAddress = req.body.netAddress;//网点地址
        var netManager = req.body.netManager;//网点负责人
        var netPhone = req.body.netPhone;//网点联系电话
        pool.getConnection(function (err, connection) {
            console.log('-----------'+netId);
            if (err){ throw err; }
            connection.query(sql.addNet,[netId,netName,netAddress,netManager,netPhone], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'addNet success', '', res);
                }
                connection.release();
            });
        });
    },

    /*网点管理--修改网点*/
    updateNet: function (req, res) {
        console.log('----------修改网点----------');
        console.log(req.body);
        var netId = req.body.netId;//网点号
        var netName = req.body.netName;//网点名
        var netAddress = req.body.netAddress;//网点地址
        var netManager = req.body.netManager;//网点负责人
        var netPhone = req.body.netPhone;//网点联系电话
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.updateNet,[netName,netAddress,netManager,netPhone,netId], function (err,result) {
                console.log(result);
                if (err || result.affectedRows==0){
                    resSend.jsonSend('-1', 'error', '', res);
                    // throw err;//此处throw err可能抛出为null
                } else if (result){
                    console.log('updateNet success');
                    resSend.jsonSend('0', 'updateNet success', '', res);
                }
                connection.release();
            });
        });
    },

    /*网点管理--删除网点*/
    deleteNet: function (req, res) {
        console.log('----------删除网点----------');
        var netId = req.body.netId;//网点号
        // var netName = req.body.netName;//网点名
        // var netAddress = req.body.netAddress;//网点地址
        // var netManager = req.body.netManager;//网点负责人
        // var netPhone = req.body.netPhone;//网点联系电话
        console.log(netId);
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.deleteNet, netId, function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('deleteNet success');
                    resSend.jsonSend('0', 'deleteNet success', '', res);
                }
                connection.release();
            });
        });
    },

    /*网点管理--查询网点*/
    findNet: function (req, res) {
        console.log('----------查询网点----------');
        var netId = req.body.netId;//网点号
        var netName = req.body.netName;//网点名
        var netAddress = req.body.netAddress;//网点地址
        // var netManager = req.body.netManager;//网点负责人
        // var netPhone = req.body.netPhone;//网点联系电话
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            //connection.escape()方法防止SQL注入攻击
            // var sqlFindNet = sql.findNet+'netId like'+connection.escape('%'+netId+'%')+
            //         'and netName like'+connection.escape('%'+netName+'%')+'and netAddress like'+connection.escape('%'+netAddress+'%');
            var sqlFindNet;
            if (!netId && !netName && !netAddress){
                sqlFindNet = 'select * from net_info';
            }else if (netId && !netName && !netAddress){
                sqlFindNet = sql.findNet+'netId like'+connection.escape('%'+netId+'%');
            }else if (!netId && netName && !netAddress){
                sqlFindNet = sql.findNet+'netName like'+connection.escape('%'+netName+'%');
            }else if (!netId && !netName && netAddress){
                sqlFindNet = sql.findNet+'netAddress like'+connection.escape('%'+netAddress+'%');
            }else if (netId && netName && !netAddress){
                sqlFindNet = sql.findNet+'netId like'+connection.escape('%'+netId+'%')+'and netName like'+connection.escape('%'+netName+'%');
            }else if (netId && !netName && netAddress){
                sqlFindNet = sql.findNet+'netId like'+connection.escape('%'+netId+'%')+'and netAddress like'+connection.escape('%'+netAddress+'%');
            }else if (!netId && netName && netAddress){
                sqlFindNet = sql.findNet+'netName like'+connection.escape('%'+netName+'%')+'and netAddress like'+connection.escape('%'+netAddress+'%');
            }else {
                sqlFindNet = sql.findNet+'netId like'+connection.escape('%'+netId+'%')+
                    'and netName like'+connection.escape('%'+netName+'%')+'and netAddress like'+connection.escape('%'+netAddress+'%');
            }
            connection.query(sqlFindNet, function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('findNet success');
                    resSend.jsonSend('0', 'findNet success', result, res);
                }
                connection.release();
            });
        });
    }
};