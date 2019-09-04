class PrivyrWP {
    constructor(license_code){
        this.license_code = license_code;
        this.field_names = {}
        this.initializeInputIdsToPrivyr();
    }

    initializeInputIdsToPrivyr(){
        this.field_names['your-name'] = 'name';
        this.field_names['your-email'] = 'email';
        this.field_names['your-phonenumber'] = 'phonenumber'; 
    }

    mapIds(inputs) {
        var self = this;
        inputs.map(function (object) {
            object["name"] = self.field_names[object['name']];
        });
         console.log('xxx', inputs);
        return inputs;
    }
    
    postLeads(lead) {
        var payload = {
            'license_code': this.license_code,
            'lead': lead
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.localhost:8000/integrations/api/v1/new-wp-pvyr-lead');
        xhr.onload= function() {
            console.log(xhr.status);
        };
        xhr.send(JSON.stringify(payload));
    }

    captureLeads() {
        var self = this;
        document.addEventListener('wpcf7submit', function(event) {
            var inputs = event.detail.inputs;
            console.log('inputsxxxx ', inputs);
            self.postLeads(self.mapIds(inputs));
        }, false);
    }
}

function initPrivyrWP(license_code) {
    privyrWP = new PrivyrWP(license_code);
    document.onreadystatechange = function() {
        if(document.readyState == "complete") {
            privyrWP.captureLeads();
        }
    }
}