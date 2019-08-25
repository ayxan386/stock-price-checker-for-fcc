/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
    
    suite('GET /api/stock-prices => stockData object', function() {
      let firstget = null;
      test('1 stock', function(done) {
       chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog'})
        .end(function(err, res){
          firstget = res.body.stockData;
          assert.equal(res.status,200);
          assert.equal(firstget.stock,"GOOG");
          done();
        });
      });
        let secondget = null;
      test('1 stock with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',like:true})
        .end(function(err, res){
          secondget = res.body.stockData;
          assert.equal(res.status,200);
          assert.equal(secondget.stock,"GOOG");
          assert.isAtLeast(secondget.likes,firstget.likes);
          done();
        });
      });
      
      test('1 stock with like again (ensure likes arent double counted)', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: 'goog',like:true})
        .end(function(err, res){
          assert.equal(res.status,200);
          assert.equal(res.body.stockData.stock,"GOOG");
          assert.isAtLeast(res.body.stockData.likes,firstget.likes);
          done();
        });
      });
      test('2 stocks', function(done) {
          chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog',"tsla"]})
        .end(function(err, res){
            
          let data = res.body.stockData;//it should be an array
          firstget = data;
          assert.equal(res.status,200);
          assert.isArray(data);
          assert.equal(data.length,2);
          assert.equal(data[0].stock,"GOOG");
          assert.equal(data[1].stock,"TSLA");
          done();
        });
      });
      
      test('2 stocks with like', function(done) {
        chai.request(server)
        .get('/api/stock-prices')
        .query({stock: ['goog',"tsla"],like:true})
        .end(function(err, res){
          let data = res.body.stockData;//it should be an array
          assert.equal(res.status,200);
          assert.isArray(data);
          assert.equal(data.length,2);
          assert.equal(data[0].stock,"GOOG");
          assert.equal(data[1].stock,"TSLA");
          assert.equal(data[0].rel_likes + data[1].rel_likes,0);
          done();
        });
      });
      
    });

});
