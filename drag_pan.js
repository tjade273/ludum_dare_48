function setup_pan() {
    let canvas = document.getElementById("main_canvas");
    let panXBegin = 0;
    let panYBegin = 0;
    let isPanDragging = false;

    function setPointerCoords (e) {
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
	let coords = setPointerCoords(e);
	pan(e);
	document.getElementById("coords").textContent = "(" + coords.x.toFixed(6) + "," + coords.y.toFixed(6) + ")";
    });
        
    canvas.addEventListener('pointerdown', e => {
	if (!isPanDragging) {
	    let coords = setPointerCoords(e);
	    panXBegin = coords.x;
	    panYBegin = coords.y;
	    isPanDragging = true;
	    console.log(panXBegin);
	}
    });

    canvas.addEventListener('pointerout', e => {
	isPanDragging = false;	
    });
    
    canvas.addEventListener('pointerup', e => {
	isPanDragging = false;
    });

    function pan(e) {
	let min_dist = 0.000001;
	let coords = setPointerCoords(e);
	
	let xDiff = panXBegin - coords.x;
	let yDiff = panYBegin - coords.y;
	if (isPanDragging & xDiff > min_dist & yDiff > min_dist) {
	    
	    let newX = document.getElementById('x_coord').value + xDiff;
	    let newY = document.getElementById('y_coord').value + yDiff;			 
	    
	    document.getElementById('x_coord').value = newX;
	    document.getElementById('y_coord').value = newY;
	    
            redraw_main();
	}
	
    }
}
