import { playKey, stopKey } from './main';

const midiInputs: any[] = [];

export const listMidiDevices = async () => {
  const access = await (navigator as any).requestMIDIAccess();
  access.inputs.forEach((input) => {
    midiInputs.push(input);
  });
  if (midiInputs.length) {
    const midiSelectList = document.getElementById('midiDevice');
    const placeholderOption = document.getElementById('midiPlaceholder');
    placeholderOption?.remove();
    midiInputs.forEach((input) => {
      const option = document.createElement('option');
      option.value = input.name;
      option.text = input.name;
      midiSelectList?.appendChild(option);
    });
    setSelectedMidiDevice((midiSelectList as HTMLSelectElement).value);
  }
};

export const setSelectedMidiDevice = async (selectedInputName: string) => {
  midiInputs.forEach((input) => {
    if (input.name === selectedInputName) {
      input.onmidimessage = (message) => {
        const noteOnMidi = 144;
        const noteOffMidi = 128;
        if (message.data[0] === noteOnMidi && message.data[2] > 0) {
          playKey(message.data[1]);
          console.dir(message.data[1]);
        }
        if (
          message.data[0] === noteOffMidi ||
          (message.data[0] === noteOnMidi && message.data[2] === 0)
        ) {
          stopKey(message.data[1]);
        }
      };
    } else {
      input.onmidimessage = '';
    }
  });
};
