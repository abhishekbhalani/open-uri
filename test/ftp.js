
var open = require('..')
  , assert = require('assert');

exports['GET a text file from ftp'] = function(beforeExit){
  var loaded = false;
  open('ftp://ftp.sunet.se/pub/Internet-documents/rfc/rfc100.txt',function(err,rfc){
    loaded = true
    assert.ifError(err)
    assert.type(rfc,'string')
    assert.ok(rfc.length > 0)
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports['Attempt to get a non-existing text file from ftp'] = function(beforeExit){
  var loaded = false;
  open('ftp://ftp.sunet.se/im-not-here.txt',function(err,rfc){
    loaded = true
    assert.ok(err)
    assert.type(rfc,'undefined')
  })
  beforeExit(function(){assert.ok(loaded)})
}

exports['Stream a text file from ftp to a file'] = function(beforeExit){
  var path = '/tmp/rfc-'+Date.now()+'.html';
  var file = require('fs').createWriteStream(path)
  open('ftp://ftp.sunet.se/pub/Internet-documents/rfc/rfc100.txt',file)
  beforeExit(function(){
    assert.doesNotThrow(function(){
      require('fs').statSync(path)
    })
  })
}