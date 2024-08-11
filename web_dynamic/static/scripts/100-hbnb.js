$(document).ready(function() {
    const selectedAmenities = {};
    const selectedStates = {};
    const selectedCities = {};

    // Check the API status
    $.getJSON('http://0.0.0.0:5001/api/v1/status/', function(data) {
        if (data.status === 'OK') {
            $('#api_status').addClass('available');
        } else {
            $('#api_status').removeClass('available');
        }
    });

    // Listen for changes on each input checkbox for amenities
    $('input[type="checkbox"]').change(function() {
        const id = $(this).attr('data-id');
        const name = $(this).attr('data-name');
        const isAmenity = $(this).closest('.amenities').length > 0;
        const isState = $(this).closest('.locations').find('h2').length > 0;

        if ($(this).is(':checked')) {
            if (isAmenity) {
                selectedAmenities[id] = name;
            } else if (isState) {
                selectedStates[id] = name;
            } else {
                selectedCities[id] = name;
            }
        } else {
            if (isAmenity) {
                delete selectedAmenities[id];
            } else if (isState) {
                delete selectedStates[id];
            } else {
                delete selectedCities[id];
            }
        }

        const amenityNames = Object.values(selectedAmenities).join(', ');
        const locationNames = [...Object.values(selectedStates), ...Object.values(selectedCities)].join(', ');

        $('.amenities h4').text(amenityNames.length ? amenityNames : '&nbsp;');
        $('.locations h4').text(locationNames.length ? locationNames : '&nbsp;');
    });

    // Fetch and display places
    function fetchPlaces(states = [], cities = [], amenities = []) {
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search/',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ states: states, cities: cities, amenities: amenities }),
            success: function(data) {
                $('.places').empty();

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
    }

    // Initial fetch of all places
    fetchPlaces();

    // Fetch places based on selected states, cities, and amenities when button is clicked
    $('button').click(function() {
        const states = Object.keys(selectedStates);
        const cities = Object.keys(selectedCities);
        const amenities = Object.keys(selectedAmenities);
        fetchPlaces(states, cities, amenities);
    });
});

