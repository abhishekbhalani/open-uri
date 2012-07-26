
var open = require("..")
  , addressable = require("addressable")
  , assert = require("assert")
  , misc = require("./misc");

exports["GET a website"] = function(beforeExit){
  var loaded = false;
  open("http://google.com",function(err,google){
    loaded = true;
    assert.ifError(err)
    assert.type(google,"string")
    assert.ok(google.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["GET a website with an addressable.URI object"] = function(beforeExit){
  var loaded = false;
  var url = addressable.parse("http://google.com");
  open(url,function(err,google){
    loaded = true;
    assert.ifError(err)
    assert.type(google,"string")
    assert.ok(google.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["GET a website with a node.js built-in URL object"] = function(beforeExit){
  var loaded = false;
  var url = require("url").parse("http://google.com");
  open(url,function(err,google){
    loaded = true;
    assert.ifError(err)
    assert.type(google,"string")
    assert.ok(google.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["GET a website with auth"] = function(beforeExit){
  var loaded = false;
  open("http://user:pass@google.com",function(err,google){
    loaded = true;
    assert.ifError(err)
    assert.type(google,"string")
    assert.ok(google.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["POST a string to a website"] = function(){
  misc.echo(++misc.port,function(server){
    open("http://localhost:"+misc.port,{method:"POST",body:"abc"},function(err,dump,res){
      server.close()
      assert.ifError(err)
      assert.equal(res.headers["content-type"],"text/plain")
      assert.equal(dump.toString(),"abc")
    })
  })
}

exports["POST a buffer to a website"] = function(){
  misc.echo(++misc.port,function(server){
    open("http://localhost:"+misc.port,{method:"POST",body:new Buffer([1,2,3,4]),headers:{"Content-Type":"application/octet-stream"}},function(err,dump,res){
      server.close()
      assert.ifError(err)
      assert.equal(res.headers["content-type"],"application/octet-stream")
      assert.ok(Buffer.isBuffer(dump))
      assert.equal(dump.length,4)
    })
  })
}

exports["PUT a form to a website"] = function(){
  misc.echo(++misc.port,function(server){
    open("http://localhost:"+misc.port,{method:"POST",body:"a=1&b=2&c=3",headers:{"Content-Type":"application/x-www-form-urlencoded"}},function(err,dump,res){
      server.close()
      assert.ifError(err)
      assert.equal(res.headers["content-type"],"application/x-www-form-urlencoded")
      assert.type(dump,"object")
      assert.eql(dump,{a:1,b:2,c:3})
    })
  })
}

exports["POST some json to a website"] = function(){
  misc.echo(++misc.port,function(server){
    open("http://localhost:"+misc.port,{method:"POST",body:'{"a":1,"b":2,"c":3}',headers:{"Content-Type":"application/json"}},function(err,dump,res){
      server.close()
      assert.ifError(err)
      assert.equal(res.headers["content-type"],"application/json")
      assert.type(dump,"object")
      assert.eql(dump,{a:1,b:2,c:3})
    })
  })
}


exports["POST stream text to a website"] = function(){
  misc.echo(++misc.port,function(server){
    var file = require("fs").createReadStream("README.md");
    open("http://localhost:"+misc.port,{method:"POST",body:file},function(err,dump,res){
      server.close()
      assert.ifError(err)
      assert.equal(res.headers["content-type"],"text/plain")
      assert.type(dump,"string")
      assert.eql(dump,require("fs").readFileSync("README.md","utf8"))
    })
  })
}

exports["GET a redirect with a relative Location"] = function(beforeExit){
  var loaded = false;
  open("http://golang.org/cmd/5a",function(err,go,res){
    loaded = true
    assert.ifError(err)
    assert.includes(go,'<title>5a - The Go Programming Language</title>')
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["GET a redirect with a relative Location without 'follow'"] = function(beforeExit){
  var loaded = false;
  open("http://golang.org/cmd/5a",{follow:false},function(err,go,res){
    loaded = true
    assert.ifError(err)
    assert.equal(res.statusCode,301)
    assert.includes(go,'Moved Permanently')
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["Chain it"] = function(beforeExit){
  var stream = misc.writeStream();
  var loaded = false;
  open("http://google.com",stream)("file:///var/log/system.log",function(err,google){
    loaded = true;
    assert.type(google.toString(),"string")
    assert.ok(google.length>0)
  })
  beforeExit(function(){
    assert.ok(loaded)
    assert.ok(stream.written)
    assert.ok(stream.ended)
  })
}