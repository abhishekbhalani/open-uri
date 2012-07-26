
var open = require("..")
  , assert = require("assert")
  , misc = require("./misc");

exports["GET a relative file"] = function(beforeExit){
  var loaded = false;
  open("README.md",function(err,log){  
    loaded = true;
    assert.ifError(err)
    assert.ok(Buffer.isBuffer(log))
    assert.type(log.toString(),"string")
    assert.ok(log.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports["GET Stream an absolute file"] = function(beforeExit){
  var stream = misc.writeStream();
  open("file:///var/log/system.log",stream)
  beforeExit(function(){
    assert.ok(stream.written)
    assert.ok(stream.ended)
  })
}

exports["Throw when error without callback."] = function(){
  assert.throws(function(){
    open("/i-dont-exist!")
  })
}

exports["Does not throw when error with a callback."] = function(){
  assert.doesNotThrow(function(){
    open("/i-dont-exist!",function(err){ assert.ok(err) })
  })
}
