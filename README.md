# integration-sdk

This sdk helps users to capture leads from their websites and push directly to Privyr without manual intervention.
Implemented for wordpress contact form 7 for now, will be extended to different contact forms.
CI implemented with travis. Automates build creation on git push from master and pushes code to AWS S3.


### Wordpress Contact form7
If you are using contact form7, simply copy this code and paste in your wordpress site.
(If no plugin is installed for headers and footers, install [this](https://wordpress.org/plugins/insert-headers-and-footers/)  plugin and then paste below code).

```html
/* --- Privyr Contact Form 7 Integration --- */ 
<script src="https://ei.privyr.com/v2.2/pvyr-wpcf7.min.js"></script>
<script>
window['_pvyr_wpcf7_code'] = '<Enter license code here>';
window['_pvyr_host'] = 'privyr.com';
(function(c, n, e, p){
    window['_privyr_wpcf7'] = new PrivyrWP(window['_pvyr_wpcf7_code'], "your-name",  "your-email" , "tel");
})(window, document);
</script>
<!-- --- End Privyr Contact Form 7 Integration --- --> 
```

### Ninja Contact form
If you are using ninja contact form, simply copy this code and paste in your wordpress site.
(If no plugin is installed for headers and footers, install [this](https://wordpress.org/plugins/insert-headers-and-footers/)  plugin and then paste below code).

```html
<!-- --- Privyr Contact Form Integration ---  -->
<script src="https://ei.privyr.com/v2.2/pvyr-ninja-cf.min.js"></script>
<script>
        window['_pvyr_cf_code'] = '<Enter license code here>';
        window['_pvyr_host'] = 'privyr.com';
        (function (c, n, e, p) {
            window['_privyr_cf'] = PrivyrNinjaCfIntegration.run_ninja({"license_code": window['_pvyr_cf_code']});
        })(window, document);
</script>
<!-- --- End Privyr Contact Form Integration ----->
```

### Generic Contact form
If you are using any other contact form, simply copy this code and paste in your site.

```html
    <!-- --- Privyr Contact Form Integration ---  -->
<script>
var privyrScript = document.createElement('script');
privyrScript.addEventListener('load', function () {
        window['_pvyr_cf_code'] = '<Enter license code here>';
        window['_pvyr_cf_id'] = '<Enter form id here>';
        window['_pvyr_cf_name'] = '<Enter form name here>';
        window['_pvyr_cf_ele'] = '<Enter form element here>';
        window['_pvyr_host'] = 'privyr.com';
        (function (c, n, e, p) {
            window['_privyr_cf'] = PrivyrGenericCfIntegration.run({"license_code": window['_pvyr_cf_code'], "form_id": window['_pvyr_cf_id'], "form_name": window['_pvyr_cf_name'], "form_ele": window['_pvyr_cf_ele'], "all_forms": true});
        })(window, document);
});
privyrScript.src = "https://ei.privyr.com/v2.2/pvyr-cf.min.js";
document.head.appendChild(privyrScript); 
</script>
<!-- --- End Privyr Contact Form Integration ----->
```

### Uplauncher Contact form
If you are using uplauncher contact form or any other contact form with no button of type submit, 
simply copy this code and paste in your site.

NOTE: Use either of id or class for form and button, whichever available.`

```html
<!-- --- Privyr Contact Form Integration ---  -->
<script>
var privyrScript = document.createElement('script');
privyrScript.addEventListener('load', function () {

    window['_pvyr_cf_code'] = '<Enter license code here>';
    window['_pvyr_cf_id'] = '<Enter form id here>';
    window['_pvyr_cf_class'] = '<Enter form class here>';
    window['_pvyr_cf_btn_id'] = '<Enter submit button id here>';
    window['_pvyr_cf_btn_class'] = '<Enter submit button class here>';
    window['_pvyr_host'] = 'privyr.com';
    (function (c, n, e, p) {
        window['_privyr_cf'] = PrivyrUPCfIntegration.run_up({"license_code": window['_pvyr_cf_code'], "form_id": window['_pvyr_cf_id'], 
        "form_class": window['_pvyr_cf_class'], "btns_id": window['_pvyr_cf_btn_id'], "btns_class": window['_pvyr_cf_btn_class']});
    })(window, document);
    
});
privyrScript.src = "https://ei.privyr.com/v2.3/pvyr-up-cf.min.js";
document.head.appendChild(privyrScript); 
</script>
<!-- --- End Privyr Contact Form Integration ----->
```

`LICENSE_CODE`: Unique code given by Privyr to users. To find out your license key, open Privyr > Settings > Integrations > Wordpress Contact form. 
