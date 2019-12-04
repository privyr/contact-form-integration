(function () {
    'use strict';
}());

const PrivyrGenericCfIntegration = require('../scripts/privyr-generic-cf-integration').default;

module.exports = {
    run: function (config) {
        new PrivyrGenericCfIntegration(config);
    }
};
