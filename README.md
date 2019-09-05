# integration-sdk

This sdk helps users to capture leads from their websites and push directly to Privyr without manual intervention.
Implemented for wordpress contact form 7 for now, will be extended to different contact forms.
CI implemented with travis. Automates build creation on git push from master and pushes code to AWS S3.


### Wordpress Contact form7
If you are using contact form7, simply copy this code and paste in your wordpress site.
(If no plugin is installed for headers and footers, install [this](https://wordpress.org/plugins/insert-headers-and-footers/)  plugin and then paste below code).

```<script async defer onload="initPrivyrWP('USER_PROFILE_CODE', 'WPCF7_NAME_FIELD', 'WPCF7_EMAIL_FIELD', 'WPCF7_PHONENUMBER_FIELD')" src="https://external-integration.s3-ap-southeast-1.amazonaws.com/privyr-wordpress-intergration.js"></script>```

'USER_PROFILE_CODE': unique code given by Privyr to users. 
