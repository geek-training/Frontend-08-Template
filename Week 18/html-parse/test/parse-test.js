var assert = require('assert');

import {parseHTML} from "../src/parser.js";

describe('parse html', function() {

    it("<a></a>", function() {
        const tree = parseHTML('<a></a>');
        assert.equal(tree.children[0].tagName, 'a');
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href='https://time.geekbang.org'></a>", function() {
        const tree = parseHTML("<a href='https://time.geekbang.org'></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href ></a>", function() {
        const tree = parseHTML("<a href ></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href id ></a>", function() {
        const tree = parseHTML("<a href id ></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href='abc' id ></a>", function() {
        const tree = parseHTML("<a href='abc' id ></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href=\"abc\"></a>", function() {
        const tree = parseHTML("<a href=\"abc\"></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a href='abc' id='abc' ></a>", function() {
        const tree = parseHTML("<a href='abc' id='abc' ></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a id=abc></a>", function() {
        const tree = parseHTML("<a id=abc ></a>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a id=abc/>", function() {
        const tree = parseHTML("<a id=abc/>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a id=\'abc\'/>", function() {
        const tree = parseHTML("<a id=\'abc\'/>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<a />", function() {
        const tree = parseHTML("<a />");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<A /> upper case", function() {
        const tree = parseHTML("<A />");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].children.length, 0);
    });

    it("<>", function() {
        const tree = parseHTML("<>");
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].type, "text");
    });

    it("<div style='width: 100px'></div>", function() {
        const tree = parseHTML("<div style='width: 100px'></div>");
        console.log(tree);
        assert.equal(tree.children.length, 1);
        assert.equal(tree.children[0].type, "element");
    });
});

