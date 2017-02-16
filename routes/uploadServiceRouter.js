/**
 * Created by dpwangying on 2017-1-12.
 */
var express = require('express');
var router = express.Router();
var service = require('../service/uploadService');

/*获取服务类别*/
router.get('/find/service/class', function (req, res, next) {
    service.find_service_class(req, res, next);
});

/*获取定义好的单商品类别*/
router.get('/find/commodity/class', function (req, res, next) {
    service.find_commodity_class(req, res, next);
});

/*获取已发布的单商品类别*/
router.get('/find/uploaded/commodity/class', function (req, res, next) {
    service.find_uploaded_commodity_class(req, res, next);
});

/*发布单商品---数据写入到mongodb并实时同步到mysql*/
router.post('/upload/commodity', (req, res, next) => {
    service.upload_commodity(req, res, next);
});

/*服务发布--接受前端由单商品组合而成的单一服务项写入后台数据库*/
router.post('/upload/service', (req, res, next) => {
    service.upload_service(req, res, next);
});

/*文件(图片)上传: 前端到后台再到七牛云*/
router.post('/upload/image', (req, res)=>{
    service.upload_image(req, res);
});

/*根据单商品种类获取该类别所有已发布的商品列表*/
router.post('/find/commodity/byClass', (req, res)=>{
    service.find_commodity_byClass(req, res);
});

/*增加服务类别*/
router.post('/add/service/class', (req, res)=>{
    service.add_service_class(req, res);
});

module.exports = router;
