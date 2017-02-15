/**
 * Created by dpwangying on 2016/9/5.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');
var sql = require('../config/sql');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {
    /*查询功能*/
    show: function (req, res, next) {
        console.log('-----------查询-----------');
        pool.getConnection(function (err, connection) {
            connection.query(sql.show, function (err, result) {
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                }
                console.log(result);
                resSend.jsonSend('0', 'success', result, res);
                connection.release();
            });
        });
    },

    /*预约功能*/
    appoint: function (req, res, next) {
        console.log('-----------预约-----------');
        var carNumber = req.body.carNumber;//车牌
        var carCategory = req.body.carCategory;//车系
        var userName = req.body.userName;//预约人姓名
        var userPhone = req.body.userPhone;//预约人电话
        var appointDate = req.body.appointDate;//预约日期
        var appointTime = req.body.appointTime;//预约时间点
        var maintainWay = req.body.maintainWay;//保养方式，四种
        var maintainCategory = req.body.maintainCategory;//保养类别，上门否
        var netId = req.body.netId;//服务网点
        console.log(req.body);
        pool.getConnection(function (err, connection) {
            if (err) { throw err; }
            connection.query(sql.selectSurplus, [appointDate,appointTime,netId], function (err, result1) {
                console.log(result1);
                if (err) { throw err; }
                if (result1.length > 0 && result1[0].surplus > 0) {
                    var surplus = result1[0].surplus - 1;//可预约剩余个数减一
                    //数据库事务操作
                    connection.beginTransaction(function (err) {
                        if (err) { throw err; }
                        connection.query(sql.appoint, [carNumber, carCategory, userName, userPhone, appointDate, appointTime,
                            maintainWay, maintainCategory, netId], function (err, result2) {
                            if (err) {
                                return connection.rollback(function () {
                                    throw err;
                                });
                            }
                            connection.query(sql.updateSurplus, [surplus,appointDate,appointTime,netId], function (err, result3) {
                                if (err) {
                                    return connection.rollback(function () {
                                        throw err;
                                    });
                                }
                                connection.commit(function (err) {
                                    if (err) {
                                        return connection.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    console.log('appoint success');
                                    resSend.jsonSend('0', 'appoint success', '', res);
                                });
                            });
                        });
                    });
                } else { resSend.jsonSend('-1', 'error', '', res); }
                connection.release();
            });
        });
    }
};
