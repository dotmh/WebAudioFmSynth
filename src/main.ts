import { AmpEnveloperADS, synth } from "./synth";

let _stop: (() => void) | null;

const playBtn: HTMLButtonElement | null = document.querySelector('#play');
const stopBtn: HTMLButtonElement | null = document.querySelector('#stop');

const isDisabled: 'is-disabled' = 'is-disabled';

const ADSRLabels: ['attack', 'decay', 'sustain', 'release'] = ['attack', 'decay', 'sustain', 'release']

const play = () => {

  const noteEl: HTMLSelectElement | null = document.querySelector('#note');
  const osc1TypeEl: HTMLSelectElement | null = document.querySelector('#wave1');
  const osc2TypeEl: HTMLSelectElement | null = document.querySelector('#wave2');
  const oscGainEl: HTMLInputElement | null = document.querySelector('#osc-gain')

  const filterEls: (HTMLInputElement | null)[] = [
    document.querySelector('#filter-attack'),
    document.querySelector('#filter-decay'),
    document.querySelector('#filter-sustain'),
    document.querySelector('#filter-release')
  ]

  const ampEls: (HTMLInputElement | null)[] = [
    document.querySelector('#amp-attack'),
    document.querySelector('#amp-decay'),
    document.querySelector('#amp-sustain'),
    document.querySelector('#amp-release'),
  ]

  const note: number = noteEl ? parseFloat(noteEl.value) : 0;
  const osc1Type = osc1TypeEl ? osc1TypeEl.value as unknown as OscillatorType : 'sine';
  const osc2Type = osc2TypeEl ? osc2TypeEl.value as unknown as OscillatorType : 'sine';
  const gain: number = oscGainEl ? parseFloat(oscGainEl.value) : 5000;

  const filterEnvelope = 
    new Float32Array(filterEls?.map((filterEl) => filterEl ? parseFloat(filterEl.value) : 0))

  const ampEnvelope = 
  Object.fromEntries(
    ampEls
      .map((ampEl) => ampEl ? parseFloat(ampEl.value) : 0)
      .map((value) => value / 1000)
      .map((value, index) => {
        return [ADSRLabels[index], value]
      })) as unknown as AmpEnveloperADS;

  const {start, stop} = synth({note, osc1Type, osc2Type, filterEnvelope, gain, ampEnvelope});
  _stop  = stop;
  start();

  if (playBtn) {
    playBtn.disabled = true;
    playBtn.classList.add(isDisabled);
  }
}

const stop = () => {
  if (_stop) {
    _stop();
    _stop = null;
    if (playBtn) {
      playBtn.disabled = false;
      playBtn.classList.remove(isDisabled)
    }
  }
}

if (playBtn) {
  playBtn.addEventListener('click', play)
}

if (stopBtn) {
  stopBtn.addEventListener('click', stop);
}