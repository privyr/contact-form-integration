class PrivyrWP {
    constructor(licence_code, name, email, phonenumber) {
        this.licence_code = licence_code;
        this.field_names = {};
        this.initializeInputIdsToPrivyr(name, email, phonenumber);
        document.onreadystatechange = () => {
            console.log('hshshshhshs');
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
            'licence_code': this.licence_code,
            'lead': lead
        };
        let xhr = new XMLHttpRequest();
        let post_url = 'https://www.{host}/integrations/api/v1/new-wpcf7-lead'.replace('{host}', window['_pvyr_host']);
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
            let inputs = event.detail.inputs;
            self.postLeads(self.mapIds(inputs));
        }, false);
    }
}