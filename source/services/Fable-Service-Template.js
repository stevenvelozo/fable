const libFableServiceBase = require('fable-serviceproviderbase');

class FableServiceTemplate extends libFableServiceBase
{
	// Underscore and lodash have a behavior, _.template, which compiles a
	// string-based template with code snippets into simple executable pieces,
	// with the added twist of returning a precompiled function ready to go.
	//
	// NOTE: This does not implement underscore escape expressions
	// NOTE: This does not implement underscore magic browser variable assignment
	//
	// This is an implementation of that.
	// TODO: Make this use precedent, add configuration, add debugging.
	constructor(pFable, pOptions, pServiceHash)
	{
        super(pFable, pOptions, pServiceHash);

        this.serviceType = 'Template';

		// These are the exact regex's used in lodash/underscore
		// TODO: Switch this to precedent
		this.Matchers = (
			{
				Evaluate: /<%([\s\S]+?)%>/g,
				Interpolate: /<%=([\s\S]+?)%>/g,
				Escaper: /\\|'|\r|\n|\t|\u2028|\u2029/g,
				Unescaper: /\\(\\|'|r|n|t|u2028|u2029)/g,
				// This is how underscore does it, so we are keeping it for now.
				GuaranteedNonMatch: /.^/
			});

		// This is a helper for the escaper and unescaper functions.
		// Right now we are going to keep what underscore is doing, but, not forever.
		this.templateEscapes = {
			'\\': '\\',
			"'": "'",
			'r': '\r',
			'\r': 'r',
			'n': '\n',
			'\n': 'n',
			't': '\t',
			'\t': 't',
			'u2028': '\u2028',
			'\u2028': 'u2028',
			'u2029': '\u2029',
			'\u2029': 'u2029'
		};

		// This is defined as such to underscore that it is a dynamic programming
		// function on this class.
		this.renderFunction = false;
        this.templateString = false;
	}

	renderTemplate(pData)
	{
		return this.renderFunction(pData);
	}

	templateFunction()
	{
		let fRenderTemplateBound = this.renderTemplate.bind(this);
		return fRenderTemplateBound;
	}

	buildTemplateFunction(pTemplateText, pData)
	{
		// For now this is being kept in a weird form ... this is to mimic the old
		// underscore code until this is rewritten using precedent.
		this.TemplateSource = "__p+='" + pTemplateText
			.replace(this.Matchers.Escaper,
				(pMatch)=>
				{
					return `\\${this.templateEscapes[pMatch]}`;
				})
			.replace(this.Matchers.Interpolate || this.Matchers.GuaranteedNonMatch,
				(pMatch, pCode) =>
				{
					return `'+\n(${decodeURIComponent(pCode)})+\n'`;
				})
			.replace(this.Matchers.Evaluate || this.Matchers.GuaranteedNonMatch,
				(pMatch, pCode) =>
				{
					return `';\n${decodeURIComponent(pCode)}\n;__p+='`;
				}) + `';\n`;


		this.TemplateSource = `with(pTemplateDataObject||{}){\n${this.TemplateSource}}\n`;
		this.TemplateSource = `var __p='';var print=function(){__p+=Array.prototype.join.call(arguments, '')};\n${this.TemplateSource}return __p;\n`;

		this.renderFunction = new Function('pTemplateDataObject', this.TemplateSource);

		if (typeof(pData) != 'undefined')
		{
			return this.renderFunction(pData);
		}

		// Provide the compiled function source as a convenience for build time
		// precompilation.
		this.TemplateSourceCompiled = 'function(obj){\n' + this.TemplateSource + '}';

		return this.templateFunction();
	}
}

module.exports = FableServiceTemplate;