import * as Sentry from '@sentry/browser/dist/index'

export default class PrivyrWP {
    constructor(license_code, name, email, phonenumber) {
        this.license_code = license_code;
        this.field_names = {};
        this.initializeInputIdsToPrivyr(name, email, phonenumber);
        let self = this;
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                self.initializeAndConfigureSentry();
                self.captureLeads();
            }
        }
    }

    initializeInputIdsToPrivyr(name, email, phonenumber) {
        this.field_names[name] = 'name';
        this.field_names[email] = 'email';
        this.field_names[phonenumber] = 'phonenumber';
    }

    mapIds(inputs) {
        let self = this;
        inputs.map((object) => {
            if (self.field_names[object['name']]) {
                object["name"] = self.field_names[object['name']];
            }
        });
        return inputs;
    }

    _post_xhr_request(post_url, payload, async) {
        async = async || false;
        let xhr = new XMLHttpRequest();
        xhr.open('POST', post_url, async);
        xhr.onload = () => {
            console.log(xhr.status);
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
    }

    postLeads(lead) {
        let payload = {
            'license_code': this.license_code,
            'lead': lead,
            'hostname': window.location.hostname,
            'full_url': window.location.href
        };
        let post_url = 'https://www.{host}/integrations/api/v1/new-wpcf7-lead'.replace('{host}', window['_pvyr_host']);
        this._post_xhr_request(post_url, payload)
    }

    _sending_beat() {
        console.log("Beat is initialized!!!");
        // FIXME: commenting becuse of unneccessary requests
        // let payload = {
        //     "license_code": this.license_code,
        //     "full_url": window.location.protocol + '//' + window.location.host + window.location.pathname,
        //     "hostname": window.location.hostname,
        //     "integrated_form_type": "WPCF7Form"
        // }
        // let post_url = `https://www.${window['_pvyr_host']}/integrations/api/v1/website-cf-beat`;
        // this._post_xhr_request(post_url, payload, true);
    }

    captureLeads() {
        let self = this;
        // this listener is attached to document, so multiple cf7 can be listened on the same page
        document.addEventListener('wpcf7submit', (event) => {
            try {
                let status = event.detail.apiResponse.status; // Possible values: "validation_failed", "mail_failed", "success"
                // DO NOT Proceed if status is validation failed
                if (status === "validation_failed") {
                    return;
                }
                // Proceed in other cases.
                let inputs = event.detail.inputs;
                self.postLeads(self.mapIds(inputs));
            } catch (err) {
                Sentry.captureException(err);
            }
        }, false);
        // This sends beat everytime this script is loaded and a listener is attached
        this._sending_beat();
    }

    initializeAndConfigureSentry() {
        let self = this;
        Sentry.init({
            dsn: 'https://2a012299e8c04df985e58df6ea529c7d@o382871.ingest.sentry.io/5213384',
            defaultIntegrations: false
        });
        Sentry.configureScope(scope => {
            scope.setUser({"license_code": self.license_code});
            scope.setTag("hostname", window.location.hostname);
            scope.setTag("full_url", window.location.href);
            scope.setTag("integrated_form_type", "WPCF7Form");
        });
    }
}