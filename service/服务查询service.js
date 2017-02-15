/**
 * Created by dpwangying on 2016/12/12.
 */
var mysql = require('mysql');
var mysqlConfig = require('../config/服务查询数据库');
var resSend = require('../config/resSend');

var pool = mysql.createPool(mysqlConfig.mysql);

module.exports = {


    find_store_by_city: function (req, res) {
        console.log('-------根据城市查询门店------');
        var city = req.body.store_city;
        var page = req.body.page;//前端输入当前页码
        var t = [(page-1)*6,6];//每页默认显示6条记录
        pool.getConnection(function (err, connection) {
            console.log('-----数据库操作------');
            if (err){ throw err; }
            connection.query('select * from store where store_city = ? limit ?',[city,t], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        });
    },

    find_store_by_service: function (req, res) {
        console.log('-------根据服务查询门店------');
        var service_id = req.body.service_id;
        var page = req.body.page;//前端输入当前页码
        var t = [(page-1)*6,6];//每页默认显示6条记录
        pool.getConnection(function (err, connection) {
            console.log('-----数据库操作------');
            if (err){ throw err; }
            var sql1 = 'select store_id from service_store where service_id = ?';
            var sql2 = 'select * from store where store_id in (' +sql1+ ') limit ?';
            connection.query(sql2,[service_id,t], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        });
    },

    find_service_by_store: function (req, res) {
        console.log('-------选择门店查询服务项目-------');
        var store_id = req.body.store_id;
        console.log('---选择的门店store为：',store_id);
        var page = req.body.page;//前端输入当前页码
        var t = [(page-1)*6,6];//每页默认显示6条记录
        pool.getConnection(function (err, connection) {
            console.log('-----数据库操作------');
            if (err){ throw err; }
            var sql1 = 'select service_id from service_store where store_id = ?';
            var sql2 = 'select * from service where service_id in (' +sql1+ ') limit ?';
            connection.query(sql2,[store_id,t], function (err,result) {
                console.log(result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        });
    },

    hot_service: function (req, res) {
        console.log('--------热门服务推荐--------');
        pool.getConnection(function (err, connection) {
            console.log('----数据库操作-----');
            connection.query('select * from service where service_id = 28 or service_id = 19',function (err, result) {
                console.log('---DB result---',result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        })
    },

    hot_store: function (req, res) {
        console.log('-------热门门店推荐-------');
        pool.getConnection(function (err, connection) {
            console.log('----数据库操作-----');
            connection.query('select * from store where store_id>3 and store_id<6',function (err, result) {
                console.log('---DB result---',result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        })
    },

    search: function (req, res) {
        console.log('------个人搜索------');
        var option = req.body.option;
        console.log('--搜索条件为--',option);
        pool.getConnection(function (err, connection) {
            console.log('----数据库操作-----');
            var sql1 = 'select * from store where store_name like'+connection.escape('%'+option+'%');
            var sql2 = 'select store_id from service where service_name like'+connection.escape('%'+option+'%');
            var sql3 = 'select * from store where store_id like ('+sql2+')';
            console.log('--sql1--',sql1);
            console.log('--sql2--',sql2);
            console.log('--sql3--',sql3);
            var sql = sql1+';'+sql3;
            connection.query(sql, function (err, result) {
                console.log('---DB result---',result);
                /*//数组降维测试
                var temp = [[1],[2]];
                // Array.prototype.concat.apply([], temp);//数组降维,temp=[1,2]
                console.log('----',Array.prototype.concat.apply([], temp));

                //数组去重测试
                var arr = [1,'a',undefined,null,NaN,1,'a',undefined,null,NaN];
                Array.prototype.remDub = Array.prototype.remDub || function () {
                        return Array.from(new Set(this));
                        // return [...new Set(this)];//es6语法
                    };
                console.log('数组去重',arr.remDub());
                */
                var a = result.concat.apply([],result);//降维
                console.log('--result降维--',a);

                var unique = {};//去重
                a.forEach(function(value){ unique[ JSON.stringify(value) ] = value });
                console.log('--unique--',unique);
                a = Object.keys(unique).map(function(u){return JSON.parse(u) });
                console.log('---result去重---',a);

                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', a, res);
                }
                connection.release();
            });
        });
    },

    find_all_service: function (req, res) {
        console.log('-----查询所有服务-----');
        var page = req.body.page;//前端输入当前页码
        var t = [(page-1)*6,6];//每页默认显示6条记录
        console.log('-----分页-----',t);
        pool.getConnection(function (err, connection) {
            console.log('----数据库操作-----');
            connection.query('select * from service limit ?',[t] ,function (err, result) {
                console.log('---DB result---', result);
                if (err){
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else if (result){
                    resSend.jsonSend('0', 'success', result, res);
                }
                connection.release();
            });
        });
    }

};