
var open = require('..')
  , fs = require('fs')
  , assert = require('assert')
  , should = require('should');

describe('HTTPS scheme', function(){

  it('should GET an encrypted website', function(next){
    open('https://github.com', function(err, github){
      assert.ifError(err);
      assert.ok(typeof github === 'string');
      assert.ok(github.length>0);
      next();
    })
  });

  it('should GET an encrypted website with auth', function(next){
    open('https://user:pass@google.com', function(err, google){
      assert.ifError(err);
      google.should.be.a('string');
      google.length.should.be.above(0);
      next();
    })
  });
   
  it('should GET Stream a website to a file', function(next){
    var path = '/tmp/goog-'+Date.now()+'.html';
    var file = require('fs').createWriteStream(path)
    open('https://encrypted.google.com/search?q=open+uri', file)
    file.on('close', function(){
      fs.stat(path, next);
    });
  });
  
});