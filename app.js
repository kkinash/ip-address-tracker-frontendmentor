const searchParams = new URLSearchParams(window.location.search);
let fetchString = "";
const api_key = "at_MLAa5dcdZ18Hg8V3okXilvWc0wqaf";

//Map
let map = L.map('map').setView([40.78275784786692, -73.96603899779818], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map)

let lat
let lon
let ip = "";
let searchMode = "ipAddress";

// Case 1: if there is NO ?ip in url - fetchString uses "&ipAdress" and ip = "";
// Case 2: if there IS ?ip in url =>
// Case 2.1 - its Domain (domain.com, 99designs.be)
// Case 2.2 - its IP address (8.8.8.8)

if (!searchParams.has('ip')) { // If there is NO ?ip in url: 
} else {
    ip = searchParams.get('ip');
    var pattern = /^[A-Za-z0-9.]+$/; // Define a regular expression pattern to match letters, dots, and numbers (domains) 

    if (pattern.test(ip)) {     // If it is Domain
        searchMode = "domain";
    }
}

fetchString = `https://geo.ipify.org/api/v2/country,city?apiKey=at_MLAa5dcdZ18Hg8V3okXilvWc0wqaf&${searchMode}=${ip}`;


if (ip !== "") {
    document.getElementById("ip2").value = ip;
}

// Use a free IP geolocation service like "ip-api.com" to fetch geolocation data
fetch(fetchString)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        lat = data.location.lat;
        lon = data.location.lng;
        document.getElementById("ip-adress").innerHTML = data.ip;
        document.getElementById("location").innerHTML = `${data.location.country}, ${data.location.city} ${data.location.postalCode}`;
        document.getElementById("timezone").innerHTML = `UTC ${data.location.timezone}`;
        document.getElementById("isp").innerHTML = data.isp;

        // Initialize the map with the correct coordinates from query

        const mapLocation = (lat, lon) => {

            map.setView([lat, lon], 13)
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);

            var customIcon = L.icon({
                iconUrl: './images/icon-location.svg',
                // shadowUrl: 'leaf-shadow.png',

                iconSize: [42, 48], // size of the icon
                shadowSize: [2, 2], // size of the shadow
                iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
                shadowAnchor: [4, 62],  // the same for the shadow
                popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
            });
            L.marker([lat, lon], { icon: customIcon }).addTo(map);


        };
        mapLocation(lat, lon);
    })

    .catch(error => {
        if (error.message === 'Network response was not ok') {
            console.error('Network error:', error);
            dialog.showModal();
        } else {
            console.error('Error fetching geolocation data:', error);
            dialog.showModal();
        }
    });









