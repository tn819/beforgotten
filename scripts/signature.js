const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const button = document.querySelector("button");
context.lineWidth = 2.5;
context.lineJoin = context.lineCap = "round";
let signing = false;

// canvas drawing techniques refinement from: http://perfectionkills.com/exploring-canvas-drawing-techniques/

canvas.onmousedown = e => {
    signing = true;
    context.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
};

canvas.onmousemove = e => {
    if (signing) {
        context.lineTo(
            e.clientX - canvas.offsetLeft,
            e.clientY - canvas.offsetTop
        );
        context.stroke();
    }
};
canvas.onmouseup = e => {
    signing = false;
};

button.onclick = () => {
    let dataURL = canvas.toDataURL("image/png");
    let hidden = document.getElementsByName("signatureURL")[0];
    hidden.value = dataURL;
};
