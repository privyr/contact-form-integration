import * as Sentry from '@sentry/browser/dist/index'

export default class PrivyrNinjaCfIntegration {
    constructor(config) {
        let {license_code} = config;
        this.license_code = license_code;
        this.startApp();
    }

    _uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    _fetch_lead_user_id() {
        let luid = sessionStorage.getItem('luid');
        if (luid) return luid;
        luid = this._uuidv4();
        // sessionStorage gets clear when page session ends
        sessionStorage.setItem('luid', luid);
        return luid;
    }

    postLeads(lead) {
        let payload = {
            'license_code': this.license_code,
            'lead': lead,
            'hostname': window.location.hostname,
            'full_url': window.location.href,
            'luid': this._fetch_lead_user_id()
        };
        let xhr = new XMLHttpRequest();
        let post_url = `https://www.${window['_pvyr_host']}/integrations/api/v1/new-generic-cf-lead`;
        xhr.open('POST', post_url);
        xhr.onload = () => {
            console.log(xhr.status);
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
    }

    _prepare_input_obj(inputElem) {
        return {
            "id": inputElem.key || '',
            "name": inputElem.name || '',
            "placeholder": inputElem.placeholder || '',
            "type": inputElem.type || '',
            "value": inputElem.value || '',
            "label": inputElem.label || ''
        }
    };

    processLeads(form) {
        try {
            let input_fields = [];
            let inputs = form.data.fields;
            if (inputs) {
                Object.keys(inputs).forEach(i => input_fields.push(this._prepare_input_obj(inputs[i])));
                this.postLeads(input_fields);
            }
        } catch (err) {
            Sentry.captureException(err);
        }
    }

    initializeAndConfigureSentry() {
        let self = this;
        Sentry.init({
            dsn: 'https://ad94bc20259c4fa4b0feb9f1fc20e483@sentry.io/1407925',
            defaultIntegrations: false
        });
        Sentry.configureScope(scope => {
            scope.setUser({"license_code": self.license_code});
            scope.setTag("hostname", window.location.hostname);
            scope.setTag("integrated_form_type", "NinjaForm");
        });
    }

    startApp() {
        // initialize sentry
        this.initializeAndConfigureSentry();
        // capture leads and catch exceptions if any
        try {
            let self = this;
            jQuery(document).on('nfFormReady', function () {
                nfRadio.channel('forms').on('submit:response', function (form) {
                    console.log(form, 'sssss');
                    self.processLeads(form);
                });
            });
        } catch (err) {
            Sentry.captureException(err);
        }
    }
}