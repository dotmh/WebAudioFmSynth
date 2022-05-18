// import {audioContext} from 'main.ts'
const canvas = document.getElementById('canvas1') as HTMLCanvasElement;
canvas.width = 50;
canvas.height = 50;
const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');
let analyser;

export const visualiser = (audioContext) => {
    
    // Need to assign a varible to audio source ideally output of the synth and that should feed the analyser.
    // audioSource = 
    
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const barWidth = (canvas.width/2)/bufferLength;
    let barHeight;
    let x;

    // animate for bar graph frequency display
    function animate(){
        if (!ctx) {
            return;
        }
        x = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    animate();
    return analyser;
};

// Below drawVisualiser is a ciicle Visualiser
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
    if (!ctx) {
        return;
    }
    for(let i = 0; i < bufferLength; i++){
        barHeight = dataArray[i];
        ctx.save();
        ctx.translate(canvas.width/2, canvas.height/2);
        ctx.rotate(i + Math.PI * 2/ bufferLength);
        const red = i * barHeight/30;
        const green = i/2; 
        const blue = barHeight;
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, barWidth, 15);
        ctx.fillStyle = 'rgb('+ red + ',' + green + ',' + blue + ')';
        ctx.fillRect(0, 0, barWidth, barHeight);
        x += barWidth;
        ctx.restore();
    }
}