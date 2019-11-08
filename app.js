(function () {
    'use strict';
}());

const PrivyrGenericCfIntegration = require('./scripts/privyr-generic-cf-integration').default;
const PrivyrNinjaCfIntegration = require('./scripts/privyr-ninja-cf-integration').default;

module.exports = {
    run: function (config) {
        new PrivyrGenericCfIntegration(config);
    },
    run_ninja: function (config) {
        new PrivyrNinjaCfIntegration(config);
    }
};
