# Oscillator.js

## Way to write buffers

Oscillator.js is :
- a **javascript oscillator**
- an oscillator algorithm (written originally in C++).
- designed to work with the Web Audio API but without using any OscillatorNode.

##Examples

Browse the basic usage examples:
- BufferSource: [/examples/buffer-source.html](https://github.com/JeremieGarcelon/Oscillator.js/blob/master/examples/buffer-source.html)
- ScriptProcessorNode: [/examples/script-processor.html](https://github.com/JeremieGarcelon/Oscillator.js/blob/master/examples/script-processor.html)

## Oscillator types

Oscillator.js allows, by default, to instantiates four types of oscillators:

```javascript
// Create a sine wave oscillator
var oscillator=new Oscillator.sine(audioCtx.sampleRate);
```
```javascript
// Create a saw wave oscillator
var oscillator=new Oscillator.saw(audioCtx.sampleRate);
```
```javascript
// Create a square wave oscillator
var oscillator=new Oscillator.square(audioCtx.sampleRate);
```
```javascript
// Create a triangle wave oscillator
var oscillator=new Oscillator.triangle(audioCtx.sampleRate);
```
The constructor takes the audio context sample rate as argument.

##Plotting waveform

Once an oscillator instance is created, it can be used to plot a waveform:

```javascript
amplitude=oscillator.plot(frequency);
```

The plot method take the frequency (float) as argument and returns a value between -1 and 1.   
The frequency value can be changed at any time (modulation).

In practice, it will be used in a loop to fill a buffer:

```javascript
for(var sample=0; sample < bufferLength; sample++){
	// Plot a 440Hz wave
	buffer[sample]=oscillator.plot(440);
}
```

##Plotting modulation

Oscillators can also be used easily for modulation:

```javascript
value=oscillator.modulate(period, mini, maxi);
```

The modulate method take as arguments the modulation period in seconds (float) and returns a value between mini and maxi.

In practice, it will be used in a loop to fill a buffer:

```javascript
for(var sample=0; sample < bufferLength; sample++){
	// Plot a wave whose the frequency is modulated
	buffer[sample]=oscillator1.plot(
		// between 440Hz and 880Hz in a period of 10 seconds 
		// following the oscillator2 waveform shape
		oscillator2.modulate(10, 440, 880);
	);	
}
```

Do not forget to create one instance for each oscillators.

##Reset/Shift the phase

```javascript
// Set the phase initial value to 0.5
oscillator.rephase(0.5);

// Reset the phase to its initial value
oscillator.rephase();
```

If you want to use several times the same oscillator, do not forget to reset its phase.

##Custom types of oscillators
You can add custom types of oscillators by extending the *Oscillator.abstract* superclass.  
Get inspired by the code used for implement the sine wave oscillator:

```javascript
// Sine wave oscillator
Oscillator.sine=Oscillator.extend(Oscillator.abstract);
Oscillator.sine.prototype.plot=function(frequency){
	return Math.sin(2*Math.PI*this.upPhase(frequency));
};
```

