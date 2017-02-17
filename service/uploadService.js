"use strict";

let mongoose = require('mongoose');
mongoose.Promise = global.Promise;//mongoose promise库将被移除，使用es6代替
let resSend = require('../config/resSend');
const mysql = require('mysql');
const mysqlConfig = require('../config/mysqlConfig');
let pool = mysql.createPool(mysqlConfig.mysql);
const mongoConfig = require('../config/mongoConfig');

const qiniu = require('qiniu');//七牛云API
const multiparty = require('multiparty');//文件上传中间件
const fs = require('fs');
const path = require('path');

const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}

module.exports = {
    find_service_class: function (req, res) {
        console.log('------推送给前端可选的服务分类------');
        let db = mongoose.createConnection(mongoConfig.mongodb);//只有放在函数里面使用完才能关闭连接
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('connected');
        });

        let myschema = mongoose.Schema({},{collection: 'servicelist'});
        let ServiceModel = db.model('serviceModel',myschema);

        ServiceModel.find(function (err, result) {
            if (err) {
                console.log(err);
                resSend.jsonSend('-1', 'error', '', res);
            } else {
                console.log(result);
                resSend.jsonSend('0', 'success', result, res);
            }
            db.close();
        });
    },

    add_service_class: function (req, res) {
        console.log('---------增加服务类别----------');
        console.log('request body: ', req.body);
        let db = mongoose.createConnection(mongoConfig.mongodb);//只有放在函数里面使用完才能关闭连接
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('connected');
        });

        let myschema = mongoose.Schema({serviceClass:{}},{collection: 'serviceclass'});
        let ServiceModel = db.model('serviceModel',myschema);
        let arr = {serviceClass:req.body};
        ServiceModel.create( arr, (err, result) => {
            if (err) {
                console.log(err);
                resSend.jsonSend('-1', 'error', '', res);
            } else {
                console.log(result);
                resSend.jsonSend('0', 'success', result, res);
            }
            db.close();
        });

    },


    find_commodity_class: function (req, res) {
        console.log('------推送给前端定义好的单商品分类------');
        let db = mongoose.createConnection(mongoConfig.mongodb);//只有放在函数里面使用完才能关闭连接
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('connected');
        });

        let myschema = mongoose.Schema({
            commodity_category: {},
        },{collection: 'commodityclass'});
        let ServiceModel = db.model('serviceModel',myschema);
        ServiceModel.find(function (err, result) {
            if (err) {
                console.log(err);
                resSend.jsonSend('-1', 'error', '', res);
            } else {
                console.log(result[0].commodity_category);
                resSend.jsonSend('0', 'success', result[0].commodity_category, res);
            }
            db.close();
        });
    },

    find_uploaded_commodity_class: function (req, res) {
        console.log('------推送给前端已发布存在的单商品分类------');
        let db = mongoose.createConnection(mongoConfig.mongodb);//只有放在函数里面使用完才能关闭连接
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('connected');
        });

        let myschema = mongoose.Schema({
            singleCommodity: {

            }
        },{collection: 'testjson'});
        let ServiceModel = db.model('serviceModel',myschema);
        //遍历所有已经存在的单商品获取其分类
        ServiceModel.find(function (err, result) {
            if (result) {
                console.log(result);
                let arr = [];
                for (let i=0; i<result.length; i++){
                    console.log(result[i].singleCommodity.type);
                    if (!arr.includes(result[i].singleCommodity.type)){
                        arr.push(result[i].singleCommodity.type);
                    }
                }
                console.log('arr:', arr);
                resSend.jsonSend('0', 'success', arr, res);
            } else {
                console.log(err);
                resSend.jsonSend('-1', 'error', '', res);
            }
            db.close();
        });
    },

    /*
    * 输入商品类别，输出该类别所有单商品列表
    * */
    find_commodity_byClass: function (req, res) {
        console.log('------根据商品类别获取商品列表------');
        console.log('type from frontEnd:', req.body.type);
        let db = mongoose.createConnection(mongoConfig.mongodb);//只有放在函数里面使用完才能关闭连接
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('mongodb connected');
        });

        let mySchema = mongoose.Schema({
            singleCommodity: {
                // type: String,//单商品类别--机油
                // itemDesc: String,//单商品介绍
                // itemStandard: String,//单商品标准--机油容量
                // itemViscosity: String,//机油粘度级别
                // itemClassify: String,//机油类型--全合成
                // itemBrand: String,//机油品牌
                // itemPrice: String,//单商品价格
                // itemImg: String,//单商品图片地址
                // itemName: String,//单商品的自定义名称
            }
        }, {collection: 'testjson'});
        let CommodityListModel = db.model('commodityListModel',mySchema);
        CommodityListModel.find({'singleCommodity.type':req.body.type}, function (err, result) {
            if (err) {
                console.log(err);
                resSend.jsonSend('-1', 'error', '', res);
            } else {
                console.log('result:',result);
                let arr=[];
                for(let i=0; i<result.length; i++){
                    console.log(result[i].singleCommodity);
                    arr.push({
                        "itemDesc":result[i].singleCommodity.itemDesc,
                        "itemStandard":result[i].singleCommodity.itemStandard,
                        "itemViscosity":result[i].singleCommodity.itemViscosity,
                        "itemClassify":result[i].singleCommodity.itemClassify,
                        "itemBrand":result[i].singleCommodity.itemBrand,
                        "itemPrice":result[i].singleCommodity.itemPrice,
                        "itemImg":result[i].singleCommodity.itemImg,
                        "itemName":result[i].singleCommodity.itemName}
                    );
                }
                console.log('arr: ',arr);
                let resToFE = {"type": req.body.type, "itemList": arr};
                // res.send(resToFE);
                resSend.jsonSend('0', 'success', resToFE, res);
            }
            db.close();
        });
    },

    upload_service: function (req, res) {
        console.log('------接受前端单商品组合成的单一服务项写入数据库------');
        console.log('request data: ',req.body);
        let db = mongoose.createConnection(mongoConfig.mongodb);
        db.on('error',console.error.bind(console,'connection error:'));
        db.on('open', () => {
            console.log('connected');
        });

        let testSchema =  mongoose.Schema({service:{}},{collection:'services'});
        let TestModel = db.model('testModel',testSchema);
        let arr = {service:req.body};
        // let mongoInputData = function () {//mongodb数据写入函数
            TestModel.create(arr, (err, result) => {
                if (err) {
                    // mongoInputData();//mongodb数据写入失败重新写入
                    resSend.jsonSend('-1', 'error', '', res);
                    throw err;
                } else {
                    console.log(result);
                    resSend.jsonSend('0', 'success', result, res);
                    // myEmitter.emit('upload',result);//mongodb写入成功，调用upload事件将数据写入mysql
                }
                db.close();
            });
        // };
    },

    upload_commodity: function (req, res) {
        console.log('------上传数据------');
        console.log(req.body);
        let db = mongoose.createConnection(mongoConfig.mongodb);
        db.on('error',console.error.bind(console,'connection error:'));
        db.once('open', function () {
            console.log('connected');
        });

        const myEmitter = new MyEmitter();//自定义事件
        myEmitter.on('upload', function (result) {
            console.log('---mongodb uploaded---');
            console.log('data input mysql ', result);
            let itemCategory = result.doc.itemCategory;
            let itemName = result.doc.itemName;
            let serviceType = result.doc.serviceType;
            let serviceName = result.doc.serviceName;
            let mongoId = result._id.toString();//mongodb的id为特定类型，必须转换为字符串才能写入mysql中
            console.log('itemCategory:',itemCategory,'itemName:',itemName,'serviceType:',serviceType,'serviceName:',serviceName,'mongoId:',mongoId);
            let mysqlInputData = function (){//mysql同步mongodb数据
                pool.getConnection((err, connection)=> {
                    console.log('----mysql operation----');
                    if (err) {
                        console.log(err);
                    }
                    connection.query('insert into link_mongo(itemCategory,itemName,serviceType,serviceName,mongoId) values(?,?,?,?,?)', [itemCategory,itemName,serviceType,serviceName,mongoId], function(err, result2){
                        connection.release();
                        console.log(result2);
                        if (err) {
                            mysqlInputData();
                            // resSend.jsonSend('-1', 'error', '', res);
                            throw err;
                        } else if (result2) {
                            resSend.jsonSend('0', 'success', result2, res);
                        }
                    });
                });
            };
            mysqlInputData();
        });

        let testSchema =  mongoose.Schema({singleCommodity:{}},{collection:'testjson'});
        let TestModel = db.model('testModel',testSchema);
        let arr = {singleCommodity:req.body};
        let mongoInputData = function () {//mongodb数据写入函数
            TestModel.create(arr, (err, result) => {
                if (err) {
                    mongoInputData();//mongodb数据写入失败重新写入
                    throw err;
                    // resSend.jsonSend('-1', 'error', '', res);
                } else {
                    console.log(result);
                    // resSend.jsonSend('0', 'success', result, res);
                    // myEmitter.emit('upload',result);//mongodb写入成功，调用upload事件将数据写入mysql
                }
                db.close();
            });
        };
        mongoInputData();
    },

    upload_image:function (req, res) {
        console.log('----upload from frontEnd---');
        //生成multiparty对象，并配置上传路径
        var form = new multiparty.Form({
            uploadDir: './public/images',
            encoding: 'utf-8',
            // maxFilesSize: 2 * 1024 * 1024,
        });
        //上传文件
        form.parse(req, function(err, fields, files) {
            if(err){
                console.log(err);
            }else {
                // res.send('upload success');
                console.log('--uploaded to backEnd--');

                console.log('11111',files);
                console.log('22222',files.file[0]);
                console.log('33333',files.file[0].path);
                console.log('random file name:',path.basename(files.file[0].path));

                qiniu_upload(files.file[0].path, path.basename(files.file[0].path),res);//调用七牛云上传函数,传入文件路径和随机文件名
            }
        });

        /*七牛云上传:输入文件路径和文件名称*/
        function qiniu_upload(path, name, res) {
            console.log('---qiniu---');
            //需要填写自己的 Access Key 和 Secret Key
            qiniu.conf.ACCESS_KEY = 'jppXPa5SOIzQeAkABmg-aRDufNgVT60XqYM7HjEu';
            qiniu.conf.SECRET_KEY = 'O2nM52GIvmH3KubRLXq_g8jpJyHcqdqKnzi-H-QK';

            let bucket = 'rifewang';//要上传的空间

            let key = name;//上传到七牛后保存的文件名

            //构建上传策略函数
            function uptoken(bucket, key) {
                let putPolicy = new qiniu.rs.PutPolicy(bucket+':'+key);
                return putPolicy.token();
            }

            let token = uptoken(bucket, key);//生成上传 Token

            // 测试 filePath = './public/images/1.png';
            const filePath = path;//要上传文件的本地路径

            //构造上传函数
            function uploadFile(uptoken, key, localFile) {
                let extra = new qiniu.io.PutExtra();
                qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
                    if(!err) {
                        // 上传成功， 处理返回值
                        console.log(ret.hash, ret.key, ret.persistentId);
                    } else {
                        // 上传失败， 处理返回代码
                        console.log(err);
                    }
                });
            }

            //调用uploadFile上传
            uploadFile(token, key, filePath);

            let urlPic = 'http://oiil9hcbg.bkt.clouddn.com/' + key;
            console.log(urlPic);
            res.send(urlPic);
        }
    }
};
