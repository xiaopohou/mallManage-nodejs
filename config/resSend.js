/**
 * Created by dpwangying on 2016/9/7.
 */
module.exports = {
    jsonSend: function (code, msg, result, res) {
        if (typeof result === undefined){
            res.json({
                code: '-1',
                msg: 'error'
            });
        } else {
            res.json({
                code: code,
                msg: msg,
                body: result
            });
        }
    }
};