class PrivyrGenericCfIntegration {
    constructor(license_code, form_id_or_name) {
        this.license_code = license_code;
        let self = this;
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                self.cform = document.getElementById(form_id_or_name) || document.getElementsByName(form_id_or_name);
                window['_privyr_cf'].captureLeads();
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
        const labelElem = document.querySelectorAll(`label[for='${inputId}']`)
        if (labelElem.length > 0){
            return labelElem[0].outerText;
        }
        return null;
    }

    _prepare_input_obj(inputElem, value) {
        return {
            "id": inputElem.id || '',
            "name": inputElem.name || '',
            "placeholder": inputElem.placeholder || '',
            "type": inputElem.type || '',
            "value": value || '',
            "label": this._get_input_label(inputElem.id) || ''
        }
    };

    captureLeads() {
        let self = this;
        this.cform.addEventListener('submit', (event) => {
            let input_fields = [];
            let inputs = event.target.querySelectorAll('input');
            inputs.forEach(i => input_fields.push(this._prepare_input_obj(i, i.value)));
            let selects = event.target.querySelectorAll('select');
            selects.forEach(s => input_fields.push(this._prepare_input_obj(s,
                Array.from(s.selectedOptions).map((elem, index) => elem.innerText).join())));
            let textarea = event.target.querySelectorAll('textarea');
            textarea.forEach(t => input_fields.push(this._prepare_input_obj(t, t.value)));
            console.log(input_fields);
            // will be posting all leads.
            // Assumption is this listener will only be called after client side form validation is done.
            self.postLeads(input_fields);
        });
    }
}