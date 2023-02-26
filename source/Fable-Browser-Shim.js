var libNPMModuleWrapper = require('./Fable.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('Fable'))
{
	window.Fable = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;