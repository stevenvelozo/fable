var libNPMModuleWrapper = require('./Fable.js');

if ((typeof(window) === 'object') && !('Fable' in window))
{
	window.Fable = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;