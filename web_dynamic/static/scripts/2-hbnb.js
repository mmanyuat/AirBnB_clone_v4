$(document).ready(function() {
    const selectedAmenities = {};

    // Check the API status
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    $('input[type="checkbox"]').change(function() {
        const amenityId = $(this).attr('data-id');
        const amenityName = $(this).attr('data-name');

        if ($(this).is(':checked')) {
            selectedAmenities[amenityId] = amenityName;
        } else {
            delete selectedAmenities[amenityId];
        }

        const amenityNames = Object.values(selectedAmenities).join(', ');
        $('.amenities h4').text(amenityNames.length ? amenityNames : '&nbsp;');
    });
});

