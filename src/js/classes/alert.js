export class Alert {
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

// Constants
export const ERROR   = '#F44336';
export const WARNING = '#FFEB3B';
export const INFO    = '#00BCD4';
