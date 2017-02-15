/**
 * Created by dpwangying on 2016/11/15.
 */
var express = require('express');
var router = express.Router();
var orderService = require('../service/OrderService');

/*订单管理--查询订单*/
router.post('/car/orderManage/findOrder', function (req, res, next) {
    orderService.findOrder(req, res, next);
});

/*订单管理--增加订单*/
router.post('/car/orderManage/addOrder', function (req, res, next) {
    orderService.addOrder(req, res, next);
});

/*订单管理--修改订单*/
router.post('/car/orderManage/updateOrder', function (req, res, next) {
    orderService.updateOrder(req, res, next);
});

/*订单管理--删除订单*/
router.post('/car/orderManage/deleteOrder', function (req, res, next) {
    orderService.deleteOrder(req, res, next);
});

module.exports = router;