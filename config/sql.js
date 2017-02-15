/**
 * Created by dpwangying on 2016/9/5.
 */
module.exports = {
    show: 'select * from info',//查询网点、时间点及剩余可预约个数
    appoint: 'insert into appointment(carNumber,carCategory,userName,userPhone,appointDate,appointTime,maintainWay,maintainCategory,netId)'
    + ' values(?,?,?,?,?,?,?,?,?)',//预约提交表单
    selectSurplus: 'select surplus from info where date=? and time=? and netId=?',//查询所选网点及时间点的剩余可预约个数
    updateSurplus: 'update info set surplus=? where date=? and time=? and netId=?',//修改所选网点及时间点对应的剩余可预约个数

    addForm: 'insert into info(date,time,netId,surplus,discount) values(?,?,?,?,?)',//维护--增加表单
    updateForm: 'update info set surplus=? ,discount=? where date=? and time=? and netId=?',//维护--修改表单
    // deleteForm: 'delete from info where uuid=?',//维护--删除表单
    findForm: 'select * from info where ',//查询所选网点及时间点的全部信息

    login: 'select * from sysusers where user=? and password=?',//维护--登录

    findNet: 'select * from net_info where ',//网点管理--查询网点
    addNet: 'insert into net_info(netId,netName,netAddress,netManager,netPhone) values(?,?,?,?,?)',//网点管理--增加网点
    updateNet: 'update net_info set netName=?,netAddress=?,netManager=?,netPhone=? where netId=?',//网点管理--修改网点信息
    deleteNet: 'delete from net_info where netId=?',//网点管理--删除网点

    findUser: 'select * from user_info where ',//用户管理--查询用户
    addUser: 'insert into user_info(userId,userName,userAddress,userCar,userPhone) values(?,?,?,?,?)',//用户管理--增加用户
    updateUser: 'update user_info set userName=?,userAddress=?,userCar=?,userPhone=? where userId=?',//用户管理--修改用户信息
    deleteUser: 'delete from user_info where userId=?',//用户管理--删除用户

    findOrder: 'select * from appointment where ',//订单管理--查询订单
    addOrder: 'insert into appointment(uuid,carNumber,carCategory,userName,userPhone,appointTime,maintainWay,maintainCategory,netId) values(?,?,?,?,?,?,?,?,?)',//订单管理--增加订单
    updateOrder: 'update appointment set carNumber=?,carCategory=?,userName=?,userPhone=?,appointTime=?,maintainWay=?,maintainCategory=?,netId=? where uuid=?',//订单管理--修改订单信息
    deleteOrder: 'delete from appointment where uuid=?',//订单管理--删除订单
};