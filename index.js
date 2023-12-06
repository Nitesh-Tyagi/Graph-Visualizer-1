const svg = document.getElementById('svg');
const main = document.getElementById('main');
const svgWidth = 1200; // SVG width
const svgHeight = 600; // SVG height

let circles = svg.querySelectorAll('.circle:not(#main)');
let minDist = 50;
let mainDist = 60;
let speed = -1.10000000000020;
const radius = 18.5;

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;

let slider = document.getElementById("slider");
let value = document.getElementById("value");
value.innerText = slider.value;

slider.oninput = function () {
    value.innerText = this.value;
    minDist = Number(this.value);
}

let speedSlider = document.getElementById("speedSlider");
let speedValue = document.getElementById("speed");
speedValue.innerText = speedSlider.value;

speedSlider.oninput = function () {
    speedValue.innerText = this.value;
    speed = -1.10000000000020 * Number(this.value);
}


main.addEventListener('mousedown', function(e) {
    isDragging = true;
    dragOffsetX = e.clientX - main.getBoundingClientRect().left;
    dragOffsetY = e.clientY - main.getBoundingClientRect().top;
    svg.appendChild(main); // Ensures the main circle is on top
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const x = e.clientX - dragOffsetX;
        const y = e.clientY - dragOffsetY;
        main.setAttribute('cx', x);
        main.setAttribute('cy', y);
        updateCircles();
    }
});

document.addEventListener('mouseup', function(e) {
    isDragging = false;
});

function calculateDistance(circle, mainCircle) {
    let dx = parseInt(circle.getAttribute('cx')) - parseInt(mainCircle.getAttribute('cx'));
    let dy = parseInt(circle.getAttribute('cy')) - parseInt(mainCircle.getAttribute('cy'));
    return Math.sqrt(dx * dx + dy * dy);
}

function sortCirclesByDistance() {
    circles = Array.from(circles).sort((a, b) => {
        let distanceA = calculateDistance(a, main);
        let distanceB = calculateDistance(b, main);
        return distanceA - distanceB;
    });
}

let currentCircleIndex = 0; // Index to keep track of the current circle to update

// function updateCircles() {
//     sortCirclesByDistance(); // Sort circles based on their distance from the main circle
//     circles.forEach(circle => {
//         adjustPositionBasedOnMain(circle, main);
//         adjustCirclesAmongThemselves();
//         constrainWithinBounds(circle);
//     });
// }

function updateCircles() {
    if (circles.length === 0) {
        return;
    }

    const currentCircle = circles[currentCircleIndex % circles.length];

    adjustCirclesAmongThemselves();
    adjustPositionBasedOnMain(currentCircle, main);
    constrainWithinBounds(currentCircle);

    // mainDist = calculateDistance(circles[currentCircleIndex/2],main);
    currentCircleIndex++; // Move to the next circle
    
}

function adjustPositionBasedOnMain(circle, mainCircle) {
    let dx = parseFloat(circle.getAttribute('cx')) - parseFloat(mainCircle.getAttribute('cx'));
    let dy = parseFloat(circle.getAttribute('cy')) - parseFloat(mainCircle.getAttribute('cy'));
    let distance = Math.sqrt(dx * dx + dy * dy);
    let angle = Math.atan2(dy, dx);

    if (distance > minDist) {
        const movementStep = speed; // Adjusted to 14 decimal places
        const newX = parseFloat(circle.getAttribute('cx')) + Math.cos(angle) * movementStep;
        const newY = parseFloat(circle.getAttribute('cy')) + Math.sin(angle) * movementStep;
        circle.setAttribute('cx', newX.toFixed(14));
        circle.setAttribute('cy', newY.toFixed(14));
    }
}

function adjustCirclesAmongThemselves() {
    circles.forEach(currentCircle => {
        circles.forEach(otherCircle => {
            if (otherCircle !== currentCircle) {
                let dx = parseFloat(currentCircle.getAttribute('cx')) - parseFloat(otherCircle.getAttribute('cx'));
                let dy = parseFloat(currentCircle.getAttribute('cy')) - parseFloat(otherCircle.getAttribute('cy'));
                let distance = Math.sqrt(dx * dx + dy * dy);
                let angle = Math.atan2(dy, dx);

                if (distance < minDist) {
                    const repelDist = minDist - distance;
                    const newX = parseFloat(currentCircle.getAttribute('cx')) + Math.cos(angle) * repelDist;
                    const newY = parseFloat(currentCircle.getAttribute('cy')) + Math.sin(angle) * repelDist;
                    currentCircle.setAttribute('cx', newX.toFixed(14));
                    currentCircle.setAttribute('cy', newY.toFixed(14));
                }
            }
        });
    });
}


function constrainWithinBounds(circle) {
    let cx = parseInt(circle.getAttribute('cx'));
    let cy = parseInt(circle.getAttribute('cy'));

    cx = Math.max(radius, Math.min(svgWidth - radius, cx));
    cy = Math.max(radius, Math.min(svgHeight - radius, cy));

    circle.setAttribute('cx', cx);
    circle.setAttribute('cy', cy);
}

function updateCircleList() {
    circles = svg.querySelectorAll('.circle:not(#main)'); // Update the list of circles
}

function addRandomCircle() {
    const newCircle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    
    newCircle.setAttribute("class", "circle");
    newCircle.setAttribute("cx", Math.random() * (svgWidth - 2 * radius) + radius); 
    newCircle.setAttribute("cy", Math.random() * (svgHeight - 2 * radius) + radius); 
    newCircle.setAttribute("r", "18.5");
    newCircle.setAttribute("fill", "#D0D0D0");
    newCircle.setAttribute("stroke", "#0C0C0C");
    newCircle.setAttribute("stroke-width", "3");

    svg.appendChild(newCircle);
    updateCircleList();
    sortCirclesByDistance();
}

// Add a new circle every 2 seconds
// setInterval(addRandomCircle, 2000);

const addButton = document.getElementById('add');
addButton.onclick = addRandomCircle;

// Adjust positions every 100 milliseconds
setInterval(updateCircles, 1);
