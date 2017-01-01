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
  $dropdown.children('option').remove();
  $dropdown.append('<option>Loading ...</option>');
  let $firstOption = $dropdown.find('option:eq(0)');

  $.ajax({
    type: 'POST',
    url: '/api/kickstarter-info',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({kickstarterUrl: url})
  }).done(function(levels) {
    levels.forEach(function(level) {
      $dropdown.append('<option>' + level.pledgeTitle + '</option>');
    });

    $firstOption.remove();
  }).fail(function() {
    alert("Error retrieving pledge levels from Kickstarter.");
    $firstOption.text("Pledge Levels");
  });
}

/**
 * Monitor Kickstarter page for updates to selected pledge levels
 * @param url {string}
 * @param levels {Array}
 */
function watch(url, levels) {
  //TODO: complete stub
}
