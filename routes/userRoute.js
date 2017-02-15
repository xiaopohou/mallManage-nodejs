/**
 * Created by dpwangying on 2016/10/31.
 */
var express = require('express');
var router = express.Router();
var userService = require('../service/UserService');

/*用户管理--查询用户*/
router.post('/car/userManage/findUser', function (req, res, next) {
    userService.findUser(req, res, next);
});

/*用户管理--增加用户*/
router.post('/car/userManage/addUser', function (req, res, next) {
    userService.addUser(req, res, next);
});

/*用户管理--修改用户*/
router.post('/car/userManage/updateUser', function (req, res, next) {
    userService.updateUser(req, res, next);
});

/*用户管理--删除用户*/
router.post('/car/userManage/deleteUser', function (req, res, next) {
    userService.deleteUser(req, res, next);
});

module.exports = router;