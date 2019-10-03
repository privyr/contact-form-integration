class PrivyrGenericCfIntegration {
    constructor(license_code, form_id_or_name) {
        this.license_code = license_code;
        let self = this;
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                self.cform = document.getElementById(form_id_or_name) || document.getElementsByName(form_id_or_name);
                window['_privyr_wpcf7'].captureLeads();

                // removing random generated id on window close
                // TODO: decide when to delete this id
                window.onbeforeunload = () => {
                    localStorage.removeItem('luid')
                }
            }
        }
    }

    _uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    _fetch_lead_user_id() {
        let luid = localStorage.getItem('luid');
        if (luid) return luid;
        luid = this._uuidv4();
        localStorage.setItem('luid', luid);
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
        let post_url = 'http://www.{host}/integrations/api/v1/new-generic-cf-lead'.replace('{host}', window['_pvyr_host']);
        xhr.open('POST', post_url);
        xhr.onload = () => {
            console.log(xhr.status);
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
    }

    captureLeads() {
        let self = this;
        this.cform.addEventListener('submit', (event) => {
            let input_fields = [];
            let inputs = event.target.querySelectorAll('input');
            inputs.forEach(function (i) {
                input_fields.push({
                    "id": i.id,
                    "name": i.name,
                    "placeholder": i.placeholder,
                    "type": i.type,
                    "value": i.value
                });
            });
            console.log(input_fields);

            // will be posting all leads.
            // Assumption is this listener will only be called after client side form validation is done.
            self.postLeads(input_fields);
        });
    }
}