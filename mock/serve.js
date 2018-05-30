var path = require('path');
var fs = require("fs");
var express = require("express");

var port = 8989;
var app = express();

app.use(function(req, resp, next){
    resp.setHeader('Access-Control-Allow-Origin', '*');
    resp.setHeader('Access-Control-Allow-Headers', '*');
    next();
});

app.options('**/*.do', function(req, resp){
    resp.end();
});

function handler(req, resp){
    console.info(req.method);

    var filename = path.join(__dirname , req.path);
    console.info(req.path);
    var result;
    if(fs.existsSync(filename)){
        var content = fs.readFileSync(filename);
        content = "(" + content + ")";
        result = eval(content);

        if(result instanceof Function){
            result = result({
                queries: req.query,
                headers: req.headers,
                method: req.method,
                path: req.url,
                req:req
            });
            if(!(result instanceof Promise)) {
                result = Promise.resolve(result);
            }
        }else{
            result = Promise.resolve(result);
        }
    }else{
        console.warn("file ", req.path, "not found!");
        result = Promise.reject({
            status: 404,
            message: "Not Found",
            code: "NotFound"
        });
    }
    result.then(function(data){
        if(data.headers) {
            for(var name in data.headers) {
                resp.setHeader(name, data.headers[name]);
            }
        }

        if(data.status) {
            resp.status(data.status);
        }
        let contentType = data.contentType || (data.headers ? data.headers['Content-Type'] : undefined);
        if(data.body instanceof Buffer) {
            resp.setHeader('Content-Type', contentType || 'application/octet-stream');
            resp.write(data.body);
        } else {
            resp.setHeader('Content-Type', contentType || 'application/json;charset=utf8');
            resp.write(JSON.stringify({
                success: true,
                data: data.body
            }));
        }
        resp.end();
    }, function(err) {
        resp.status(err.status || 500).send(JSON.stringify({
            success: false,
            message: err.message || 'Server error',
            code: err.code || 'ServerError'
        }));
	    resp.setHeader("Content-Type", "application/json;charset=utf-8");
        console.error(err.message, err.stack);
        resp.end();
    });
}

app.get("/api/**/*.do", handler);
app.post("/api/**/*.do", handler);
app.put("/api/**/*.do", handler);

app.listen(port);

console.log("listening on port: %s", port);
