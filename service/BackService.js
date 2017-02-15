/**
 * Created by dpwangying on 2016/9/7.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/mysqlConfig');
var sql = require('../config/sql');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {
    /*预约维护--增加表单*/
    addForm: function (req, res) {
        console.log('----------增加表单----------');
        var date = req.body.date;//预约日期
        var time = req.body.timePoint;//预约时间点
        var surplus = req.body.surplus;//剩余工位
        var netId = req.body.netId;//服务网点
        var discount = req.body.discount;//折扣
        pool.getConnection(function (err, connection) {
            console.log('-----------'+netId);
            if (err){ throw err; }
            connection.query(sql.addForm,[date,time,netId,surplus,discount], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('addForm success'+netId);
                    resSend.jsonSend('0', 'addForm success', '', res);
                }
                connection.release();
            });
        });
    },

    /*预约维护--修改表单*/
    updateForm: function (req, res) {
        console.log('----------修改表单----------');
        console.log(req.body);
        var date = req.body.date;//预约日期
        var time = req.body.timePoint;//预约时间点
        var surplus = req.body.surplus;//剩余工位
        var netId = req.body.netId;//服务网点
        var discount = req.body.discount;//折扣
        // var uuid = req.body.uuid;//每行数据的id
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.updateForm,[surplus,discount,date,time,netId], function (err,result) {
                console.log(result);
                if (err || result.affectedRows==0){
                    resSend.jsonSend('-1', 'error', '', res);
                    // throw err;//此处throw err可能抛出为null
                } else if (result){
                    console.log('updateForm success');
                    resSend.jsonSend('0', 'updateForm success', '', res);
                }
                connection.release();
            });
        });
    },

    // /*预约维护--删除表单*/
    // deleteForm: function (req, res) {
    //     console.log('----------删除表单----------');
    //     var uuid = req.body.uuid;//每行数据的id
    //     console.log(uuid);
    //     pool.getConnection(function (err, connection) {
    //         if (err){ throw err; }
    //         connection.query(sql.deleteForm, uuid, function (err,result) {
    //             console.log(result);
    //             if (err){
    //                 resSend.jsonSend('-1', 'error', '', res);
    //                 throw err;
    //             } else if (result){
    //                 console.log('deleteForm success');
    //                 resSend.jsonSend('0', 'deleteForm success', '', res);
    //             }
    //             connection.release();
    //         });
    //     });
    // },

    /*预约维护--查询表单*/
    findForm: function (req, res) {
        console.log('----------输入日期和网点号查询表单----------');
        var date = req.body.date;//预约日期
        var netId = req.body.netId;//服务网点
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            //connection.escape()方法防止SQL注入攻击
            var sqlFindForm = sql.findForm+'date like'+connection.escape('%'+date+'%')+
                    'and netId ='+connection.escape(netId);
            connection.query(sqlFindForm, function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    console.log('findForm success');
                    resSend.jsonSend('0', 'findForm success', result, res);
                }
                connection.release();
            });
        });
    },

    /*登录*/
    login: function (req, res, next) {
        console.log('----------登录验证----------');
        var user = req.body.user;//用户名
        var password = req.body.password;//密码
        pool.getConnection(function (err, connection) {
            if (err){ throw err; }
            connection.query(sql.login,[user,password],function (err,result) {
                console.log(result);
                if (result.length>0){
                    console.log('login success');
                    resSend.jsonSend('0', 'login success', '', res);
                } else {
                    console.log('login err');
                    resSend.jsonSend('-1', 'err', '', res);
                }
                connection.release();
            });
        });
    }
};