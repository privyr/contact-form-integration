# integration-sdk

This sdk helps users to capture leads from their websites and push directly to Privyr without manual intervention.
Implemented for wordpress contact form 7 for now, will be extended to different contact forms.
CI implemented with travis. Automates build creation on git push from master and pushes code to AWS S3.


### Wordpress Contact form7
If you are using contact form7, simply copy this code and paste in your wordpress site.
(If no plugin is installed for headers and footers, install [this](https://wordpress.org/plugins/insert-headers-and-footers/)  plugin and then paste below code).

```html
/* --- Privyr Contact Form 7 Integration --- */ 
<script src="https://external-integration.s3-ap-southeast-1.amazonaws.com/privyr-wpcf7-intergration.js"></script>
<script>
window['_pvyr_wpcf7_code'] = '<Enter licence code here>';
window['_pvyr_host'] = 'privyr.com';
(function(c, n, e, p){
    window['_privyr_wpcf7'] = new PrivyrWP(window['_pvyr_wpcf7_code'], "your-name",  "your-email" , "tel");
})(window, document);
</script>
/* --- End Privyr Contact Form 7 Integration --- */ 
```

`LICENCE_CODE`: Unique code given by Privyr to users. To find out your licence key, open Privyr > Settings > Integrations > Wordpress Contact form. 
