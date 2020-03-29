import { MembraneSynth, NoiseSynth, MetalSynth } from 'tone';

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
    constructor(type, initialSettings) {
        this.type = type;

        this.duration = '16n';
        this.time = '+0.001';

        this.velocity = soundDefaults[type].velocity;
        if (initialSettings) {
            this.defaults = initialSettings;
        } else {
            this.defaults = soundDefaults[type].defaults;
        }

        if (type === 'kick') {
            this.note = soundDefaults.kick.note;
            this.synth = new MembraneSynth(this.defaults).toMaster();
        } else if (type === 'snare') {
            this.synth = new NoiseSynth(this.defaults).toMaster();
        } else if (type === 'hihat') {
            this.synth = new MetalSynth(this.defaults).toMaster();
        }
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
        }
    }
}