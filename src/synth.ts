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

interface SynthConfig {
    note: number,
    osc1Type: OscillatorType,
    osc2Type: OscillatorType,
    filterEnvelope: Float32Array,
    gain: number,
    ampEnvelope: AmpEnveloperADS
}

export interface AmpEnveloperADS {
    attack: number,
    decay: number,
    sustain: number,
    release: number
}

interface AmpControl {
    amp: GainNode,
    releaseCb: () => number;
}

const sleep = async (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

const adsrAmp = (audioContext: AudioContext, {attack, decay, sustain, release}: AmpEnveloperADS): AmpControl => {
    const amp: GainNode = audioContext.createGain();
    amp.gain.setValueAtTime(0, audioContext.currentTime);
    amp.gain.setValueAtTime(1, audioContext.currentTime + attack);
    amp.gain.setValueAtTime(sustain, audioContext.currentTime + attack + decay);

    const releaseCb = () => {

        console.log(audioContext.currentTime);
        console.log(release);

        const endAt = audioContext.currentTime + release
        amp.gain.linearRampToValueAtTime(0, endAt);
        return endAt;
    }

    return {
        amp, releaseCb
    }
}

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

export const synth = (config: SynthConfig): {start: () => void, stop: () => void} => {

  const {note, osc1Type, osc2Type, filterEnvelope: envelope, gain, ampEnvelope} = config;

  console.log('Configuration : ');
  console.dir(config);

  const audioContext: AudioContext = new AudioContext();

  const {osc1 , osc2} = fMOsc(audioContext, {
    osc1Type,
    osc2Type,
    osc1Freq: note,
    osc2Freq: note,
    gain
  });

  const filter = adsrFilter(audioContext, {
    type: 'bandpass',
    envelope,
    q: 4
  })

  const {amp, releaseCb} = adsrAmp(audioContext, ampEnvelope)

  osc2.connect(filter);
  filter.connect(amp);
  amp.connect(audioContext.destination)

  return {
      start: () => {
          osc1.start(audioContext.currentTime);
          osc2.start(audioContext.currentTime);
      },
      stop: () => {
          const endAt = releaseCb();

          console.log(endAt);

          osc1.stop(endAt);
          osc2.stop(endAt);
      }
  }
};