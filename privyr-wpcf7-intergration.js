class PrivyrWP {
    constructor(licence_code, name, email, phonenumber){
        this.licence_code = licence_code;
        this.field_names = {};
        this.initializeInputIdsToPrivyr(name, email, phonenumber);
        document.onreadystatechange = function() {
            if(document.readyState === "complete") {
                window['_privyr_wpcf7'].captureLeads();
            }
        }
    }

    initializeInputIdsToPrivyr(name, email, phonenumber){
        this.field_names[name] = 'name';
        this.field_names[email] = 'email';
        this.field_names[phonenumber] = 'phonenumber'; 
    }

    mapIds(inputs) {
        var self = this;
        inputs.forEach(function(object) {
            if (self.field_names[object['name']]) {
                object["name"] = self.field_names[object['name']];
            }
        });
        return inputs;
    }
    
    postLeads(lead) {
        var payload = {
            'licence_code': this.licence_code,
            'lead':lead,
            'hostname': window.location.hostname,
            'full_url': window.location.href
        };
        var xhr = new XMLHttpRequest();
        var post_url = 'https://www.{host}/integrations/api/v1/new-wpcf7-lead'.replace('{host}', window['_pvyr_host']);
        xhr.open('POST', post_url);
        xhr.onload= function() {
            console.log(xhr.status);
        };
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(payload));
    }

    captureLeads() {
        var self = this;
        document.addEventListener('wpcf7submit', function(event) {
            var status = event.detail.apiResponse.status; // Possible values: "validation_failed", "mail_failed", "success"
            // DO NOT Proceed if status is validation failed
            if (status === "validation_failed"){return;}
            // Proceed in other cases.
            var inputs = event.detail.inputs;
            self.postLeads(self.mapIds(inputs));
        }, false);
    }
}

