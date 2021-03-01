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
            body div #myId {
                width: 100px;
                background-color: #00ff00;
            }
            body div .myImg {
                width: 30px;
                background-color: #f11;
            }
        </style>
    </head>
    <body>
        <div>
            <img id="myId" />
            <img class="img myImg" />
        </div>
    </body>
</html>
`
    );
});

server.listen(8088);
console.log('server started');
