/**
* Fable Core Pre-initialization Service Base
*
* For a couple services, we need to be able to instantiate them before the Fable object is fully initialized.
* This is a base class for those services.
*
* @license MIT
* @author <steven@velozo.com>
*/

class FablePreinitServiceProviderBase
{
	constructor(pOptions, pServiceHash)
	{
		this.fable = false;

		this.options = (typeof(pOptions) === 'object') ? pOptions : {};

        this.serviceType = 'Unknown';

		// The hash will be a non-standard UUID ... the UUID service uses this base class!
        this.UUID = `CORESVC-${Math.floor((Math.random() * (99999 - 10000)) + 10000)}`;

        this.Hash = (typeof(pServiceHash) === 'string') ? pServiceHash : `${this.UUID}`;
	}

	// After fable is initialized, it would be expected to be wired in as a normal service.
	connectFable(pFable)
	{
		this.fable = pFable;

		return true;
	}
}

module.exports = FablePreinitServiceProviderBase;