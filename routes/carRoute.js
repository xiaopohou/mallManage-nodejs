/**
 * Created by dpwangying on 2016/9/5.
 */
var express = require('express');
var router = express.Router();
var carService = require('../service/CarService');
var backService = require('../service/BackService');

/*查询*/
router.get('/car/show', function (req, res, next) {
    carService.show(req, res, next);
});

/*预约*/
router.post('/car/appoint', function (req, res, next) {
    carService.appoint(req, res, next);
});

/*后台维护--登录*/
router.post('/car/login', function (req, res, next) {
    backService.login(req, res, next);
});

/*后台维护--增加表单*/
router.post('/car/backServer/addForm', function (req, res, next) {
    backService.addForm(req, res, next);
});

/*后台维护--修改表单*/
router.post('/car/backServer/updateForm', function (req, res, next) {
    backService.updateForm(req, res, next);
});

/*后台维护--删除表单*/
router.post('/car/backServer/deleteForm', function (req, res, next) {
    backService.deleteForm(req, res, next);
});

/*后台维护--查询表单*/
router.post('/car/backServer/findForm', function (req, res, next) {
    backService.findForm(req, res, next);
});

module.exports = router;