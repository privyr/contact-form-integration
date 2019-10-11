# integration-sdk

This sdk helps users to capture leads from their websites and push directly to Privyr without manual intervention.
Implemented for wordpress contact form 7 for now, will be extended to different contact forms.
CI implemented with travis. Automates build creation on git push from master and pushes code to AWS S3.


### Wordpress Contact form7
If you are using contact form7, simply copy this code and paste in your wordpress site.
(If no plugin is installed for headers and footers, install [this](https://wordpress.org/plugins/insert-headers-and-footers/)  plugin and then paste below code).

```html
<!-- --- Privyr Contact Form 7 Integration --- --> 
<script src="https://ei-test.privyr.com/pvyr-wpcf7.min.js"></script>
<script>
window['_pvyr_wpcf7_code'] = '<Enter license code here>';
window['_pvyr_host'] = 'privyr.com';
(function(c, n, e, p){
    window['_privyr_wpcf7'] = new PrivyrWP(window['_pvyr_wpcf7_code'], "your-name",  "your-email" , "tel");
})(window, document);
</script>
<!-- --- End Privyr Contact Form 7 Integration --- --> 
```

### Generic Contact form
If you are using any other contact form, simply copy this code and paste in your site.

```html
<!-- --- Privyr Contact Form Integration ---  -->
<script src="https://ei.privyr.com/privyr-generic-cf-integration.js"></script>
<script>
window['_pvyr_cf_code'] = '<Enter license code here>';
window['_pvyr_cf_id'] = '<Enter form name or id here>';
window['_pvyr_host'] = 'privyr.com';
(function (c, n, e, p) {
    window['_privyr_cf'] = PrivyrGenericCfIntegration.run({"license_code": window['_pvyr_cf_code'], "form_id": window['_pvyr_cf_id'], "form_name": window['_pvyr_cf_name'], "form_ele": window['_pvyr_cf_ele']});
})(window, document);
</script>
<!-- --- End Privyr Contact Form Integration ---  -->
```

`LICENSE_CODE`: Unique code given by Privyr to users. To find out your license key, open Privyr > Settings > Integrations > Wordpress Contact form. 
