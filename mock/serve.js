var path = require('path');
var fs = require("fs");
var express = require("express");

var port = 8989;
var app = express();

app.use(function(req, res, next){
	res.setHeader("Content-Type", "application/json;charset=utf-8");
	next();
});

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
    console.info(filename);
    var result;
    if(fs.existsSync(filename)){
        var content = fs.readFileSync(filename);
        content = "(" + content + ")";
        // jshint evil:true
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
    result.then(function(body){
        content = JSON.stringify({
            success: true,
            data: body
        });
        resp.write(content);
        resp.end();
    }, function(err) {
        resp.status(err.status || 500).send(JSON.stringify({
            success: false,
            message: err.message || 'Server error',
            code: err.code || 'ServerError'
        }));
        console.error(err.message, err.stack);
        resp.end();
    });
}

app.get("/api/**/*.do", handler);
app.post("/api/**/*.do", handler);
app.put("/api/**/*.do", handler);

app.listen(port);

console.log("listening on port: %s", port);
