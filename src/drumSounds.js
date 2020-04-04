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

        this.activeNote = "";
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
        this.activeNote = note;
    }

    stopNote(note, octave) {
        octave += this.octave;
        note += octave;
        if (note === this.activeNote) {
            this.synth.triggerRelease();
        }
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