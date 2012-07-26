
var Stream = require('stream').Stream
  , port = 65000;

module.exports = {
    // Empty stream writer
    writeStream: function(){
      var stream = new Stream();
      stream.written = false;
      stream.ended = false;
      stream.writable = true;
      stream.write = function(d){stream.written = true};
      stream.end = function(d){stream.ended = true};
      return stream;
    },
    // A simple test echo server
    port: port,
    echo: function (port,fn){
      var http = require('http').createServer(function(req,res){
        var headers = {'Content-Type': req.headers['content-type'] || 'text/plain'}
        if( req.headers['content-length'] ) 
          headers['Content-Length'] = req.headers['content-length'];
        res.writeHead(200, headers)
        req.pipe(res)
      })
      http.listen(port,function(){fn(http)})
    }
}