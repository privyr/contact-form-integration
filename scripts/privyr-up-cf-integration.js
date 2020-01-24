import * as Sentry from '@sentry/browser/dist/index'

export default class PrivyrUPCfIntegration {
    constructor(config) {
        let {license_code, form_id, form_class, button_id, button_class} = config;
        this.license_code = license_code;
        let self = this;
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                self.startApp(config);
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

    processLeads(form_ref, button_ref) {
        let self = this;
        $(form_ref + " " + button_ref).on('click', (e) => {
            try {
                let input_fields = [];
                let closest_form = $(e.target).closest('form')[0];
                let elements = closest_form.elements;
                let radioInputGroups = [];
                for (let key in elements) {
                    let ele = elements[key];
                    if (ele.nodeName == "INPUT") {
                        if (ele.type == "checkbox") {
                            if (ele.checked) {
                                ele.name = ele.value;
                                input_fields.push(self._prepare_input_obj(ele, "Yes"));
                            }
                        } else if (ele.type == "radio") {
                            if (ele.name && !(radioInputGroups.includes(ele.name))) {
                                let selectedRInputVal = $('input:radio[name="' + ele.name + '"]:checked').val();
                                // there is a lot of inconsistency in labels, so assigning placeholder as selected
                                // because it is the first thing that is being mapped in backend.
                                ele.placeholder = "Selected";
                                input_fields.push(this._prepare_input_obj(ele, selectedRInputVal));
                                radioInputGroups.push(ele.name);
                            }
                        } else {
                            input_fields.push(self._prepare_input_obj(ele, ele.value));
                        }
                    } else if (ele.nodeName == "SELECT") {
                        input_fields.push(self._prepare_input_obj(ele,
                            Array.from(ele.selectedOptions).map((elem, index) => elem.innerText).join()));
                    } else if (ele.nodeName == "TEXTAREA") {
                        input_fields.push(self._prepare_input_obj(ele, ele.value))
                    }
                }
                // will be posting all leads.
                // Assumption is this listener will only be called after client side form validation is done.
                self.postLeads(input_fields);
            } catch (err) {
                Sentry.captureException(err);
            }
        });
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
            scope.setTag("full_url", window.location.href);
            scope.setTag("integrated_form_type", "UPForm");
        });
    }

    startApp(config, retry=3) {
        // initialize sentry
        this.initializeAndConfigureSentry();
        // capture leads and catch exceptions if any
        try {
            let self = this;
            let {form_id, form_class, button_id, button_class} = config;
            if ((form_id || form_class) && (button_id || button_class)) {
                $('document').ready(() => {
                    let form_ref = form_id ? "#" + form_id : "." + form_class;
                    let button_ref = button_id ? "#" + button_id : "." + button_class;
                    self.processLeads(form_ref, button_ref);
                });
            } else {
                if (retry > 0) {
                    setTimeout(() => self.startApp(config, retry-1), Math.pow(10, 4-retry))
                }
                else throw new Error('form not configured properly!!');
            }
        } catch (err) {
            Sentry.captureException(err);
        }
    }
}