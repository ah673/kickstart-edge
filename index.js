// make environment variable or user input
const url = 'https://www.kickstarter.com/projects/poots/kingdom-death-monster-15';
const requestedTiers = ['Frogdog'];



const express = require('express');
const request = require('request');
const artoo = require('artoo-js');
const cheerio = require('cheerio');

const app = express();

app.get('/', function (req, res) {

  request(url, function(error, response, html) {
    if (error) {
      res.writeHead(500, error);
      res.end();
      return;
    }

    res.json(parsePledgeLevels(html));

  });

});

function parsePledgeLevels (html) {
  var $ = cheerio.load(html);
  artoo.setContext($);

  const tierAvailability = artoo.scrape('.NS_projects__rewards_list li.pledge--available:not([data-prefill-amount]), li.pledge--all-gone', {
    pledgeTitle: {
      sel: '.pledge__title',
      method: function ($) {
        return $(this).text().trim();
      }
    },
    backerStats: {
      sel: '.pledge__backer-stats',
      method: function ($) {
        var results = {
          max: null,
          remaining: null,
          pledged: null
        };

        var backerCount = backers($(this).children('.pledge__backer-count').text());
        var pledgeLimit = $(this).children('.pledge__limit').text().trim();
        if (pledgeLimit === 'Reward no longer available') {
          results.max = backerCount;
          results.remaining = 0;
          results.pledged = backerCount;
        } else {
          var demandAndSupply = pledgeLimit.match(/(\d+) left of (\d+)/);
          // no limit on backers
          if (demandAndSupply === null) {
            results.max = null;
            results.remaining = null;
            results.pledged = backerCount;
          } else {
            results.max = parseInt(demandAndSupply[2]);
            results.remaining = parseInt(demandAndSupply[1]);
            results.pledged = backerCount;
          }
        }

        return results;
      }
    }
  });
  return tierAvailability;
}

function backers (backerStr) {
  return parseInt(backerStr.trim().replace(/\,/g, '').match(/(\d+) backers/)[1]);
}

app.listen('8000');

console.log('app listening on port', 8000);

exports = module.exports = app;