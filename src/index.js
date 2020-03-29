import * as Tone from 'tone';
import { Sound } from './drumSounds';
import * as Nexus from './lib/NexusUI';
import StartAudioContext from 'startaudiocontext';


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
    // Create Sequencer controls

    Tone.Master.volume.value = -10;

    const masterVolume = new Nexus.Slider('#master-volume', {
        'size': [25,100],
        'min': -40,
        'max': 0,
        'step': 0.1,
        'value': -10
    });

    masterVolume.on('change', (v) => {
        Tone.Master.volume.value = v;
    });

    const bpmSlider = new Nexus.Slider('#bpm-slider', {
        'size': [200, 25],
        'min': 50,
        'max': 180,
        'step': 1,
        'value': 120
    });

    const bpmNumber = new Nexus.Number('#bpm-number');
    bpmNumber.link(bpmSlider);

    bpmSlider.on('change', (v) => {
        Tone.Transport.bpm.value = v;
    });

    const sequencerPlayButton = new Nexus.TextButton('#sequencer-play-button', {
        'size': [96, 36],
        'alternateText': 'Stop'
    });


    createPads();

    createControlContainers();


    // Create Sequencer
    const sequencer = new Nexus.Sequencer('#step-sequencer', {
        'size': [768, 144],
        'rows': 3,
        'columns': 16
    });
    sequencer.colorize('accent', "#f0f");
    sequencer.colorize('fill', "#000");
    sequencer.colorize('mediumLight', "#0ff");

    sequencerPlayButton.on('change', (play) => {
        if (play) {
            Tone.Transport.start();
        } else {
            Tone.Transport.stop();
        }
    });

    const kick = new Sound('kick');
    const snare = new Sound('snare');
    const hihat = new Sound('hihat');


    const synths = {
        'kick' : kick,
        'snare' : snare,
        'hihatOne' : hihat
    }
    const synthNames = ['kick', 'snare', 'hihatOne'];


    // Create and ready loop
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
    }, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "16n").start(0);


    createAndConnectPadControls(synths);
}

function createPads() {
    const kickPad = new Nexus.TextButton('#kick-pad', {
        'size': [108,108],
        'text': 'Kick'
    });

    const snarePad = new Nexus.TextButton('#snare-pad', {
        'size': [108,108],
        'text': 'Snare'
    });

    const hihatClosedPad = new Nexus.TextButton('#hihat-one-pad', {
        'size': [108,108],
        'text': 'HH 1'
    });

    const hihatOpenPad = new Nexus.TextButton('#hihat-two-pad', {
        'size': [108,108],
        'text': 'HH 2'
    });
}

function createControlContainers() {
      // Hide all pad settings initially
      const controlContainers = document.querySelectorAll('.control-container');
      controlContainers.forEach((container) => {
          container.style.display = 'none';
      });


      const padContainers = document.querySelectorAll('.pad-container');

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
                      container.style.background = container.style.background === 'lightblue' ? 'none' : 'lightblue';
                  } else {
                      container.style.background = 'none';
                  }
              });
          });
      });
}

function createNexusSlider(id, min, max, step, value) {
    return new Nexus.Slider(id, {
        'size': [25,100],
        'min': min,
        'max': max,
        'step': step,
        'value': value
    });
}

function createNexusSelect(id, options) {
    return new Nexus.Select(id, {'options': options});
}

function createSliderNumber(id) {
    return new Nexus.Number(id);
}

function connectControlsToSynths(controls, synths) {
    controls.forEach((control) => {
        // connect sliders
        if (control.parent.classList.contains('control-slider')){
            control.on('change', () => {
                let value = control.value;
                let synth = control.parent.attributes.synth.value;
                let settingType = control.parent.attributes.settingtype.value;
                synths[synth].updateSetting(settingType, value);
            });
        }
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
        createNexusSlider('hihat-two-decay', 0.1, 1.5, 0.1, 0.2),
        createNexusSlider('hihat-two-release', 0.1, 1.5, 0.1, 0.1),
        createNexusSlider('hihat-two-velocity', 0, 1, 0.1, 0.7)
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
}