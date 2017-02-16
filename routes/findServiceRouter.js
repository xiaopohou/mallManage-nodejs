/**
 * Created by dpwangying on 2016/12/12.
 */
var express = require('express');
var router = express.Router();
var service = require('../service/findService');

/*查询门店*/
router.post('/find/store/by-city', function (req, res, next) {
    service.find_store_by_city(req, res, next);
});

/*查询具有某服务的所有门店*/
router.post('/find/store/by-service', function (req, res, next) {
    service.find_store_by_service(req, res, next);
});

/*根据门店查询服务项目*/
router.post('/find/service/by-store', function (req, res, next) {
    service.find_service_by_store(req, res, next);
});

/*热门服务推荐*/
router.get('/recommend/hot-service', function (req, res, next) {
    service.hot_service(req, res, next);
});

/*热门门店推荐*/
router.get('/recommend/hot-store', function (req ,res, next) {
    service.hot_store(req, res, next);
});

/*个人搜索*/
router.post('/search', function (req, res, next) {
    service.search(req, res, next);
});

/*查询所有服务*/
router.post('/find/service/all', function (req, res, next) {
    service.find_all_service(req, res, next);
});



module.exports = router;
