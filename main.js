$(document).ready(function () {
  listen();
});

function listen() {
  $('#pledgeForm').submit(function (event) {
    event.preventDefault();
    watch($('#kickstarterUrl').val(), $('#pledgeLevels').val());
  });
}

function watch(url, pledgeLevels) {
  $.ajax({
    type: 'POST',
    url: '/api/kickstarter-info',
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify({kickstarterUrl: url})
  }).done(function(data) {
    $('#results').html(data)
  });
}
