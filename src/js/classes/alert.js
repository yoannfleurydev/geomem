export class Alert {
    constructor(title, description) {
        this.title = title;
        this.description = description;
    }

    toDOM() {
        let alertDiv = document.createElement('div');
        alertDiv.className += 'alert';

        let alertTitleDiv = document.createElement('div');
        alertTitleDiv.className += 'alert-title';
        alertTitleDiv.innerText = this.title;

        let alertDescriptionDiv = document.createElement('div');
        alertDescriptionDiv.className += 'alert-description';
        alertDescriptionDiv.innerText = this.description;

        alertDiv.appendChild(alertTitleDiv);
        alertDiv.appendChild(alertDescriptionDiv);

        return alertDiv;
    }
}
