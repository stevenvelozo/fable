/**
* Unit tests for Fable
*
* @license     MIT
*
* @author      Steven Velozo <steven@velozo.com>
*/

var libFable = require('../source/Fable.js');

var Chai = require("chai");
var Expect = Chai.expect;

suite
(
	'Manyfest Object Address Resolution',
	function()
	{
		suite
		(
			'Manifiesta',
			function()
			{
				test
				(
					'Basic object reading and writing',
					function(fDone)
					{
						let testFable = new libFable();

						let animalManyfest = testFable.instantiateServiceProvider('Manifest',
							{
								"Scope": "Animal",
								"Descriptors":
									{
										"IDAnimal": { "Name":"Database ID", "Description":"The unique integer-based database identifier for an Animal record.", "DataType":"Integer" },
										"Name": { "Description":"The animal's colloquial species name (e.g. Rabbit, Dog, Bear, Mongoose)." },
										"Type": { "Description":"Whether or not the animal is wild, domesticated, agricultural, in a research lab or a part of a zoo.." },
										"MedicalStats":
											{
												"Name":"Medical Statistics", "Description":"Basic medical statistics for this animal"
											},
										"MedicalStats.Temps.MinET": { "Name":"Minimum Environmental Temperature", "NameShort":"MinET", "Description":"Safest minimum temperature for this animal to survive in."},
										"MedicalStats.Temps.MaxET": { "Name":"Maximum Environmental Temperature", "NameShort":"MaxET", "Description":"Safest maximum temperature for this animal to survive in."},
										"MedicalStats.Temps.CET":
											{
												"Name":"Comfortable Environmental Temperature",
												"NameShort":"Comf Env Temp",
												"Hash":"ComfET",
												"Description":"The most comfortable temperature for this animal to survive in.",
												"Default": "96.8"
											}
									}
							});

						Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { CET:200 }},Name:'Froggy'}, 'ComfET')).to.equal(200);
						Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'ComfET')).to.equal('96.8');
						Expect(animalManyfest.getValueByHash({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'CurrentTemperature')).to.equal(undefined);

						// Now change the comfortable environmental temperature for the Froggy to be 200
						let tmpRecord = {MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'};
						animalManyfest.setValueByHash(tmpRecord, 'ComfET', 200);
						Expect(animalManyfest.getValueByHash(tmpRecord, 'ComfET')).to.equal(200);

						Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { CET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.CET')).to.equal(200);
						Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.CET')).to.equal('96.8');
						Expect(animalManyfest.getValueAtAddress({MedicalStats: { Temps: { MinET:200 }},Name:'Froggy'}, 'MedicalStats.Temps.HighET')).to.equal(undefined);


						return fDone();
					}
				);
			}
		);
	}
);