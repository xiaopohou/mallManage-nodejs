module.exports = {

    httpRequest: (sql, res) => {
        const http = require('http');

        let body = {
            'sql': sql
        }
        console.log('sql: ', body.sql);
        let bodyString = JSON.stringify(body);

        let options = {
            host: '127.0.0.1',
            port: 8888,
            path: '/mysql/select',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }

        let request = http.request(options, (response) => {
            response.setEncoding('utf8');
            response.on('data', (chunk) => {
                console.log(`response: ${chunk}`);
                res.json(JSON.parse(chunk));
            });
            response.on('end', () => {
                console.log('no more data in response');
            });
        });

        request.on('error', (e) => {
            //TODO: handle error.
            console.log(`problem with request: ${e.message}`);
        });
        request.write(bodyString);
        request.end();

    }
}
