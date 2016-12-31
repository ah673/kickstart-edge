const express = require('express');
const request = require('request');
const artoo = require('artoo-js');
const cheerio = require('cheerio');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.listen(process.env.PORT || 8000);
console.log('app listening on port', process.env.PORT || 8000);

app.post('/api/kickstarter-info', function (req, res) {
  console.log('getting page', req.body.kickstarterUrl);
  var options = {
    url: req.body.kickstarterUrl,
    headers: {
      'User-Agent': 'request'
    }
  };
  request(options, function(error, response, html) {
    if (error) {
      console.error('error requesting url', req.body.kickstarterUrl);
      res.writeHead(500, error);
      res.end();
      return;
    }

    res.json(parsePledgeLevels(html));

  });

});

app.get('/', function (req, res) {
  res.writeHead(200);
  res.end('Front end goes here');
});

function parsePledgeLevels (html) {
  console.log(html);
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
  console.log('tierAvailability', tierAvailability);
  return tierAvailability;
}

function backers (backerStr) {
  return parseInt(backerStr.trim().replace(/\,/g, '').match(/(\d+) backers/)[1]);
}

exports = module.exports = app;