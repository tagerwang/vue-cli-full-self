console.time('start server-after-package need time')
const http = require('http')
const fs = require('fs')
var proxyhttp = require('express-http-proxy')
var express = require('express')
var app = express()
var proxy = require('./server-proxy')
app.set('roots', __dirname+'/dist')
app.use('/', express.static(app.get('roots')))
app.engine('html', require('ejs').renderFile)
for (var i in proxy.dev.proxy) {
    if (proxy.dev.proxy.hasOwnProperty(i)) {
        console.log(i, proxy.dev.proxy[i].target)
        app.use(i + '/*', proxyhttp(proxy.dev.proxy[i].target, {
            proxyReqPathResolver: function (req, res) {
                console.log(req.originalUrl)
                return req.originalUrl
            }
        }))
    }
}
app.use('*', function (req, res, next) {
  fs.readFile(app.get('roots')+'/index.html', 'utf-8', (err, content) => {
    if (err) {
      console.log('We cannot open "index.htm" file.')
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    })
    res.end(content)
  })
});
var server = app.listen(proxy.portPro, function () {
    var host = server.address().address
    var port = server.address().port
    console.log('app listening at ' + require("os").hostname() + ' http://localhost:' + port)
    console.timeEnd('start server-after-package need time')
})
