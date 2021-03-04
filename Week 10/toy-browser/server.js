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
                height: 500px;
                display: flex;
            }
            #container #myId {
                width: 200px;
            }
            #container .c1 {
                flex: 1;
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
