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
    pledgeAvailable: {
      sel: '.pledge__backer-stats',
      method: function ($) {
        var allGone = $(this).children('.pledge__limit').text().trim() === 'Reward no longer available';
        return !allGone;
      }
    }
  });
  return tierAvailability;
}

app.listen('8000');

console.log('app listening on port', 8000);

exports = module.exports = app;