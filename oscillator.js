/*
Name:		oscillator.js
Version:	1.0.0
Update:		13/02/2016 15:00 (GTM+2)
Author:		Jérémie Garcelon

Copyright:	Copyright (C) 2016 Jérémie Garcelon
License:	Released under the MIT license
*/

var Oscillator=(function(){

	// Inner namespace
	var Oscillator=function(){};

	////////////

	// Abstract oscillator
	Oscillator.abstract=function(sampleRate){
		this.sampleRate=sampleRate;
		this.phaseInit=0;
		this.phase=0;
	};

	// Reset the phase. Can be used to shift the phase (pass the initial phase as argument).
	Oscillator.abstract.prototype.rephase=function(phaseInit){
		if(phaseInit != null){
			this.phaseInit=phaseInit;
		}
		this.phase=this.phaseInit;	
	};

	// Increment and return the phase according to the frequency.
	Oscillator.abstract.prototype.upPhase=function(frequency){
		this.phase+=frequency/this.sampleRate;
		if(this.phase > 1){
			this.phase-=Math.floor(this.phase);
		}
		return this.phase;
	};

	// Interface method to plot a waveform. Will be called for each sample.
	// Takes as argument the frequency (in Hz) and must returns a value (amplitude) between -1 and 1.
	Oscillator.abstract.prototype.plot=function(frequency){ };

	// Plot a modulation. Will be called for each sample.
	// Takes as arguments the modulation period (in seconds) and returns a value between mini and maxi.
	Oscillator.abstract.prototype.modulate=function(period, mini, maxi){
		return mini+((maxi-mini)/2*(this.plot(1/period)+1));
	};

	////////////

	// Inheritance helper
	Oscillator.extend=function(parent, constructor){
		if(constructor){
			var child=function(){
				parent.apply(this, arguments);
				constructor.apply(this, arguments);
			};
		}
		else{
			var child=function(){
				parent.apply(this, arguments);
			};
		}
		var surrogate=function(){};
		surrogate.prototype=parent.prototype;
		child.prototype=new surrogate();
		return child;
	};

	////////////

	// Sine wave oscillator
	Oscillator.sine=Oscillator.extend(Oscillator.abstract);
	Oscillator.sine.prototype.plot=function(frequency){
		return Math.sin(2*Math.PI*this.upPhase(frequency));
	};

	// Saw wave oscillator
	Oscillator.saw=Oscillator.extend(Oscillator.abstract);
	Oscillator.saw.prototype.plot=function(frequency){
		return (2*this.upPhase(frequency))-1;
	};

	// Square wave oscillator
	Oscillator.square=Oscillator.extend(Oscillator.abstract);
	Oscillator.square.prototype.plot=function(frequency){
		if(this.upPhase(frequency) < 0.5){
			return 1;
		}
		else{
			return -1;
		}
	};

	// Triangle wave oscillator
	Oscillator.triangle=Oscillator.extend(Oscillator.abstract);
	Oscillator.triangle.prototype.plot=function(frequency){
		this.upPhase(frequency);
		if(this.phase < 0.5){
			return (this.phase*4)-1;
		}
		else{
			return ((1-this.phase)*4)-1;
		}
	};

	return Oscillator;
})();

