import * as Tone from 'tone';
import { Sound } from './drumSounds';
import * as Nexus from './lib/NexusUI';


window.addEventListener('load', () => {

    // Tone.Transport.bpm.value = 100;

    const masterVolume = new Nexus.Slider('#master-volume', {
        'size': [25,100]
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

    const sequencerPlayButton = new Nexus.TextButton('#sequencer-play-button', {
        'size': [96, 36],
        'alternateText': 'Stop'
    });

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



    // const kickControls = new Nexus.Rack('#kick-controls');
    const kickControls = [
        createNexusSlider('kick-attack'),
        createNexusSlider('kick-decay'),
        createNexusSlider('kick-sustain'),
        createNexusSlider('kick-release'),
        createNexusSlider('kick-velocity'),
        createNexusSelect('kick-pitch')
    ]

    const kickControlNumbers = [
        createSliderNumber('kick-attack-number').link(kickControls[0]),
        createSliderNumber('kick-decay-number').link(kickControls[1]),
        createSliderNumber('kick-sustain-number').link(kickControls[2]),
        createSliderNumber('kick-release-number').link(kickControls[3]),
        createSliderNumber('kick-velocity-number').link(kickControls[4]),
    ]


    const snareControls = [
        createNexusSlider('snare-attack'),
        createNexusSlider('snare-decay'),
        createNexusSlider('snare-sustain'),
        createNexusSlider('snare-velocity'),
        createNexusSelect('snare-noise-type')
    ]


    const snareControlNumbers = [
        createSliderNumber('snare-attack-number').link(snareControls[0]),
        createSliderNumber('snare-decay-number').link(snareControls[1]),
        createSliderNumber('snare-sustain-number').link(snareControls[2]),
        createSliderNumber('snare-velocity-number').link(snareControls[3]),
    ]



    const controlContainers = document.querySelectorAll('.control-container');
    controlContainers.forEach((container) => {
        container.style.display = 'none';
    });


    const controlToggles = document.querySelectorAll('.pad-container label');
    controlToggles.forEach((toggle) => {
        toggle.addEventListener('click', () => {
            let controlToToggle = toggle.attributes.controls.value;
            controlContainers.forEach((container) => {
                if (container.id === controlToToggle) {
                    container.style.display = container.style.display === 'none' ? 'flex' : 'none';
                } else {
                    container.style.display = 'none';
                }
            })
        })
    });



    sequencerPlayButton.on('change', (play) => {
        if (play) {
            Tone.Transport.start();
        } else {
            Tone.Transport.stop();
        }
    });

    const sequencer = new Nexus.Sequencer('#step-sequencer', {
        'size': [768, 144],
        'rows': 3,
        'columns': 16
    });
    sequencer.colorize('accent', "#f0f");
    sequencer.colorize('fill', "#000");
    sequencer.colorize('mediumLight', "#0ff");

    const kick = new Sound('kick');
    const snare = new Sound('snare');
    const hihat = new Sound('hihat');


    const synths = {
        'kick' : kick,
        'snare' : snare,
        'hihat' : hihat
    }
    const synthNames = ['kick', 'snare', 'hihat'];


    const loop = new Tone.Sequence(function(time, col) {
        const columnStates = sequencer.matrix.column(col);

        columnStates.forEach(function(isArmed, index){
            if(isArmed) {
                const synth = synthNames[index];
                synths[synth].play();
            }
        });

        Tone.Draw.schedule(function(){
            sequencer.next();
        }, time);
    }, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15], "16n").start(0);

    // kickControlsContainer = document.getElementById('kick-controls');
    // kickControlsContainer.style.display = 'none !important';
});

function createNexusSlider(id) {
    return new Nexus.Slider(id, {
        'size': [25,100]
    });
}

function createNexusSelect(id) {
    return new Nexus.Select(id);
}

function createSliderNumber(id) {
    return new Nexus.Number(id);
}