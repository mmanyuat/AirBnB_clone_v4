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

    // Listen for changes on each input checkbox
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

    // Fetch and display places
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search/',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({}),
        success: function(data) {
            data.forEach(place => {
                const article = $('<article></article>');
                const titleBox = $('<div class="title_box"></div>').append(
                    $('<h2></h2>').text(place.name),
                    $('<div class="price_by_night"></div>').text(`$${place.price_by_night}`)
                );
                const information = $('<div class="information"></div>').append(
                    $('<div class="max_guest"></div>').text(`${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}`),
                    $('<div class="number_rooms"></div>').text(`${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}`),
                    $('<div class="number_bathrooms"></div>').text(`${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}`)
                );
                const description = $('<div class="description"></div>').html(place.description);

                article.append(titleBox, information, description);
                $('.places').append(article);
            });
        }
    });
});

