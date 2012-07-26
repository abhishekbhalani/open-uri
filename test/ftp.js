
var open = require('..')
  , fs = require('fs')
  , should = require('should');

describe('FTP scheme', function(){

  it('should get a text file from ftp', function(next){
    open('ftp://ftp.sunet.se/pub/Internet-documents/rfc/rfc100.txt', function(err, rfc){
      if(err){ return next(err); }
      rfc.should.be.a('string')
      rfc.length.should.be.above(0);
      next();
    })
  });

  it('should attempt to get a non-existing text file from ftp', function(next){
    open('ftp://ftp.sunet.se/im-not-here.txt', function(err, rfc){
      err.should.be.an.instanceof(Error);
      should.not.exist(rfc);
      next()
    })
  });

  it('should stream a text file from ftp to a file', function(next){
    var path = '/tmp/rfc-'+Date.now()+'.html';
    var file = require('fs').createWriteStream(path)
    open('ftp://ftp.sunet.se/pub/Internet-documents/rfc/rfc100.txt',file)
    file.on('close', function(){
      fs.stat(path, next)
    });
  });
  
});