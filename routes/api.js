/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

var expect = require("chai").expect;
var MongoClient = require("mongodb");
var priceC = require("yahoo-stock-prices");
const fetch = require("node-fetch");
module.exports = function(app, db) {
  app.route("/api/stock-prices").get(function(req, res) {
    if (typeof req.query.stock !== "string") {
      let stocks = req.query.stock;
      stocks[0] = stocks[0].toUpperCase();
      stocks[1] = stocks[1].toUpperCase();
      priceC.getCurrentPrice(stocks[0], (err, price) => {
        if (err) console.log(err);
        if (price) {
          priceC.getCurrentPrice(stocks[1], (err2, price2) => {
            if (err2) console.log(err2);
            if (price2) {
              db.collection("stocks").findOne(
                { stock: stocks[0] },
                (err, doc) => {
                  if (err) console.log(err);
                  let likes = 0;
                  let temp = false;
                  if (doc) {
                    likes = doc.likes;
                  } else {
                    doc = {};
                    doc.stock = stocks[0];
                    doc.ips = [];
                    doc.likes = 0;
                    temp = true;
                  }
                  if (req.query.like) {
                    const ip = req.ip;
                    //console.log(ip);
                    if (doc && doc.ips && !doc.ips.includes(ip)) {
                      likes++;
                      doc.likes = likes;
                      doc.ips.push(ip);
                      db.collection("stocks").save(doc);
                    }
                  } else if (temp) db.collection("stocks").save(doc);

                  db.collection("stocks").findOne(
                    { stock: stocks[1] },
                    (err2, doc2) => {
                      if (err2) console.log(err);
                      let likes2 = 0;
                      let temp = false;
                      if (doc2) {
                        likes2 = doc2.likes;
                      } else {
                        doc2 = {};
                        doc2.stock = stocks[1];
                        doc2.ips = [];
                        doc2.likes = 0;
                        temp = true;
                      }
                      if (req.query.like) {
                        const ip = req.ip;
                        if (doc2 && doc2.ips && !doc2.ips.includes(ip)) {
                          likes2++;
                          doc2.likes = likes2;
                          doc2.ips.push(ip);
                          db.collection("stocks").save(doc2);
                        }
                      } else if (temp) db.collection("stocks").save(doc2);

                      let stockData = [
                        {
                          stock: stocks[0],
                          price: price,
                          rel_likes: likes - likes2
                        },
                        { stock: stocks[1], price: price2, rel_likes: likes2 - likes }
                      ];
                      res.json({ stockData: stockData });
                    }
                  );
                }
              );
            }
          });
        }
      });
    } else {
      let stock = req.query.stock.toUpperCase();
      priceC.getCurrentPrice(stock, (err, price) => {
        if (price) {
          db.collection("stocks").findOne({ stock: stock }, (err, doc) => {
            if (err) console.log(err);
            let likes = 0;
            let temp = false;
            if (doc) {
              likes = doc.likes;
            } else {
              doc = {};
              doc.stock = stock;
              doc.ips = [];
              doc.likes = 0;
              temp = true;
            }
            if (req.query.like) {
              const ip = req.ip;
              //console.log(ip);
              if (doc && doc.ips && !doc.ips.includes(ip)) {
                likes++;
                doc.likes = likes;
                doc.ips.push(ip);
                db.collection("stocks").save(doc);
              }
            } else if (temp) db.collection("stocks").save(doc);
            let stockData = { stock: stock, price: price, likes: likes };
            res.json({ stockData: stockData });
          });
          
        }
      });
    }
  });
};
