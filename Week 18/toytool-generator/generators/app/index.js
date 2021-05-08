var Generator = require('yeoman-generator');

module.exports = class extends Generator {
    constructor(args, opts) {
        super(args, opts);
    }

    async initPackage() {
        let answer = await this.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Your project name',
                default: this.appname
            }
        ]);
        this.answer = answer
        const pkgJson = {
            "name": answer.name,
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "build": "webpack",
                "test": "mocha --require @babel/register",
                "coverage": "nyc mocha --require @babel/register"
            },
            "keywords": [],
            "author": "",
            "license": "ISC",
            "devDependencies": {
            }
        }
        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
        this.npmInstall();
        this.npmInstall(['vue'], {'save-dev': false});
        this.npmInstall(['webpack', 'webpack-cli', 'vue-loader', 'vue-template-compiler',
            'vue-style-loader', 'babel-loader', 'babel-plugin-istanbul',
            '@istanbuljs/nyc-config-babel',
            'mocha', 'nyc',
            '@babel/core', '@babel/preset-env',
            '@babel/register', 'css-loader',
            'copy-webpack-plugin'
        ], {'save-dev': true});
    }

    copyFiles() {
        this.fs.copyTpl(
            this.templatePath('sample-test.js'),
            this.destinationPath('test/sample-test.js'),
            {},
        )
        this.fs.copyTpl(
            this.templatePath('.babelrc'),
            this.destinationPath('.babelrc'),
            {},
        )
        this.fs.copyTpl(
            this.templatePath('.nycrc'),
            this.destinationPath('.nycrc'),
            {},
        )
        this.fs.copyTpl(
            this.templatePath('HelloWorld.vue'),
            this.destinationPath('src/HelloWorld.vue'),
            {},
        )
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('main.js'),
            this.destinationPath('src/main.js'),
            {}
        )
        this.fs.copyTpl(
            this.templatePath('index.html'),
            this.destinationPath('src/index.html'),
            {
                title: this.answer.name
            }
        )
    }

};
