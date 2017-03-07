// Location class
class Location{
    constructor(name, latitude, longitude, timestamp = null) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}

// Alert class
class Alert {
    constructor(title, description, color) {
        this.title = title;
        this.description = description;
        this.color = color;
    }

    toDOM() {
        let alertDiv = document.createElement('div');
        alertDiv.className += 'alert';
        document.documentElement.style.setProperty('--alert-background-color', this.color);

        let alertTitleDiv = document.createElement('div');
        alertTitleDiv.className += 'alert-title';
        alertTitleDiv.innerText = this.title;

        let alertDescriptionDiv = document.createElement('div');
        alertDescriptionDiv.className += 'alert-description';
        alertDescriptionDiv.innerText = this.description;

        let closeButton = document.createElement('button');
        closeButton.className = 'alert-close';
        closeButton.innerHTML = '&times;';

        alertDiv.appendChild(alertTitleDiv);
        alertDiv.appendChild(alertDescriptionDiv);
        alertDiv.appendChild(closeButton);

        return alertDiv;
    }
}

// DOM Element
let name          = document.getElementById('name');
let latitude      = document.getElementById('latitude');
let longitude     = document.getElementById('longitude');
let save          = document.getElementById('save');
let locationsList = document.getElementById('locationsList');
let alert         = document.getElementById('alert');

let message = null;
let locations = new Array();

// Const
const ERROR = '#F44336';
const WARNING = '#FFEB3B';
const INFO = '#00BCD4';

// Useful function to refresh the GUI when the user add a new location.
function refreshUI() {
    while (locationsList.firstChild) {
        locationsList.removeChild(locationsList.firstChild);
    }

    locations.forEach(location => {

        L.marker([location.latitude, location.longitude])
            .addTo(map)
            .bindPopup(location.name);

        let liDOM = document.createElement('li');
        let textNode = document.createTextNode(
            location.name + ' ' + location.latitude + ' ' + location.longitude
        );

        liDOM.appendChild(textNode);
        locationsList.appendChild(liDOM);
    });

    // Alert related code
    alert.childNodes.forEach((node) => alert.removeChild(node));
    if (message !== null) {
        alert.appendChild(message.toDOM())
        message = null;
    }
}

function addLocation() {
    if (name.value !== '') {
        locations.push(new Location(name.value, latitude.value, longitude.value));
    } else {
        message = new Alert('Error', 'Please fill the name', ERROR);
    }
    
    refreshUI();
}

// Map related
var map = L.map('map');
if ("geolocation" in navigator) {
    navigator.geolocation.watchPosition(position => {
        map.setView([position.coords.latitude, position.coords.longitude], 14);
    });
} else {
    map.setView([49, 1], 14);
    message = new Alert('Error', 'Enable to use the geolocation', ERROR);
}

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Listeners
map.on('click', e => {
    name.value = '';
    latitude.value = e.latlng.lat;
    longitude.value = e.latlng.lng;
    name.focus();
});

save.addEventListener('click', e => {
    addLocation();
});

alert.addEventListener('click', e => {
    alert.style.opacity = 1;

    (function fade() {
        if ((alert.style.opacity -= .1) < 0) {
            alert.childNodes.forEach((node) => alert.removeChild(node));
            alert.style.opacity = 1;
        } else {
            requestAnimationFrame(fade);
        }
    })();
});

name.addEventListener('keyup', e => {
    if (e.keyCode === 13) {
      addLocation();
    } else {
        let value = new RegExp(/[a-zA-Z]/, "g");
        save.disabled = !value.test(name.value);
    }
});

refreshUI();
