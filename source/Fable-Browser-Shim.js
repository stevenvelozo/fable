/**
* Simple browser shim loader - assign the npm module to a window global automatically
*
* @license MIT
* @author <steven@velozo.com>
*/
var libNPMModuleWrapper = require('./Fable.js');

if ((typeof(window) === 'object') && !window.hasOwnProperty('Fable'))
{
	window.Fable = libNPMModuleWrapper;
}

module.exports = libNPMModuleWrapper;