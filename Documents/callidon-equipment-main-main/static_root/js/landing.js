/*!
 * This is the custom JS code for a landing page
 * structure and design built for SEO purposes
 * by WebSell Corporation C.A.
 */

async function getZipCode(lat, lng) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;

    try {
        const response = await axios.get(url);
        if ( response.data && response.data.address && response.data.address.postcode ) {
            return response.data.address.postcode;
        } else {
            console.error('No postcode found in the response');
        }
    } catch ( error ) {
        console.error('Error making request:', error);
    }

    return null; // Return null if zip code is not found
}

const geoFindMe = () => {
    if ( navigator.geolocation ) {
        navigator.geolocation.getCurrentPosition(success, error, geoOptions);
    } else {
        console.log("Geolocation services are not supported by your web browser.");
    }
};

var zip = null;

const success = ( position ) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const altitude = position.coords.altitude;
    const accuracy = position.coords.accuracy;
    
    zip = getZipCode(latitude, longitude).then(zipCode => {
        if (zipCode) {
            console.log('Zip Code:', zipCode);
            return zipCode;
        } else {
            console.log('Zip Code not found');
            return null;
        }
    });

    console.log(`lat: ${latitude} long: ${longitude} zip: ${zip}`);
}

const error = ( error ) => {
    console.log(`Unable to retrieve your location due to ${error.code}: ${error.message}`);
}

const geoOptions = {
    enableHighAccuracy: true,
    maximumAge: 30000,
    timeout: 27000
};

(function($) {

    /* Do something here for the standard landing page UI functionality */

})(jQuery);
