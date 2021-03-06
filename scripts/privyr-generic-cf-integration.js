import * as Sentry from '@sentry/browser/dist/index'
import $ from 'jquery'
window.pvyrjq = $.noConflict();

export default class PrivyrGenericCfIntegration {
    constructor(config) {
        let {license_code} = config;
        this.license_code = license_code;
        let self = this;
        if (document.readyState === "complete") {
            self.startApp(config);
        } else {
            document.onreadystatechange = () => {
                if (document.readyState === "complete") {
                    self.startApp(config);
                }
            }
        }
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
            'full_url': window.location.href,
            'luid': this._fetch_lead_user_id()
        };
        let post_url = `https://www.${window['_pvyr_host']}/integrations/api/v1/new-generic-cf-lead`;
        this._post_xhr_request(post_url, payload);
    }

    _get_input_label(inputId) {
        const labelElem = document.querySelectorAll(`label[for='${inputId}']`);
        if (labelElem.length > 0) {
            return labelElem[0].outerText;
        }
        return null;
    }

    _prepare_input_obj(inputElem, value) {
        if (inputElem.type == "password") throw new Error('This seems like login/signup form')
        return {
            "id": inputElem.id || '',
            "name": inputElem.name || '',
            "placeholder": inputElem.placeholder || '',
            "type": inputElem.type || '',
            "value": value || '',
            "label": this._get_input_label(inputElem.id) || ''
        }
    };

    _sending_beat() {
        console.log("Beat is initialized!!!");
        // FIXME: commenting becuse of unneccessary requests
        // let payload = {
        //     "license_code": this.license_code,
        //     "full_url": window.location.protocol + '//' + window.location.host + window.location.pathname,
        //     "hostname": window.location.hostname,
        //     "integrated_form_type": "GenericForm"
        // }
        // let post_url = `https://www.${window['_pvyr_host']}/integrations/api/v1/website-cf-beat`;
        // this._post_xhr_request(post_url, payload, true);
    }

    captureLeads(cform) {
        let self = this;
        cform.addEventListener('submit', (event) => {
            try {
                let input_fields = [];
                let inputs = event.target.querySelectorAll('input');
                let radioInputGroups = [];
                inputs.forEach(i => {
                    let item = window.pvyrjq.extend(true, [], i);
                    if (item.type == "file") {
                        // ignore, do not include
                        return;
                    } else if (item.type == "checkbox") {
                        if (item.checked) {
                            item.name = item.value;
                            input_fields.push(this._prepare_input_obj(item, "Yes"));
                        }
                    } else if (item.type == "radio") {
                        if (item.name && !(radioInputGroups.includes(item.name))) {
                            let selectedRInputVal = window.pvyrjq('input:radio[name="' + item.name + '"]:checked').val();
                            // there is a lot of inconsistency in labels, so assigning placeholder as selected
                            // because it is the first thing that is being mapped in backend.
                            item.placeholder = "Selected";
                            input_fields.push(this._prepare_input_obj(item, selectedRInputVal));
                            radioInputGroups.push(item.name);
                        }
                    } else {
                        input_fields.push(this._prepare_input_obj(item, item.value));
                    }
                });
                let selects = event.target.querySelectorAll('select');
                selects.forEach(s => input_fields.push(this._prepare_input_obj(s,
                    Array.from(s.selectedOptions).map((elem, index) => elem.innerText).join())));
                let textarea = event.target.querySelectorAll('textarea');
                textarea.forEach(t => input_fields.push(this._prepare_input_obj(t, t.value)));
                // will be posting all leads.
                // Assumption is this listener will only be called after client side form validation is done.
                self.postLeads(input_fields);
            } catch (err) {
                Sentry.captureException(err);
            }
        });
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
            scope.setTag("integrated_form_type", "GenericForm");
        });
    }

    startApp(config, retry = 3) {
        let self = this;
        let {form_id, form_name, form_ele, form_class, all_forms} = config;
        // initialize sentry
        this.initializeAndConfigureSentry();
        // capture leads and catch exceptions if any
        try {
            if (form_ele) this.captureLeads(form_ele);
            else if (all_forms) {
                let cforms = document.querySelectorAll('form');
                if (cforms.length > 0) {
                    cforms.forEach(cform => {
                        self.captureLeads(cform);
                    });
                } else if (retry > 0) setTimeout(() => self.startApp(config, retry - 1), Math.pow(10, 4 - retry));
                else throw new Error('form not configured properly!!');
            } else {
                let cform = document.getElementById(form_id) ||
                    document.getElementsByName(form_name)[0] ||
                    document.getElementsByClassName(form_class)[0];
                if (cform) this.captureLeads(cform);
                else if (retry > 0) setTimeout(() => self.startApp(config, retry - 1), Math.pow(10, 4 - retry));
                else throw new Error('form not configured properly!!');
            }
        } catch (err) {
            Sentry.captureException(err);
        }
    }
}