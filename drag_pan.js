function setup_pan() {

    let canvas = document.getElementById("main_canvas");
    
    let lastX = 0;
    let lastY = 0;
    let isPanDragging = false;
    

    function getPointerCoords (e) {	
	let xVal = Number(document.getElementById("x_coord").value);
	let yVal = Number(document.getElementById("y_coord").value);
	let zoomVal = document.getElementById("zoom").value;
	var widthOffset =  canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;
	var heightOffset =  canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
	let zoomScaleOffset = 4.0/(zoomVal * widthOffset);
	let topLeftX = xVal - 2.0/zoomVal;
	let topLeftY = yVal + 2.0/zoomVal;
	let pointerX = topLeftX + (e.offsetX * zoomScaleOffset);
	let pointerY = topLeftY - (e.offsetY * zoomScaleOffset);
	pointerCoords = {x: pointerX, y: pointerY};
	return pointerCoords;
    }
			    
    canvas.addEventListener('pointermove', e => {
	let coords = getPointerCoords(e);
	pan(e);
	document.getElementById("coords").textContent = "(" + coords.x.toFixed(6) + "," + coords.y.toFixed(6) + ")";
    });
        
    canvas.addEventListener('pointerdown', e => {
	if (!isPanDragging) {
	    let coords = getPointerCoords(e);
	    lastX = coords.x;
	    lastY = coords.y;
	    isPanDragging = true;
	}
    });

    canvas.addEventListener('pointerout', e => {
	isPanDragging = false;	
    });
    
    canvas.addEventListener('pointerup', e => {
	isPanDragging = false;
    });

    function pan(e) {
	let coords = getPointerCoords(e);
	
	let xDiff = lastX - coords.x;
	let yDiff = lastY - coords.y;
	if (isPanDragging) {
	    
	    let newX = Number(document.getElementById('x_coord').value) + xDiff;
	    let newY = Number(document.getElementById('y_coord').value) + yDiff;
	    
	    document.getElementById('x_coord').value = newX;
	    document.getElementById('y_coord').value = newY;
	    	    
            redraw_main();
	}
	
    }
    document.getElementById("main_canvas").onwheel = zoom_canvas;
}


function zoom_canvas(event)
{
    event.preventDefault();
    let zoom = Number(document.getElementById('zoom').value);
    document.getElementById('zoom').value = zoom + event.deltaY * 0.01;
    redraw_main();
}
