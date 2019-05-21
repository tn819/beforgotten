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

button.ontouchstart = () => {
    let dataURL = canvas.toDataURL("image/png");
    let hidden = document.getElementsByName("signatureURL")[0];
    hidden.value = dataURL;
};

//all below code from > mobile adaptive canvas: http://bencentra.com/code/2014/12/05/html5-canvas-touch-events.html

canvas.addEventListener(
    "touchstart",
    function(e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", {
            view: event.target.ownerDocument.defaultView,
            clientX: touch.pageX,
            clientY: touch.pageY
        });
        canvas.dispatchEvent(mouseEvent);
    },
    false
);
canvas.addEventListener(
    "touchend",
    function(e) {
        var mouseEvent = new MouseEvent("mouseup", {});
        canvas.dispatchEvent(mouseEvent);
    },
    false
);
canvas.addEventListener(
    "touchmove",
    function(e) {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", {
            view: event.target.ownerDocument.defaultView,
            clientX: touch.pageX,
            clientY: touch.pageY
        });
        canvas.dispatchEvent(mouseEvent);
    },
    false
);
// Prevent scrolling when touching the canvas
document.body.addEventListener(
    "touchstart",
    function(e) {
        if (e.target == canvas) {
            e.preventDefault();
        }
    },
    { passive: false }
);
document.body.addEventListener(
    "touchend",
    function(e) {
        if (e.target == canvas) {
            console.log("touchend", e);
            e.preventDefault();
        }
    },
    { passive: false }
);
document.body.addEventListener(
    "touchmove",
    function(e) {
        if (e.target == canvas) {
            console.log("touchmove", e);
            e.preventDefault();
        }
    },
    { passive: false }
);
