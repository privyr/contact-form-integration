(function () {
    var url = "https://ei.privyr.com/v2.2/pvyr-ninja-cf.min.js";
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = url;
    s.onload = function () {
        window['_pvyr_cf_code'] = "uXJmPkkP";
        window['_pvyr_host'] = 'privyr.com';
        window['_privyr_cf'] = PrivyrNinjaCfIntegration.run_ninja({
            "license_code": window['_pvyr_cf_code']
        });
    };
    var x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);

})(window, document);