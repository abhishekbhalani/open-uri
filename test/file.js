
var open = require('..')
  , should = require('should')
  , misc = require('./misc');

describe('File scheme', function(){

  it('should get a relative file', function(next){
    open(__dirname+'/../README.md', function(err, log){
      if(err){ return next(err); }
      log.should.be.an.instanceof(Buffer);
      log.length.should.be.above(0);
      next();
    })
  });

  it('should get a stream from an absolute file path', function(next){
    var stream = misc.writeStream();
    open('file:///var/log/system.log',stream)
    stream.on('close', function(){
      stream.written.should.be.ok
      stream.ended.should.be.ok
      next();
    });
  });

  it('should send an error', function(next){
    open('/i-dont-exist!', function(err, content){
      err.message.should.include('File Not Found');
      should.not.exist(content);
      next()
    });
  });

});
