// make environment variable or user input
const url = 'https://www.kickstarter.com/projects/poots/kingdom-death-monster-15';
const pledgeTiers = ['Frogdog'];



const express = require('express');
const request = require('request');
const artoo = require('artoo-js');
const cheerio = require('cheerio');

const app = express();

app.get('/', function (req, res) {

  request(url, function(error, response, html) {
    if (error) {
      console.log(error);
      return;
    }
    parseForTiers(html, pledgeTiers);
    res.writeHead(200);
    res.end(html);

  });

});

function parseForTiers (html, pledgeTiers) {
  var $ = cheerio.load(html);
  artoo.setContext($);

  var list = artoo.scrape('.NS_projects__rewards_list li.hover-group', {
    pledgeLevel: {
      sel: '.pledge__title',
      method: 'text'
    }

  });
  console.log(list);

}

app.listen('8000');

console.log('app listening on port', 8000);

exports = module.exports = app;