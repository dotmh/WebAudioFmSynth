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

}

const sleep = async (time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time));

const filter = (audioContext: AudioContext, filterOptions: FilterOptions) => {
  
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

  osc2.connect(audioContext.destination);

  osc1.start(audioContext.currentTime);
  osc2.start(audioContext.currentTime);

  await sleep(2000);

  osc1.stop();
  osc2.stop();
};

synth();