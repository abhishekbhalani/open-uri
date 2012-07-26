
var open = require('..')
  , mocha = require('mocha')
  , assert = require('assert')
  , should = require('should')
  , misc = require('./misc');

describe('File scheme', function(){

  it('should get a relative file', function(next){
    open(__dirname+'/../README.md', function(err, log){
      assert.ifError(err);
      assert.ok(Buffer.isBuffer(log));
      assert.ok(log.length>0);
      next();
    })
  });

  it('should get a stream from an absolute file path', function(next){
    var stream = misc.writeStream();
    open('file:///var/log/system.log',stream)
    stream.on('close', function(){
      assert.ok(stream.written);
      assert.ok(stream.ended);
      next();
    });
  });

  it('should send an error', function(next){
    open('/i-dont-exist!', function(err, content){
      assert.ok(err.message.indexOf('File Not Found') !== -1);
      should.not.exist(content);
      next()
    });
  });

});
