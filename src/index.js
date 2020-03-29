import * as Tone from 'tone';
import { Sound } from './drumSounds';
import * as Nexus from './lib/NexusUI';


window.addEventListener('load', () => {

    const masterVolume = new Nexus.Slider('#master-volume', {
        'size': [25,100]
    });

    const bpmSlider = new Nexus.Slider('#bpm-slider', {
        'size': [200, 25],
        'min': 50,
        'max': 180,
        'step': 1,
        'value': 100
    });

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

    const hihatClosedPad = new Nexus.TextButton('#hihat-closed-pad', {
        'size': [108,108],
        'text': 'HH 1'
    });

    const hihatOpenPad = new Nexus.TextButton('#hihat-open-pad', {
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

    console.log(kickControls);


    const bpmNumber = new Nexus.Number('#bpm-number');
    bpmNumber.link(bpmSlider);

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