(function () {
    'use strict';
}());

const PrivyrNinjaCfIntegration = require('../scripts/privyr-ninja-cf-integration').default;

module.exports = {
    run_ninja: function (config) {
        new PrivyrNinjaCfIntegration(config);
    }
};
