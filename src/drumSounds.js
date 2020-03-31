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

        this.octave = 1;

        this.defaults = {
            oscillator : {
                type : 'square'
            } ,
            envelope : {
                attack : 0.1 ,
                decay : 0.1 ,
                sustain : 1 ,
                release : 1
            }
        }

        this.volume = new Volume(-30);
        this.synth = new Synth(this.defaults);
        this.synth.connect(this.volume);

        this.activeNotes = {

        }
    }

    getVolume() {
        return this.volume;
    }

    start(note, octave) {
        // console.log(octave)
        octave += this.octave;
        note += octave;
        // console.log(note);
        this.synth.triggerAttack(note);
    }

    stop(note, octave) {
        this.synth.triggerRelease();
    }
}