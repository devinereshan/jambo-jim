import { Synth } from 'tone';

const synth = new Synth().toMaster();

function component() {
    const element = document.createElement('button');

    element.innerHTML = "Play Note";

    return element;
}

const playButton = component();
playButton.addEventListener('click', () => {
    synth.triggerAttackRelease('C3', '4n');
});

document.body.appendChild(playButton);
