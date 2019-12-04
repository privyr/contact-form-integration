(function () {
    'use strict';
}());

const PrivyrUPCfIntegration = require('../scripts/privyr-up-cf-integration').default;

module.exports = {
    run_up: function (config) {
        new PrivyrUPCfIntegration(config);
    }
};
