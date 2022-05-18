import { AmpEnveloperADS, synth } from "./synth";
const ADSRLabels: ['attack', 'decay', 'sustain', 'release'] = ['attack', 'decay', 'sustain', 'release']

const getOsc = (freq: number) => {
  const osc1TypeEl: HTMLSelectElement | null = document.querySelector('#wave1');
  const osc2TypeEl: HTMLSelectElement | null = document.querySelector('#wave2');
  const oscGainEl: HTMLInputElement | null = document.querySelector('#osc-gain');

  const filterEls: (HTMLInputElement | null)[] = [
    document.querySelector('#filter-attack'),
    document.querySelector('#filter-decay'),
    document.querySelector('#filter-sustain'),
    document.querySelector('#filter-release'),
  ];

  const ampEls: (HTMLInputElement | null)[] = [
    document.querySelector('#amp-attack'),
    document.querySelector('#amp-decay'),
    document.querySelector('#amp-sustain'),
    document.querySelector('#amp-release'),
  ]

  const osc1Type = osc1TypeEl ? osc1TypeEl.value as unknown as OscillatorType : 'sine';
  const osc2Type = osc2TypeEl ? osc2TypeEl.value as unknown as OscillatorType : 'sine';
  const gain: number = oscGainEl ? parseFloat(oscGainEl.value) : 5000;

  const filterEnvelope = new Float32Array(
    filterEls?.map((filterEl) => (filterEl ? parseFloat(filterEl.value) : 0))
  );

  const ampEnvelope = 
  Object.fromEntries(
    ampEls
      .map((ampEl) => ampEl ? parseFloat(ampEl.value) : 0)
      .map((value) => value / 1000)
      .map((value, index) => {
        return [ADSRLabels[index], value]
      })) as unknown as AmpEnveloperADS;

  const { start, stop } = synth({ note: freq, osc1Type, osc2Type, filterEnvelope, gain, ampEnvelope });
  return { start, stop };
};

const getElementByNote = (note: any) => note && document.querySelector(`[note="${note}"]`);

const keys = {
  A: { element: getElementByNote('C'), note: 'C', octaveOffset: 0 },
  W: { element: getElementByNote('C#'), note: 'C#', octaveOffset: 0 },
  S: { element: getElementByNote('D'), note: 'D', octaveOffset: 0 },
  E: { element: getElementByNote('D#'), note: 'D#', octaveOffset: 0 },
  D: { element: getElementByNote('E'), note: 'E', octaveOffset: 0 },
  F: { element: getElementByNote('F'), note: 'F', octaveOffset: 0 },
  T: { element: getElementByNote('F#'), note: 'F#', octaveOffset: 0 },
  G: { element: getElementByNote('G'), note: 'G', octaveOffset: 0 },
  Y: { element: getElementByNote('G#'), note: 'G#', octaveOffset: 0 },
  H: { element: getElementByNote('A'), note: 'A', octaveOffset: 1 },
  U: { element: getElementByNote('A#'), note: 'A#', octaveOffset: 1 },
  J: { element: getElementByNote('B'), note: 'B', octaveOffset: 1 },
  K: { element: getElementByNote('C2'), note: 'C', octaveOffset: 1 },
  O: { element: getElementByNote('C#2'), note: 'C#', octaveOffset: 1 },
  L: { element: getElementByNote('D2'), note: 'D', octaveOffset: 1 },
  P: { element: getElementByNote('D#2'), note: 'D#', octaveOffset: 1 },
  semicolon: { element: getElementByNote('E2'), note: 'E', octaveOffset: 1 },
};

const getHz = (note = 'A', octave = 4) => {
  const A4 = 440;
  let N = 0;
  switch (note) {
    default:
    case 'A':
      N = 0;
      break;
    case 'A#':
    case 'Bb':
      N = 1;
      break;
    case 'B':
      N = 2;
      break;
    case 'C':
      N = 3;
      break;
    case 'C#':
    case 'Db':
      N = 4;
      break;
    case 'D':
      N = 5;
      break;
    case 'D#':
    case 'Eb':
      N = 6;
      break;
    case 'E':
      N = 7;
      break;
    case 'F':
      N = 8;
      break;
    case 'F#':
    case 'Gb':
      N = 9;
      break;
    case 'G':
      N = 10;
      break;
    case 'G#':
    case 'Ab':
      N = 11;
      break;
  }
  N += 12 * (octave - 4);
  return A4 * Math.pow(2, N / 12);
};

const pressedNotes = new Map();
let clickedKey = '';

const playKey = (key) => {
  if (!keys[key]) {
    return;
  }

  const freq = getHz(keys[key].note, (keys[key].octaveOffset || 0) + 3);

  if (Number.isFinite(freq)) {
    keys[key].element.classList.add('pressed');
    const osc = getOsc(freq);
    pressedNotes.set(key, osc);
    pressedNotes.get(key).start();
  }
};

const stopKey = (key) => {
  if (!keys[key]) {
    return;
  }

  keys[key].element.classList.remove('pressed');
  const osc = pressedNotes.get(key);

  if (osc) {
    osc.stop();
    pressedNotes.delete(key);
  }
};

document.addEventListener('keydown', (e) => {
  const eventKey = e.key.toUpperCase();
  const key = eventKey === ';' ? 'semicolon' : eventKey;
  if (!key || pressedNotes.get(key)) {
    return;
  }
  playKey(key);
});

document.addEventListener('keyup', (e) => {
  const eventKey = e.key.toUpperCase();
  const key = eventKey === ';' ? 'semicolon' : eventKey;

  if (!key) {
    return;
  }
  stopKey(key);
});

for (const [key, { element }] of Object.entries(keys)) {
  element.addEventListener('mousedown', () => {
    playKey(key);
    clickedKey = key;
  });
}

document.addEventListener('mouseup', () => {
  stopKey(clickedKey);
});
