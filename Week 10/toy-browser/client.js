const images = require("images");
const Request = require("./request/request");
const parser = require("./parser/parser");
const render = require("./render/render");

void (async function () {
  let request = new Request({
    method: "POST",
    host: "127.0.0.1",
    port: "8088",
    path: "/",
    headers: {
      ["X-Foo2"]: "customer",
    },
    body: {
      name: "xq",
    },
  });

  let response = await request.send();

  let dom = parser.parseHTML(response.body);

  let viewport = images(800, 600);

  render(viewport, dom);

  viewport.save('viewport.jpg');

})();
