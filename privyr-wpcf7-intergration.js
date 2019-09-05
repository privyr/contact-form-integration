class PrivyrWP {
    constructor(user_profile_code, name, email, phonenumber){
        this.user_profile_code = user_profile_code;
        this.field_names = {};
        this.initializeInputIdsToPrivyr(name, email, phonenumber);
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
            'user_profile_code': this.user_profile_code,
            'lead': lead
        }
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'http://www.localhost:8000/integrations/api/v1/new-wpcf7-lead');
        xhr.onload= function() {
            console.log(xhr.status);
        };
        xhr.setRequestHeader( "Content-Type", "application/json" );
        xhr.send(JSON.stringify(payload));
    }

    captureLeads() {
        var self = this;
        document.addEventListener('wpcf7submit', function(event) {
            var inputs = event.detail.inputs;
            self.postLeads(self.mapIds(inputs));
        }, false);
    }
}

function initPrivyrWP(user_profile_code, name="your-name", email="your-email", phonenumber="tel") {
    privyrWP = new PrivyrWP(user_profile_code, name, email, phonenumber);
    document.onreadystatechange = function() {
        if(document.readyState == "complete") {
            privyrWP.captureLeads();
        }
    }
}
