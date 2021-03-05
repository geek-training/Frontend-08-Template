const http = require('http');

const server = http.createServer((request, response) => {
    console.log('request received!');
    console.log(request.headers);
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('X-Foo', 'bar');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(
`
<html maa=a>
    <head>
        <style>
            #container {
                width: 500px;
                height: 300px;
                display: flex;
                background-color: #fff;
            }
            #container #myId {
                width: 200px;
                height: 100px;
                background-color: #f00;
            }
            #container .c1 {
                flex: 1;
                background-color: #0f0;
            }
        </style>
    </head>
    <body>
        <div id=container>
            <div id="myId" />
            <div class="ic1" />
        </div>
    </body>
</html>
`
    );
});

server.listen(8088);
console.log('server started');
