
/**
 * Created by dpwangying on 2016/12/12.
 */
module.exports = {
    mysql: {
        host    :'localhost',
        user    :'root',
        password:'root',
        database:'appoint_server',
        port    : 3306,
        connectionLimit : 30,//连接数限制，默认为10
        multipleStatements: true//允许同时执行多条sql语句
    }
};
