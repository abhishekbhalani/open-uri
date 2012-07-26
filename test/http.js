
var open = require('..')
  , fs = require('fs')
  , addressable = require('addressable')
  , should = require('should')
  , misc = require('./misc');

describe('HTTP scheme', function(){

  it('should do an HTTP GET', function(next){
    open('http://google.com', function(err, google){
      if(err){ return next(err); }
      google.should.be.a('string');
      google.length.should.be.above(0);
      next();
    })
  });

  it('should do an HTTP GET with an addressable.URI object', function(next){
    var url = addressable.parse('http://google.com');
    open(url, function(err, google){
      if(err){ return next(err); }
      google.should.be.a('string')
      google.length.should.be.above(0);
      next();
    });
  });

  it('should do an HTTP GET with a node.js built-in URL object', function(next){
    var url = require('url').parse('http://google.com');
    open(url, function(err,google){
      if(err){ return next(err); }
      google.should.be.a('string');
      google.length.should.be.above(0);
      next();
    })
  });

  it('should do an HTTP GET with auth', function(next){
    open('http://user:pass@google.com', function(err, google){
      if(err){ return next(err); }
      google.should.be.a('string');
      google.length.should.be.above(0);
      next();
    })
  });

  it('should do an HTTP POST with a string', function(next){
    misc.echo(++misc.port, function(server){
      open('http://localhost:'+misc.port,{method:'POST',body:'abc'}, function(err, dump, res){
        server.close();
        if(err){ return next(err); }
        res.headers['content-type'].should.equal('text/plain');
        dump.toString().should.equal('abc');
        next();
      })
    })
  });

  it('should POST a buffer to a website', function(next){
    misc.echo(++misc.port, function(server){
      open('http://localhost:'+misc.port,{method:'POST',body:new Buffer([1,2,3,4]),headers:{'Content-Type':'application/octet-stream'}}, function(err, dump, res){
        server.close();
        if(err){ return next(err); }
        res.headers['content-type'].should.equal('application/octet-stream');
        dump.should.be.an.instanceof(Buffer);
        dump.length.should.equal(4);
        next();
      })
    })
  });

  it('should do an HTTP PUT', function(next){
    misc.echo(++misc.port, function(server){
      open('http://localhost:'+misc.port,{method:'PUT',body:new Buffer('abcd'),headers:{'Content-Type':'application/x-www-form-urlencoded'}}, function(err, dump, res){
        server.close();
        if(err){ return next(err); }
        res.headers['content-type'].should.equal('application/x-www-form-urlencoded');
        dump.should.eql({abcd:''})
        next();
      })
    })
  });

  it('should POST some json to a website', function(next){
    misc.echo(++misc.port, function(server){
      open('http://localhost:'+misc.port,{method:'POST',body:'{"a":1,"b":2,"c":3}',headers:{'Content-Type':'application/json'}}, function(err,dump,res){
        server.close();
        if(err){ return next(err); }
        res.headers['content-type'].should.equal('application/json');
        dump.should.be.a('object')
        dump.should.eql({a:1,b:2,c:3});
        next();
      })
    })
  });

  it('should POST stream text to a website', function(next){
    misc.echo(++misc.port, function(server){
      var file = require('fs').createReadStream('README.md');
      open('http://localhost:'+misc.port,{method:'POST',body:file}, function(err, dump, res){
        server.close();
        if(err){ return next(err); }
        res.headers['content-type'].should.equal('text/plain');
        dump.should.be.a('string');
        dump.should.eql(fs.readFileSync('README.md','utf8'));
        next();
      });
    });
  });

  it('should get a redirect with a relative Location', function(next){
    open('http://golang.org/cmd/5a', function(err,go,res){
      if(err){ return next(err); }
      go.should.include('<title>5a - The Go Programming Language</title>');
      next()
    });
  });

  it('should GET a redirect with a relative Location without "follow"', function(next){
    open('http://golang.org/cmd/5a',{follow:false}, function(err,go,res){
      if(err){ return next(err); }
      res.statusCode.should.equal(301);
      go.should.include('Moved Permanently');
      next();
    });
  });

  it('should Chain it', function(next){
    var stream1 = misc.writeStream();
    var stream2 = misc.writeStream();
    stream1.on('close', done);
    stream2.on('close', done);
    open('http://google.com', stream1)('file:///var/log/system.log', stream2);
    function done(){
      if(!stream1.ended || !stream2.ended){ return }
      stream1.written.should.be.ok
      stream2.written.should.be.ok
      next()
    }
  });
  
});
