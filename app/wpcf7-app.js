(function () {
    'use strict';
}());

const PrivyrWP = require('../scripts/privyr-wpcf7-intergration').default;

module.exports = {
    run_wp: function (license_code, name, email, phonenumber) {
        new PrivyrWP(license_code, name, email, phonenumber);
    }
};
