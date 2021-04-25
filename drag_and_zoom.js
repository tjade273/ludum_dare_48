function setup_zoom() {
    let canvas = document.getElementById("main_canvas");
    let zoomXBegin = 0;
    let zoomYBegin = 0;
    let zoomXEnd = 0;
    let zoomYEnd = 0;
    let isZoomDragging = false;

    let mouseCoords = {x: 0, y: 0};

    function setMouseCoords (e) {
	let xVal = Number(document.getElementById("x_coord").value);
	let yVal = Number(document.getElementById("y_coord").value);
	let zoomVal = document.getElementById("zoom").value;
	var widthOffset =  canvas.getBoundingClientRect().right - canvas.getBoundingClientRect().left;
	var heightOffset =  canvas.getBoundingClientRect().bottom - canvas.getBoundingClientRect().top;
	let zoomScaleOffset = 4.0/(zoomVal * widthOffset);
	let topLeftX = xVal - 2.0/zoomVal;
	let topLeftY = yVal + 2.0/zoomVal;
	let mouseX = topLeftX + (e.offsetX * zoomScaleOffset);
	let mouseY = topLeftY - (e.offsetY * zoomScaleOffset);
	mouseCoords = {x: mouseX, y: mouseY};
	return mouseCoords;
    }
    
    canvas.addEventListener('mousemove', e => {
	let coords = setMouseCoords(e);
	document.getElementById("coords").textContent = "(" + coords.x.toFixed(6) + "," + coords.y.toFixed(6) + ")";
    });
        
    canvas.addEventListener('mousedown', e => {
	let coords = setMouseCoords(e);
	zoomXBegin = coords.x;
	zoomYBegin = coords.y;
	isZoomDragging = true;
    });

    canvas.addEventListener('mouseout', e => {
	isZoomDragging = false;
    });
    
    canvas.addEventListener('mouseup', e => {
	let minZoom = 0.0000001;
	let xDiff = Math.abs(zoomXBegin - zoomXEnd);
	let yDiff = Math.abs(zoomYBegin - zoomYEnd);
	if (isZoomDragging & (xDiff > minZoom)  & (yDiff > minZoom) ) {
	    let coords = setMouseCoords(e);
	    
	    zoomXEnd = coords.x;
	    zoomYEnd = coords.y;
	    isZoomDragging = false;
	    
	    let newX = Math.min(zoomXBegin, zoomXEnd) + xDiff / 2.0;
	    let newY = Math.min(zoomYBegin, zoomYEnd) + yDiff / 2.0;

	    let newZoom = 4.0 / Math.max(xDiff, yDiff);				 
	    
	    document.getElementById('x_coord').value = newX;
	    document.getElementById('y_coord').value = newY;
	    document.getElementById('zoom').value = newZoom;
	    
        document.getElementById('x_coord').dispatchEvent(new Event('input'));
	}
    });
}
