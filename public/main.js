$(document).ready(function () {
    listen();
});

let intervalId = null;

function listen() {
    let $kickstarterUrl = $('input[name=kickstarterUrl]');

    $('#retrievePledgeLevelsBtn').click(function () {
        event.preventDefault();
        retrievePledgeLevels($kickstarterUrl.val());
    });

    $('#watchBtn').click(function () {
        event.preventDefault();
        watch($kickstarterUrl.val(), $('select[name=pledgeLevels]').val());
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

    getKickstarterPledgeInfo(url, function (err, levels) {
        if (err) {
            $firstOption.text("Pledge Levels");
            return;
        }
        levels.forEach(function (level) {
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
    function kickstarterInfo(err, results) {
        if (err) {
            //do something
            return;
        }
        const relevantLevels = getRelevantPledges(results, desiredLevels);
        addStatsToTable(relevantLevels);
        const slotAvailable = relevantLevels.some(function(data){
            return data.backerStats.remaining === null || data.backerStats.remaining > 0
        });

        if(slotAvailable) {
            clearInterval(intervalId);

            //redirects to kickstarter
            window.open($('input[name=kickstarterUrl]').val());
        }
    }

    getKickstarterPledgeInfo(url, kickstarterInfo);

    intervalId = setInterval(function () {
        getKickstarterPledgeInfo(url, kickstarterInfo);
    }, 30000);
}

function getRelevantPledges(results, desiredLevels) {
    return results.filter(function (campaignPledge) {
        return desiredLevels.some(function (element) {
            return element === campaignPledge.pledgeTitle;
        });
    });

}

function addStatsToTable(pledgeLevels) {
    let date = (new Date()).toTimeString();

    pledgeLevels.forEach(function (pledgeLevel) {

        $('#pledge-levels').prepend(`
      <tr>
         <td>${pledgeLevel.pledgeTitle}</td>
         <td>${pledgeLevel.backerStats.remaining  === null ? 'Unlimited': pledgeLevel.backerStats.remaining}</td>
         <td>${pledgeLevel.backerStats.pledged }</td>
         <td>${pledgeLevel.backerStats.max || 'Unlimited'}</td>
         <td>${date}</td>
      </tr>
      `);
    });
}

function getKickstarterPledgeInfo(url, doneFn) {
    $.ajax({
        type: 'POST',
        url: '/api/kickstarter-info',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({kickstarterUrl: url})
    }).done(function (results) {
        doneFn(null, results);
    }).fail(function () {
        doneFn('Could not retrieve pledge levels');
    });
}
