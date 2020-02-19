import { Alert } from './classes/alert';
import { Location } from './classes/location';

// DOM Element
let name           = document.getElementById('name');
let latitude       = document.getElementById('latitude');
let longitude      = document.getElementById('longitude');
let save           = document.getElementById('save');
let locationsList  = document.getElementById('locations-list');
let alert          = document.getElementById('alert');
let download       = document.getElementById('download');
let savePanel      = document.getElementById('save-panel');
let locationsPanel = document.getElementById('locations-panel');

let savePanelButton      = document.getElementById('save-panel-button');
let mapPanelButton       = document.getElementById('map-panel-button');
let locationsPanelButton = document.getElementById('locations-panel-button');

let message = null;
let locations = [];

let marker = L.icon({
    iconUrl: require('../img/marker.png'),
    iconSize: [30, 30]
});
let map = L.map('map', {'zoomControl': false, 'attributionControl': false});

// Useful function to refresh the GUI when the user add a new location.
function refreshUI() {
    while (locationsList.firstChild) {
        locationsList.removeChild(locationsList.firstChild);
    }

    locations.forEach(location => {
        L.marker([location.latitude, location.longitude], {icon: marker})
            .addTo(map)
            .bindPopup(location.name);

        let liDOM = document.createElement('li');

        liDOM.appendChild(document.createTextNode(location.name));
        liDOM.className += "locations-list-item";
        liDOM.addEventListener('click', e => {
            map.setView([location.latitude, location.longitude], 16);
        });
        locationsList.appendChild(liDOM);
    });

    // Alert related code
    while (alert.firstChild) {
        alert.removeChild(alert.firstChild);
    }
    
    if (message !== null) {
        alert.appendChild(message.toDOM());
        message = null;
    }
}

function addLocation() {
    if (name.value !== '') {
        locations.push(new Location(name.value, latitude.value, longitude.value));
    } else {
        message = new Alert('Error', 'Please fill the name');
    }
    
    refreshUI();
}

// Map related
if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
        map.setView([position.coords.latitude, position.coords.longitude], 14);
    });
} else {
    map.setView([49, 1], 14);
    message = new Alert('Error', 'Enable to use the geolocation');
}

L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(map);

// Listeners
map.on('click', e => {
    savePanel.style.display = 'flex';
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
        if ((alert.style.opacity -= 0.1) < 0) {
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
        let value = new RegExp(/[a-zA-Z]/, 'g');
        save.disabled = !value.test(name.value);
    }
});

download.addEventListener('click', e => {
    downloadData(locations, `geomem${new Date().getTime()}.txt`, 'json');
});

document.getElementById('upload').addEventListener('change', e => {
    uploadData(e.target.files[0]);
}, false);

savePanel.style.display = 'none';
savePanelButton.addEventListener('click', e => {
    if (savePanel.style.display === 'flex') {
        savePanel.style.display = 'none';
    } else {
        savePanel.style.display = 'flex';
    }
});

locationsPanel.style.display = 'none';
locationsPanelButton.addEventListener('click', e => {
    if (locationsPanel.style.display === 'flex') {
        locationsPanel.style.display = 'none';
    } else {
        locationsPanel.style.display = 'flex';
    }
});

mapPanelButton.addEventListener('click', e => {
    locationsPanel.style.display = 'none';
    savePanel.style.display = 'none';
});

if (window.File && window.FileReader && window.FileList && window.Blob) {
  
} else {
  messages.push(new Alert('File API', 'The File APIs are not fully supported in this browser.', WARNING));
}

refreshUI();

/*-- File download --*/
function downloadData(data, filename, type) {
    let a = document.createElement('a'),
        file = new Blob([JSON.stringify(data)], {type: type});
    if (window.navigator.msSaveOrOpenBlob) {// IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    } else { // Others
        var url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

/*-- File upload --*/
function uploadData(file) {
    var textType = /text.*/;

    console.log(file.type);

    if (file.type.match(textType)) {
        var reader = new FileReader();

        reader.onload = e => {
            locations = JSON.parse(reader.result);
            refreshUI();
        };

        reader.readAsText(file);	
    } else {
        messages.push(new Alert('File', 'File not supported!'));
    }
}
