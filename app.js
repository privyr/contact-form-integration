// ========  This file is no more used  ================
(function () {
    'use strict';
}());

const PrivyrGenericCfIntegration = require('./scripts/privyr-generic-cf-integration').default;
const PrivyrNinjaCfIntegration = require('./scripts/privyr-ninja-cf-integration').default;
const PrivyrUPCfIntegration = require('./scripts/privyr-up-cf-integration').default;

module.exports = {
    run: function (config) {
        new PrivyrGenericCfIntegration(config);
    },
    run_ninja: function (config) {
        new PrivyrNinjaCfIntegration(config);
    },
    run_up: function (config) {
        new PrivyrUPCfIntegration(config);
    }
};
