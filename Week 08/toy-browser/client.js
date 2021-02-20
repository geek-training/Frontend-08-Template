const Request = require('./request');

void async function() {
    let request = new Request({
        method: 'POST',
        host: '127.0.0.1',
        port: '8088',
        path: '/',
        headers: {
            ['X-Foo2']: 'customer'
        },
        body: {
            name: 'xq'
        }
    });

    let response = await request.send();

    console.log(response);
}();
