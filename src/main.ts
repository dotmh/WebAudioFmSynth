import { synth } from "./synth";

let _stop: (() => void) | null;

const play = () => {

  const noteEl: HTMLSelectElement | null = document.querySelector('#note');
  const osc1TypeEl: HTMLSelectElement | null = document.querySelector('#wave1');
  const osc2TypeEl: HTMLSelectElement | null = document.querySelector('#wave2');

  const filterEls: (HTMLInputElement | null)[] = [
    document.querySelector('#filter-attack'),
    document.querySelector('#filter-decay'),
    document.querySelector('#filter-sustain'),
    document.querySelector('#filter-release')
  ]

  const note: number = noteEl ? parseFloat(noteEl.value) : 0;
  const osc1Type = osc1TypeEl ? osc1TypeEl.value as unknown as OscillatorType : 'sine';
  const osc2Type = osc2TypeEl ? osc2TypeEl.value as unknown as OscillatorType : 'sine';

  const filterEnvelope = 
    new Float32Array(filterEls?.map((filterEl) => filterEl ? parseFloat(filterEl.value) : 0))

  const {start, stop} = synth({note, osc1Type, osc2Type, filterEnvelope});
  _stop  = stop;
  start();
}

const stop = () => {
  if (_stop) {
    _stop();
    _stop = null;
  }
}

document.querySelector('#play')?.addEventListener('click', play);
document.querySelector('#stop')?.addEventListener('click', stop);