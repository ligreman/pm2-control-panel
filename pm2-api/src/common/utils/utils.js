const validator = require('validator');
const CONFIG = require('../../config/config');
const scriptsAvailableJson = require('../../config/available-scripts');

const getAvailableScripts = function () {
    let list = [];
    scriptsAvailableJson.apps.forEach((app) => {
        list.push(app.label);
    });
    return list;
};

const generateName = function (txt) {
    let result = validator.escape(txt);

    // Realizo reemplazos
    result = replaceAll(result, CONFIG.scriptNameReplacements);

    // Capitalize
    result = capitalize(result);

    return result;
};

const validateId = function (id) {
    let result = false;
    if (id !== null && id !== undefined && !isNaN(id)) {
        result = true;
    }

    return result;
};

function replaceAll(str, mapObj) {
    let re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

    return str.replace(re, function (matched) {
        return mapObj[matched.toLowerCase()];
    });
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}


module.exports = {
    getAvailableScripts: getAvailableScripts,
    generateName: generateName,
    validateId: validateId
};
