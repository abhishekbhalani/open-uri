
var open = require('..')
  , fs = require('fs')
  , should = require('should');

describe('HTTPS scheme', function(){

  it('should GET an encrypted website', function(next){
    open('https://github.com', function(err, github){
      if(err){ return next(err); }
      github.should.be.a('string');
      github.length.should.be.above(0);
      next();
    })
  });

  it('should GET an encrypted website with auth', function(next){
    open('https://user:pass@google.com', function(err, google){
      if(err){ return next(err); }
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