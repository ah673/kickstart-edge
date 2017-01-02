$(document).ready(function () {
  listen();
});

function listen() {
  $('#retrievePledgeLevelsBtn').click(function () {
    event.preventDefault();
    retrievePledgeLevels($('input[name=kickstarterUrl]').val());
  });

  $('#watchBtn').click(function() {
    event.preventDefault();
    watch($('input[name=kickstarterUrl]').val(), ['Frogdog']);
  });
}

/**
 * Retrieve pledge levels from Kickstarter URL
 * @param url {string}
 */
function retrievePledgeLevels(url) {
  let $dropdown = $('select[name=pledgeLevels]');
  $dropdown.children('option').remove();
  $dropdown.append('<option>Loading ...</option>');
  let $firstOption = $dropdown.find('option:eq(0)');
  
  $firstOption.text("Loading ...");

  getKickstarterPledgeInfo(url, function(err, levels) {
    if (err) {
      $firstOption.text("Pledge Levels");
      return;
    }
    levels.forEach(function(level) {
      $dropdown.append('<option>' + level.pledgeTitle + '</option>');
      $firstOption.remove();
    });

    $dropdown.attr("disabled", false);
  });
}

/**
 * Monitor Kickstarter page every 30 seconds for updates to selected pledge levels
 * @param url {string}
 * @param levels {Array}
 */
function watch(url, desiredLevels) {
  function kickstarterInfo (err, results) {
    if (err) {
        //do something
        return;
    }
    showRelevant(results, desiredLevels);
  }

  getKickstarterPledgeInfo(url, kickstarterInfo);

  const intervalId = setInterval(function () {
    getKickstarterPledgeInfo(url, kickstarterInfo);
  }, 30000);
}



function showRelevant (results, desiredLevels) {
    const relevantPledgeLevels = results.filter(function(campaignPledge){
      return desiredLevels.some(function(element){
          return element === campaignPledge.pledgeTitle;
      });
    });

    relevantPledgeLevels.forEach(function (pledgeLevel) {
      $('#pledge-levels').prepend(`
      <tr>
         <td>${pledgeLevel.pledgeTitle}</td>
         <td>${pledgeLevel.backerStats.remaining || 'Unlimited'}</td>
         <td>${pledgeLevel.backerStats.pledged}</td>
         <td>${pledgeLevel.backerStats.max || 'Unlimited'}</td>
         <td>${new Date()}</td>
      </tr>
      `);
    })

}

function getKickstarterPledgeInfo(url, doneFn) {
  $.ajax({
    type: 'POST',
    url: '/api/kickstarter-info',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({kickstarterUrl: url})
  }).done(function(results) {
    doneFn(null, results);
  }).fail(function() {
    doneFn('Could not retrieve pledge levels');
  });
}
