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
    watch($('input[name=kickstarterUrl]').val(), []);
  });
}

/**
 * Retrieve pledge levels from Kickstarter URL
 * @param url {string}
 */
function retrievePledgeLevels(url) {
  let $dropdown = $('select[name=pledgeLevels]');
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
  });
}

/**
 * Monitor Kickstarter page for updates to selected pledge levels
 * @param url {string}
 * @param levels {Array}
 */
function watch(url, levels, doneFn) {

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
