const canvas = document.getElementById('canvas1');
const keys = document.getElementById('keyboard');

canvas.width = 50;
canvas.height = 50;
const ctx = canvas.getContext('2d');
let audioSource;
let analyser;

keys.addEventListener('click', function(){

    // make sure the addEventListener is working
    console.log("keys pressed")

    const audioContext = new AudioContext();
    audioSource = []
    analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
    analyser.fftSize = 128;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const barWidth = (canvas.width/2)/bufferLength;
    let barHeight;
    let x;

    // animate for bar graph frequency display
    function animate(){
        x = 0;
        ctx.clearRect(0,0, canvas.width, canvas.height);
        analyser.getByteFrequencyData(dataArray);
        drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray)
        requestAnimationFrame(animate);
    }
    return animate();

});

// Below drawVisualiser is a ciicle Visualiser
function drawVisualiser(bufferLength, x, barWidth, barHeight, dataArray){
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