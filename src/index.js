import * as Tone from 'tone';
import { Sound, KeyboardSound } from './drumSounds';
import * as Nexus from './lib/NexusUI';
import StartAudioContext from 'startaudiocontext';

const black = '#202124';
const darkGrey = '#3c4042';
const lightGrey = '#606368';
const white = '#fafafa';
const lightPink = '#ffb2ff';
const pink = '#ea80fc';
const darkPink = '#b64fc8';


window.addEventListener('load', () => {
    const splashScreen = document.getElementById('splash-screen');

    splashScreen.addEventListener('click', () =>{
        StartAudioContext(Tone.context).then(() => {
            console.log("Audio context started");
            init();
            splashScreen.style.display = 'none';
        });
    });

});

function init() {
    Tone.Master.volume.value = 0;

    const sequencerVolume = new Tone.Volume(-10).toMaster();
    const kick = new Sound('kick', sequencerVolume);
    const snare = new Sound('snare', sequencerVolume);
    const hihat = new Sound('hihat', sequencerVolume);
    const hihatTwo = new Sound('hihat', sequencerVolume,
        {
            velocity: 0.3,
            defaults: {
                frequency : 1500 ,
                envelope : {
                    attack : 0 ,
                    decay : 0.1 ,
                    release : 0.1
                } ,
                harmonicity : 3 ,
                modulationIndex : 60 ,
                resonance : 6000 ,
                octaves : 1
            }
        }
    );


    const synths = {
        'kick' : kick,
        'snare' : snare,
        'hihatOne' : hihat,
        'hihatTwo': hihatTwo
    }

    const synthNames = ['kick', 'snare', 'hihatOne', 'hihatTwo'];

    createPads(synths);

    createControlContainers();

    const sequencer = createSequencer();

    createSequencerControls(sequencerVolume);

    const loop = createLoop(sequencer, synths, synthNames);

    createAndConnectPadControls(synths);

    // create keyboard synth
    const keys = new KeyboardSound();
    keys.getVolume().connect(Tone.Master);

    // create keyboard
    let keyboard = new Nexus.Piano('#keyboard', {
        'size': [650,150],
        'lowNote': 12,
        'highNote': 36
    });

    keyboard.colorize('light', white); // white keys
    keyboard.colorize('dark', darkGrey); // black keys
    // keyboard.colorize('accent', pink); // highlight
    keyboard.colorize('mediumLight', lightGrey); // borders

    const keyboardVolume = new Nexus.Slider('#keyboard-volume', {
        'size': [25,115],
        'min': -40,
        'max': 0,
        'step': 0.1,
        'value': -10
    });

    // keyboard octave buttons
    const octaveButtons = new Nexus.RadioButton('#octave-radio-buttons', {
        'size': [150, 25],
        'numberOfButtons': 4,
        'active': 0
    });

    const keyboardNotes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    keyboard.on('change', (v) => {
        let note = keyboardNotes[v.note % 12];
        let octave = Math.floor(v.note / 12);
        if (v.state) {
            keys.start(note, octave)
        } else {
            keys.stop(note, octave);
        }
    });



    loop.start();

    const frequencyAnimator = new Animator();
    frequencyAnimator.draw();
}


function createSequencer() {
    const sequencer = new Nexus.Sequencer('#step-sequencer', {
        'size': [768, 192],
        'rows': 4,
        'columns': 16
    });

    sequencer.colorize('accent', pink)
    sequencer.colorize('fill', darkGrey);

    return sequencer;
}


function createSequencerControls(sequencerVolume) {
    const masterVolume = new Nexus.Slider('#master-volume', {
        'size': [25,148],
        'min': -40,
        'max': 0,
        'step': 0.1,
        'value': -10
    });

    masterVolume.colorize('accent', pink);
    masterVolume.colorize('fill', lightGrey);

    masterVolume.on('change', (v) => {
        sequencerVolume.volume.value = v;
    });

    const bpmSlider = new Nexus.Slider('#bpm-slider', {
        'size': [200, 25],
        'min': 50,
        'max': 180,
        'step': 1,
        'value': 120
    });

    bpmSlider.colorize('accent', pink);
    bpmSlider.colorize('fill', lightGrey);

    const bpmNumber = new Nexus.Number('#bpm-number');
    bpmNumber.link(bpmSlider);

    bpmNumber.colorize('accent', pink);
    bpmNumber.colorize('fill', lightGrey);
    bpmNumber.colorize('dark', white);

    bpmSlider.on('change', (v) => {
        Tone.Transport.bpm.value = v;
    });

    const sequencerPlayButton = new Nexus.TextButton('#sequencer-play-button', {
        'size': [96, 36],
        'alternateText': 'Stop'
    });

    sequencerPlayButton.colorize('accent', pink);

    sequencerPlayButton.on('change', (play) => {
        if (play) {
            Tone.Transport.start();
        } else {
            Tone.Transport.stop();
        }
    });
}


function createPads(synths) {
    const kickPad = createPad('#kick-pad', 'Kick');
    const snarePad = createPad('#snare-pad', 'Snare');
    const hihatOnePad = createPad('#hihat-one-pad', 'HH 1');
    const hihatTwoPad = createPad('#hihat-two-pad', 'HH 2');

    kickPad.on('change', (v) => {
        if (v) {
            synths['kick'].play();
        }
    });

    snarePad.on('change', (v) => {
        if (v) {
            synths['snare'].play();
        }
    });

    hihatOnePad.on('change', (v) => {
        if (v) {
            synths['hihatOne'].play();
        }
    });

    hihatTwoPad.on('change', (v) => {
        if (v) {
            synths['hihatTwo'].play();
        }
    });

}

function createPad(id, text) {
    const pad = new Nexus.TextButton(id, {
        'size': [108,108],
        'text': text
    });

    pad.colorize('accent', pink);
    pad.colorize('fill', darkGrey);
    pad.colorize('dark', white);

    return pad;
}


function createControlContainers() {
    // Hide all pad settings initially
    const controlContainers = document.querySelectorAll('.control-container');
    controlContainers.forEach((container) => {
        container.style.display = 'none';
    });


    const padContainers = document.querySelectorAll('.pad-container');

    // Explicitly set border here so style can be checked for tab toggle logic
    padContainers.forEach((container) => {
        container.style.border = 'none';
    })

    // Tab toggle functionality
    const controlToggles = document.querySelectorAll('.pad-container label');
    controlToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            let controlToToggle = toggle.attributes.controls.value;
            let parentContainer = toggle.parentElement;

            // open the corresponding container and close all others
            controlContainers.forEach((container) => {
                if (container.id === controlToToggle) {
                    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
                } else {
                    container.style.display = 'none';
                }
            });

            // highlight the selected pad container and remove highlight from all others
            padContainers.forEach((container) => {
                if (container === parentContainer) {
                    container.style.border = container.style.border === 'none' ? `2px solid ${lightGrey}` : 'none';
                } else {
                    container.style.border = 'none';
                }
            });
        });
    });
}


function createLoop(sequencer, synths, synthNames) {
    const loop = new Tone.Sequence(function(time, col) {
        const columnStates = sequencer.matrix.column(col);

        columnStates.forEach(function(isArmed, index){
            if(isArmed) {
                const synth = synthNames[index];
                synths[synth].play();
            }
        });

        Tone.Draw.schedule(function(){
            sequencer.stepper.value = col;
            sequencer.render();
        }, time);
    }, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "16n")

    return loop;
}


function createNexusSlider(id, min, max, step, value) {
    const slider = new Nexus.Slider(id, {
        'size': [25,100],
        'min': min,
        'max': max,
        'step': step,
        'value': value
    });

    slider.colorize('accent', pink);
    slider.colorize('fill', lightGrey);

    return slider;
}


function createNexusSelect(id, options) {
    const select = new Nexus.Select(id, {'options': options});

    select.colorize('fill', lightGrey);
    select.colorize('dark', white);

    return select;
}


function createSliderNumber(id) {
    const number = new Nexus.Number(id);

    number.colorize('accent', pink);
    number.colorize('fill', lightGrey);
    number.colorize('dark', white);

    return number;
}


function connectControlsToSynths(controls, synths) {
    controls.forEach((control) => {
        control.on('change', () => {
            let value = control.value;
            let synth = control.parent.attributes.synth.value;
            let settingType = control.parent.attributes.settingtype.value;
            synths[synth].updateSetting(settingType, value);
        });
    });
}


function createAndConnectPadControls(synths) {
    const kickPitchOptions = ['C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1', 'C2'];

    const kickControls = [
        createNexusSlider('kick-attack', 0.01, 1, 0.01, 0.01),
        createNexusSlider('kick-decay', 0.01, 1, 0.01, 0.4),
        createNexusSlider('kick-sustain', 0.01, 1, 0.01, 0.01),
        createNexusSlider('kick-release', 0.1, 2, 0.1, 1.4),
        createNexusSlider('kick-velocity', 0, 1, 0.1, 0.7),
        createNexusSelect('kick-pitch', kickPitchOptions)
    ];


    const kickControlNumbers = [
        createSliderNumber('kick-attack-number').link(kickControls[0]),
        createSliderNumber('kick-decay-number').link(kickControls[1]),
        createSliderNumber('kick-sustain-number').link(kickControls[2]),
        createSliderNumber('kick-release-number').link(kickControls[3]),
        createSliderNumber('kick-velocity-number').link(kickControls[4]),
    ]


    const snareControls = [
        createNexusSlider('snare-attack', 0.01, 1, 0.01, 0.01),
        createNexusSlider('snare-decay', 0.05, 1, 0.01, 0.1),
        createNexusSlider('snare-sustain', 0, 1, 0.01, 0),
        createNexusSlider('snare-velocity', 0, 1, 0.1, 0.7),
        createNexusSelect('snare-noise-type', ['pink', 'brown', 'white'])
    ]


    const snareControlNumbers = [
        createSliderNumber('snare-attack-number').link(snareControls[0]),
        createSliderNumber('snare-decay-number').link(snareControls[1]),
        createSliderNumber('snare-sustain-number').link(snareControls[2]),
        createSliderNumber('snare-velocity-number').link(snareControls[3]),
    ]


    const hihatOneControls = [
        createNexusSlider('hihat-one-attack', 0.001, 0.5, 0.001, 0.001),
        createNexusSlider('hihat-one-decay', 0.1, 1.5, 0.1, 0.7),
        createNexusSlider('hihat-one-release', 0.1, 1.5, 0.1, 0.5),
        createNexusSlider('hihat-one-velocity', 0, 1, 0.1, 0.7)
    ]


    const hihatOneControlNumbers = [
        createSliderNumber('hihat-one-attack-number').link(hihatOneControls[0]),
        createSliderNumber('hihat-one-decay-number').link(hihatOneControls[1]),
        createSliderNumber('hihat-one-release-number').link(hihatOneControls[2]),
        createSliderNumber('hihat-one-velocity-number').link(hihatOneControls[3]),
    ]

    const hihatTwoControls = [
        createNexusSlider('hihat-two-attack', 0.001, 0.5, 0.001, 0.001),
        createNexusSlider('hihat-two-decay', 0.1, 1.5, 0.1, 0.1),
        createNexusSlider('hihat-two-release', 0.1, 1.5, 0.1, 0.1),
        createNexusSlider('hihat-two-velocity', 0, 1, 0.1, 0.3)
    ]


    const hihatTwoControlNumbers = [
        createSliderNumber('hihat-two-attack-number').link(hihatTwoControls[0]),
        createSliderNumber('hihat-two-decay-number').link(hihatTwoControls[1]),
        createSliderNumber('hihat-two-release-number').link(hihatTwoControls[2]),
        createSliderNumber('hihat-two-velocity-number').link(hihatTwoControls[3]),
    ]

    connectControlsToSynths(kickControls, synths);
    connectControlsToSynths(snareControls, synths);
    connectControlsToSynths(hihatOneControls, synths);
    connectControlsToSynths(hihatTwoControls, synths);
}


class Animator {
    constructor() {
        this.analyser = Tone.context.createAnalyser();
        Tone.Master.connect(this.analyser);

        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);

        this.dpi = window.devicePixelRatio;

        this.canvas = document.getElementById('frequency-canvas');
        this.canvasCtx = this.canvas.getContext('2d');
        this.draw = this.draw.bind(this);
    }

    fixDpi() {
        let styleHeight = +getComputedStyle(this.canvas).getPropertyValue('height').slice(0, -2);

        let styleWidth = +getComputedStyle(this.canvas).getPropertyValue('width').slice(0, -2);

        this.canvas.setAttribute('height', styleHeight * this.dpi);
        this.canvas.setAttribute('width', styleWidth * this.dpi);
    }

    draw() {
        requestAnimationFrame(this.draw);

        this.analyser.getByteFrequencyData(this.dataArray);

        this.fixDpi();

        let heightRatio = this.canvas.height / 128;

        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Only render 1/8th of the frequencies returned, so adjust bar width to fill gaps
        // leave one pixel between each bar
        // subtract 8 from bufferLength because we're not rendering the first 8 buffer values
        let barWidth = (this.canvas.width / ((this.bufferLength - 8) / 8)) - 1;

        let barHeight;
        let alpha;

        let x = 0;

        // Start at 8 because the lowest frequencies are inaudible anyway
        for (let i = 8; i < this.bufferLength; i += 8) {

            // divide by two to leave some headroom, so the visual ceiling isn't as sharp
            barHeight = this.dataArray[i] * heightRatio / 2;

            // calculate alpha value relative to amplitude

            // alpha = (100 + this.dataArray[i]).toString(16);
            alpha = 100 + this.dataArray[i];
            alpha = alpha <= 255 ? alpha.toString(16) : "ff";

            this.canvasCtx.fillStyle = `${darkPink}${alpha}`;
            this.canvasCtx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }
}

