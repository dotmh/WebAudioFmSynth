const C: number = 130.81;

interface OscOptions {
  osc1Type: OscillatorType;
  osc2Type: OscillatorType;
  gain: number;
  osc1Freq: number;
  osc2Freq: number;
}

interface FmOsc {
  osc1: OscillatorNode;
  osc2: OscillatorNode;
}

interface FilterOptions {
 type: BiquadFilterType;
 q: number,
 envelope: Float32Array
 duration?: number
}

const sleep = async (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

const adsrFilter = (audioContext: AudioContext, filterOptions: FilterOptions): BiquadFilterNode => {
    
  const {type, q, envelope, duration} = filterOptions;
  
  const filter: BiquadFilterNode = audioContext.createBiquadFilter();
    
  filter.type = type;
  filter.frequency.setValueCurveAtTime(envelope, audioContext.currentTime, duration ?? 4);
  filter.Q.value = q;

  return filter;
}

const fMOsc = (audioContext: AudioContext, oscOptions: OscOptions): FmOsc => {
  
  // --> Setup Nodes
  const {osc1Type, osc2Type, osc1Freq, osc2Freq, gain} = oscOptions; 
  
  const gainNode: GainNode = audioContext.createGain();
  const osc1: OscillatorNode = audioContext.createOscillator();
  const osc2: OscillatorNode = audioContext.createOscillator();

  gainNode.gain.value = gain;

  osc1.type = osc1Type;
  osc2.type = osc2Type;

  osc1.frequency.value = osc1Freq;
  osc2.frequency.value = osc2Freq;

  // --> Wire up nodes
  osc1.connect(gainNode);
  gainNode.connect(osc2.detune);

  return {osc1 , osc2}

}

export const synth = async () => {
  const audioContext: AudioContext = new AudioContext();

  const {osc1 , osc2} = fMOsc(audioContext, {
    osc1Type: 'sine',
    osc2Type: 'sine',
    osc1Freq: C,
    osc2Freq: C,
    gain: 5000
  });

  const filter = adsrFilter(audioContext, {
    type: 'lowpass',
    envelope: new Float32Array([440, 220, 110, 55, 440]),
    q: 4
  })

  osc2.connect(filter);
  filter.connect(audioContext.destination)

  osc1.start(audioContext.currentTime);
  osc2.start(audioContext.currentTime);

  await sleep(2000);

  osc1.stop();
  osc2.stop();
};