import { MembraneSynth, NoiseSynth, MetalSynth, Synth, Volume, Master } from 'tone';

const soundDefaults = {
    kick: {
        note: 'C1',
        velocity: 0.7,
        defaults: {
            octaves : 5 ,
            oscillator : {
                type : 'sine'
            } ,
            envelope : {
                attack : 0.01 ,
                decay : 0.4 ,
                sustain : 0.01 ,
                release : 1.4 ,
            }
        },
    },

    snare: {
        velocity: 1,
        defaults: {
            noise : {
                type : 'pink'
            } ,
            envelope : {
                attack : 0.01 ,
                decay : 0.1 ,
                sustain : 0
            }
        },
    },

    hihat: {
        velocity: 0.7,
        defaults: {
            frequency : 1500 ,
            envelope : {
                attack : 0 ,
                decay : 0.7 ,
                release : 0.5
            } ,
            harmonicity : 3 ,
            modulationIndex : 60 ,
            resonance : 6000 ,
            octaves : 1
        },

    }
}

export class Sound {
    constructor(type, volumeNode, initialSettings) {
        this.type = type;

        this.duration = '16n';
        this.time = '+0.001';

        // this.volume = volumeNode;

        if (initialSettings) {
            this.velocity = initialSettings.velocity;
            this.defaults = initialSettings.defaults;
        } else {
            this.velocity = soundDefaults[type].velocity;
            this.defaults = soundDefaults[type].defaults;
        }

        if (type === 'kick') {
            this.note = soundDefaults.kick.note;
            this.synth = new MembraneSynth(this.defaults);
        } else if (type === 'snare') {
            this.synth = new NoiseSynth(this.defaults);
        } else if (type === 'hihat') {
            this.synth = new MetalSynth(this.defaults);
        }

        this.synth.connect(volumeNode);
    }

    play() {
        if (this.type === 'kick') {
            this.synth.triggerAttackRelease(this.note, this.duration, this.time, this.velocity);
        } else {
            this.synth.triggerAttackRelease(this.duration, this.time, this.velocity);
        }
    }

    setAttack(value) {
        this.synth.envelope.attack = parseFloat(value);
    }

    updateSetting(settingType, value) {
        switch(settingType) {
            case 'attack':
                this.synth.envelope.attack = parseFloat(value);
                break;
            case 'decay':
                this.synth.envelope.decay = parseFloat(value);
                break;
            case 'sustain':
                this.synth.envelope.sustain = parseFloat(value);
                break;
            case 'release':
                this.synth.envelope.release = parseFloat(value);
                break;
            case 'velocity':
                this.velocity = parseFloat(value);
                break;
            case 'noise-type':
                this.synth.noise.type = value;
                break;
            case 'pitch':
                this.note = value;
                break;
        }
    }
}


export class KeyboardSound {
    constructor() {

        this.octave = 2;

        this.defaults = {
            oscillator : {
                type : 'square'
            } ,
            envelope : {
                attack : 0.01 ,
                decay : 0.1 ,
                sustain : 1 ,
                release : 1
            }
        }

        this.volume = new Volume(-30);
        this.synth = new Synth(this.defaults);
        this.synth.connect(this.volume);

        this.synth.portamento = 0.1;

        this.notes = {
            'C1' : false,
            'C#1' : false,
            'D1' : false,
            'D#1' : false,
            'E1' : false,
            'F1' : false,
            'F#1' : false,
            'G1' : false,
            'G#1' : false,
            'A1' : false,
            'A#1' : false,
            'B1' : false,

            'C2' : false,
            'C#2' : false,
            'D2' : false,
            'D#2' : false,
            'E2' : false,
            'F2' : false,
            'F#2' : false,
            'G2' : false,
            'G#2' : false,
            'A2' : false,
            'A#2' : false,
            'B2' : false,

            'C3' : false,
            'C#3' : false,
            'D3' : false,
            'D#3' : false,
            'E3' : false,
            'F3' : false,
            'F#3' : false,
            'G3' : false,
            'G#3' : false,
            'A3' : false,
            'A#3' : false,
            'B3' : false,

            'C4' : false,
            'C#4' : false,
            'D4' : false,
            'D#4' : false,
            'E4' : false,
            'F4' : false,
            'F#4' : false,
            'G4' : false,
            'G#4' : false,
            'A4' : false,
            'A#4' : false,
            'B4' : false,

            'C5' : false,
            'C#5' : false,
            'D5' : false,
            'D#5' : false,
            'E5' : false,
            'F5' : false,
            'F#5' : false,
            'G5' : false,
            'G#5' : false,
            'A5' : false,
            'A#5' : false,
            'B5' : false,

            'C6' : false,
        }
    }

    getVolumeNode() {
        return this.volume;
    }

    setVolume(value) {
        if (value <= -60) {
            this.volume.volume.value = -Infinity;
        } else {
            this.volume.volume.value = value;
        }
    }

    startNote(note, octave) {
        octave += this.octave;
        note += octave;
        this.synth.triggerAttack(note);
        this.notes[note] = true;
    }

    stopNote(note, octave) {
        octave += this.octave;
        note += octave;
        this.synth.triggerAttack(note);
        this.notes[note] = false;
    }

    setOctave(octave) {
        this.octave = octave;
    }

    setEnvelopeValue(type, value) {
        this.synth.envelope[type] = value;
    }

    setPortamento(value) {
        this.synth.portamento = value;
    }

    setWave(wave, oscillatorType) {
        if (oscillatorType === 'standard') {
            this.synth.oscillator.type = wave;
        } else {
            this.synth.oscillator.type = (oscillatorType + wave);
        }
    }
}