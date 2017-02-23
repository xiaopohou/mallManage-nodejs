"use strict";

const mysql = require('mysql');
// const mysqlConfig = require('../config/mysqlConfig');
// const resSend = require('../config/resSend');

// const pool = mysql.createPool(mysqlConfig.mysql);

const httpReq = require('../config/request');//引入自定义http请求模块，查询mysql数据

module.exports = {

    find_store_by_city: function (req, res) {
        console.log('-------根据城市查询门店------');
        let city = req.body.store_city;
        let page = req.body.page;//前端输入当前页码
        let t = [(page-1)*6,6];//每页默认显示6条记录

        httpReq.httpRequest(`select * from store where store_city = '${city}' limit ${t}`, res);

    },

    find_store_by_service: function (req, res) {
        console.log('-------根据服务查询门店------');
        let service_id = req.body.service_id;
        let page = req.body.page;//前端输入当前页码
        let t = [(page-1)*6,6];//每页默认显示6条记录

        let sql1 = `select store_id from service_store where service_id = ${service_id}`;
        let sql2 = `select * from store where store_id in (${sql1}) limit ${t}`;

        httpReq.httpRequest(sql2, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('-----数据库操作------');
        //     if (err){ throw err; }
        //     let sql1 = 'select store_id from service_store where service_id = ?';
        //     let sql2 = 'select * from store where store_id in (' +sql1+ ') limit ?';
        //     connection.query(sql2,[service_id,t], function (err,result) {
        //         console.log(result);
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', result, res);
        //         }
        //         connection.release();
        //     });
        // });
    },

    find_service_by_store: function (req, res) {
        console.log('-------选择门店查询服务项目-------');
        let store_id = req.body.store_id;
        console.log('---选择的门店store为：',store_id);
        let page = req.body.page;//前端输入当前页码
        let t = [(page-1)*6,6];//每页默认显示6条记录

        let sql1 = `select service_id from service_store where store_id = ${store_id}`;
        let sql2 = `select * from service where service_id in (${sql1}) limit ${t}`;

        httpReq.httpRequest(sql2, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('-----数据库操作------');
        //     if (err){ throw err; }
        //     let sql1 = 'select service_id from service_store where store_id = ?';
        //     let sql2 = 'select * from service where service_id in (' +sql1+ ') limit ?';
        //     connection.query(sql2,[store_id,t], function (err,result) {
        //         console.log(result);
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', result, res);
        //         }
        //         connection.release();
        //     });
        // });
    },

    hot_service: function (req, res) {
        console.log('--------热门服务推荐--------');
        let sql = 'select * from service where service_id = 28 or service_id = 19';
        httpReq.httpRequest(sql, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('----数据库操作-----');
        //     connection.query('select * from service where service_id = 28 or service_id = 19',function (err, result) {
        //         console.log('---DB result---',result);
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', result, res);
        //         }
        //         connection.release();
        //     });
        // })
    },

    hot_store: function (req, res) {
        console.log('-------热门门店推荐-------');
        let sql = 'select * from store where store_id>3 and store_id<6';
        httpReq.httpRequest(sql, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('----数据库操作-----');
        //     connection.query('select * from store where store_id>3 and store_id<6',function (err, result) {
        //         console.log('---DB result---',result);
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', result, res);
        //         }
        //         connection.release();
        //     });
        // })
    },

    search: function (req, res) {
        console.log('------个人搜索------');
        let option = req.body.option;
        console.log('--搜索条件为--',option);

        let sql1 = 'select * from store where store_name like'+connection.escape('%'+option+'%');
        let sql2 = 'select store_id from service where service_name like'+connection.escape('%'+option+'%');
        let sql3 = `select * from store where store_id like (${sql2})`;
        console.log('--sql1--',sql1);
        console.log('--sql2--',sql2);
        console.log('--sql3--',sql3);
        let sql = sql1+';'+sql3;
        //TODO: 数据库查询结果去重
        httpReq.httpRequest(sql, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('----数据库操作-----');
        //     let sql1 = 'select * from store where store_name like'+connection.escape('%'+option+'%');
        //     let sql2 = 'select store_id from service where service_name like'+connection.escape('%'+option+'%');
        //     let sql3 = 'select * from store where store_id like ('+sql2+')';
        //     console.log('--sql1--',sql1);
        //     console.log('--sql2--',sql2);
        //     console.log('--sql3--',sql3);
        //     let sql = sql1+';'+sql3;
        //     connection.query(sql, function (err, result) {
        //         console.log('---DB result---',result);
        //         /*//数组降维测试
        //         let temp = [[1],[2]];
        //         // Array.prototype.concat.apply([], temp);//数组降维,temp=[1,2]
        //         console.log('----',Array.prototype.concat.apply([], temp));
        //
        //         //数组去重测试
        //         let arr = [1,'a',undefined,null,NaN,1,'a',undefined,null,NaN];
        //         Array.prototype.remDub = Array.prototype.remDub || function () {
        //                 return Array.from(new Set(this));
        //                 // return [...new Set(this)];//es6语法
        //             };
        //         console.log('数组去重',arr.remDub());
        //         */
        //         let a = result.concat.apply([],result);//降维
        //         console.log('--result降维--',a);
        //
        //         let unique = {};//去重
        //         a.forEach(function(value){ unique[ JSON.stringify(value) ] = value });
        //         console.log('--unique--',unique);
        //         a = Object.keys(unique).map(function(u){return JSON.parse(u) });
        //         console.log('---result去重---',a);
        //
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', a, res);
        //         }
        //         connection.release();
        //     });
        // });
    },

    find_all_service: function (req, res) {
        console.log('-----查询所有服务-----');
        let page = req.body.page;//前端输入当前页码
        let t = [(page-1)*6,6];//每页默认显示6条记录
        console.log('-----分页-----',t);

        let sql = `select * from service limit ${t}`;
        httpReq.httpRequest(sql, res);

        // pool.getConnection(function (err, connection) {
        //     console.log('----数据库操作-----');
        //     connection.query('select * from service limit ?',[t] ,function (err, result) {
        //         console.log('---DB result---', result);
        //         if (err){
        //             resSend.jsonSend('-1', 'error', '', res);
        //             throw err;
        //         } else if (result){
        //             resSend.jsonSend('0', 'success', result, res);
        //         }
        //         connection.release();
        //     });
        // });
    }

};
