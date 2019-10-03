class PrivyrWP {
    constructor(license_code, name, email, phonenumber) {
        this.license_code = license_code;
        this.field_names = {};
        this.initializeInputIdsToPrivyr(name, email, phonenumber);
        document.onreadystatechange = () => {
            if (document.readyState === "complete") {
                window['_privyr_wpcf7'].captureLeads();
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

    postLeads(lead) {
        let payload = {
            'license_code': this.license_code,
            'lead': lead,
            'hostname': window.location.hostname,
            'full_url': window.location.href
        };
        let xhr = new XMLHttpRequest();
        let post_url = 'http://www.{host}/integrations/api/v1/new-wpcf7-lead'.replace('{host}', window['_pvyr_host']);
        xhr.open('POST', post_url);
        xhr.onload = () => {
            console.log(xhr.status);
        };
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(payload));
    }

    captureLeads() {
        let self = this;
        document.addEventListener('wpcf7submit', (event) => {
            let status = event.detail.apiResponse.status; // Possible values: "validation_failed", "mail_failed", "success"
            // DO NOT Proceed if status is validation failed
            if (status === "validation_failed"){return;}
            // Proceed in other cases.
            let inputs = event.detail.inputs;
            self.postLeads(self.mapIds(inputs));
        }, false);
    }
}