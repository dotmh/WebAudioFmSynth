export const listMidiDevices = async () => {
  const access = await navigator.requestMIDIAccess();
  const inputs: string[] = [];
  console.dir(access.inputs);
  access.inputs.forEach((input) => {
    inputs.push(input.name);
  });
  console.dir(inputs);
  if (inputs.length) {
    const midiSelectList = document.getElementById('midiDevice');
    const placeholderOption = document.getElementById('midiPlaceholder');
    placeholderOption?.remove();
    inputs.forEach((input) => {
      const option = document.createElement('option');
      console.dir(midiSelectList.value);
      option.value = input;
      option.text = input;
      midiSelectList?.appendChild(option);
    });
  }
};
