/**
 * Created by dpwangying on 2016/10/27.
 */
var express = require('express');
var router = express.Router();
var netService = require('../service/NetService');

/*网点管理--查询网点*/
router.post('/car/netManage/findNet', function (req, res, next) {
    netService.findNet(req, res, next);
});

/*网点管理--增加网点*/
router.post('/car/netManage/addNet', function (req, res, next) {
    netService.addNet(req, res, next);
});

/*网点管理--修改网点*/
router.post('/car/netManage/updateNet', function (req, res, next) {
    netService.updateNet(req, res, next);
});

/*网点维护--删除网点*/
router.post('/car/netManage/deleteNet', function (req, res, next) {
    netService.deleteNet(req, res, next);
});

module.exports = router;