
var open = require('..')
  , assert = require('assert');

exports['GET an encrypted website'] = function(beforeExit){
  var loaded = false;
  open('https://github.com',function(err,github){
    loaded = true;
    assert.ifError(err)
    assert.type(github,'string')
    assert.ok(github.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports['GET an encrypted website with auth'] = function(beforeExit){
  var loaded = false;
  open('https://user:pass@google.com',function(err,google){
    loaded = true;
    assert.ifError(err)
    assert.type(google,'string')
    assert.ok(google.length>0)
  })
  beforeExit(function(){assert.ok(loaded)})
}
 
exports['GET Stream a website to a file'] = function(beforeExit){
  var path = '/tmp/goog-'+Date.now()+'.html';
  var file = require('fs').createWriteStream(path)
  open('https://encrypted.google.com/search?q=open+uri',file)
  beforeExit(function(){
    assert.doesNotThrow(function(){
      require('fs').statSync(path)
    })
  })
}