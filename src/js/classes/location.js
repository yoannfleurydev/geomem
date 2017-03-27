export class Location{
    constructor(name, latitude, longitude, timestamp = null) {
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.timestamp = timestamp;
    }
}
