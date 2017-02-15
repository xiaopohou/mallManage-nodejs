/**
 * Created by dpwangying on 2017-1-12.
 */
var express = require('express');
var router = express.Router();
var service = require('../service/服务发布service');

/*服务发布*/
router.get('/upload/service/list', function (req, res, next) {
    service.upload_service_list(req, res, next);
});

/*服务发布--前端获取定义好的单商品类别*/
router.get('/commodity/class', function (req, res, next) {
    service.commodity_class(req, res, next);
});

/*服务发布--前端获取已发布的单商品类别*/
router.get('/commodity/category', function (req, res, next) {
    service.commodity_category(req, res, next);
});

/*json数据写入测试*/
router.post('/test', (req, res, next) => {
    service.test(req, res, next);
});

/*服务发布--接受前端由单商品组合而成的单一服务项写入后台数据库*/
router.post('/service/put', (req, res, next) => {
    service.service_put(req, res, next);
});

/*文件上传: 前端到后台再到七牛云*/
router.post('/upload/image', (req, res)=>{
    service.upload_image(req, res);
});

/*根据商品种类获取商品列表*/
router.post('/find/commodityList/byClass', (req, res)=>{
    service.findCommodityListByClass(req, res);
});

module.exports = router;