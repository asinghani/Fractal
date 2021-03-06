/*
    This program generates the Koch Curve fractal.

    Copyright © 2016 Anish Singhani
*/

// When Page loaded, create drawing canvas
// Then set variables w and h to equal width and height
var canvas, w, h, layers;

$(document).ready(function(){
    w = $("#fractal").width();
    h = $("#fractal").height()

    canvas = new Konva.Stage({
        container: "fractal",
        width: w,
        height: h
    });

    $("#generate").click(generate);
    $("#generateSlow").click(generateSlow);
    $("#step").click(step);
    $("#reset").click(reset);

    $("#iterationsSlider").change(updateIterationLabel);
    $("#iterationsLabel").change(updateIterationSlider);

    $("#fractionSlider").change(updateFractionLabel);
    $("#fractionLabel").change(updateFractionSlider);
});

// The following code generates and displays the fractal

var iterations; // Number of iterations
var fraction; // Fraction

var i = -1; // This variable is the current step
function generate(){
    reset();
    iterations = parseInt($("#iterationsLabel").val()); // This is the number of iterations
    fraction = parseInt($("#fractionLabel").val()); // This is the fraction
    i = -1;
    layers = new Array(iterations+2);

    for(var loop = 0; loop < iterations; loop++){ // Generate 1 step, repeat this function as many times as requested
        step();
    }
}

function generateSlow(){
    reset();
    iterations = parseInt($("#iterationsLabel").val()); // This is the number of iterations
    fraction = parseInt($("#fractionLabel").val()); // This is the fraction
    i = -1;
    layers = new Array(iterations+2);

    for(var loop = 0; loop < iterations; loop++){ // Generate 1 step, repeat this function as many times as requested
        setTimeout(step, loop*1000);
    }
}

// This code generates one step of the fractal
function step(){
    if(i == -1){
        iterations = parseInt($("#iterationsLabel").val()); // This is the number of iterations
        fraction = parseInt($("#fractionLabel").val()); // This is the fraction
        i = 0;
        layers = new Array(iterations+2);

        var layer = new Konva.Layer();

        // Draw equilateral triangle

        var point1x = (w/2)+((h-140)/Math.sqrt(3));
        var point2x = (w/2)-((h-140)/Math.sqrt(3));
        var point3x = w/2;
        var point1y = 140;
        var point2y = 140;
        var point3y = h;

        var point1x2 = w / 2;
        var point2x2 = point3x + (point2x-point3x) / 2;
        var point3x2 = point3x + (point1x-point3x) / 2;
        var point1y2 = point1y;
        var point2y2 = 140 + (h-140) / 2;
        var point3y2 = 140 + (h-140) / 2;

        var point1x3 = w / 2;
        var point2x3 = point1x2 + (point2x2-point1x2) / 2;
        var point3x3 = point1x2 + (point3x2-point1x2) / 2;
        var point1y3 = point3y2;
        var point2y3 = point1y2 + (point3y2-point1y2) / 2;
        var point3y3 = point1y2 + (point3y2-point1y2) / 2;

        layer.add(new Konva.Line({points: [point1x, point1y, point2x, point2y], stroke: 'green', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point2x, point2y, point3x, point3y], stroke: 'green', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point3x, point3y, point1x, point1y], stroke: 'green', strokeWidth: 3}));

        layer.add(new Konva.Line({points: [point1x2, point1y2, point2x2, point2y2], stroke: 'red', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point2x2, point2y2, point3x2, point3y2], stroke: 'red', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point3x2, point3y2, point1x2, point1y2], stroke: 'red', strokeWidth: 3}));

        layer.add(new Konva.Line({points: [point2x3, point2y3, point1x3, point1y3], stroke: 'blue', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point3x3, point3y3, point2x3, point2y3], stroke: 'blue', strokeWidth: 3}));
        layer.add(new Konva.Line({points: [point1x3, point1y3, point3x3, point3y3], stroke: 'blue', strokeWidth: 3}));

        canvas.add(layer);

        var text = new Konva.Layer();
        text.add(new Konva.Text({x: 25, y: h-50, text: "Iteration: "+i,
              fontSize: 25,
              fill: 'red'
         }));

        canvas.add(text);

        layers[i] = layer;

        i++; // Now the program is onto the next step
    }else{
        var layer = new Konva.Layer();

        var segments = layers[i - 1].getChildren();
        console.log(segments[0]);
        for(var x = 0; x < segments.length; x++){
            // This code repeats for each segment in the previous step
            var seg = segments[x];

            var length = (seg.points()[2] - seg.points()[0]);
            var lengthY = (seg.points()[3] - seg.points()[1]);

            var fraction1 = (fraction-1)*length;
            var fraction2 = (fraction+1)*length;

            fraction1 = fraction1 / (fraction*2);
            fraction2 = fraction2 / (fraction*2);

            var fraction1Y = (fraction-1)*lengthY;
            var fraction2Y = (fraction+1)*lengthY;

            fraction1Y = fraction1Y / (fraction*2);
            fraction2Y = fraction2Y / (fraction*2);

            var point1x = seg.points()[0]; // Point1 is the starting point of the previous segment
            var point1y = seg.points()[1];
            var point2x = seg.points()[0] + fraction1; // Point2 is the point 1/3 the way through the previous segment (or other length, depends on fraction)
            var point2y = seg.points()[1] + fraction1Y;
            var point3x = seg.points()[0] + fraction2; // Point3 is the point 2/3 of the way through the previous segment (or other length, depends on fraction)
            var point3y = seg.points()[1] + fraction2Y;
            var point4x = seg.points()[2]; // Point4 is the ending point of the previous segment
            var point4y = seg.points()[3];

            // Draw line from point1 to point2
            layer.add(new Konva.Line({points: [point1x, point1y, point2x, point2y], stroke: seg.stroke(), strokeWidth: 3}));

            // Draw line from point3 to point4
            layer.add(new Konva.Line({points: [point3x, point3y, point4x, point4y], stroke: seg.stroke(), strokeWidth: 3}));

            var centerX = Math.abs((point2x + point3x) / 2);
            var centerY = Math.abs((point2y + point3y) / 2);

            var distX = fraction2 - fraction1;
            var distY = fraction2Y - fraction1Y;

            var pointX = -1 * (distX*cos90 - distY*sin90);
            var pointY = (distY*cos90 - distX*sin90);

            pointX += centerX;
            pointY += centerY;

            // Draw 2 lines in a triangle formation between point2 and point3
            layer.add(new Konva.Line({points: [point2x, point2y, pointX, pointY], stroke: seg.stroke(), strokeWidth: 3}));
            layer.add(new Konva.Line({points: [pointX, pointY, point3x, point3y], stroke: seg.stroke(), strokeWidth: 3}));

            console.log("length: %d, point1: %d, point2: %d, point3: %d, point4: %d, frac1: %d, frac2: %d",
                length, point1x, point2x, point3x, point4x, fraction1, fraction2); // Debugging
            console.log("centerX: %d, centerY: %d, distX: %d, distY: %d, pointX: %d, pointY: %d", centerX, centerY,
                distX, distY, pointX, pointY);
        }
        canvas.removeChildren();
        canvas.add(layer);

        var text = new Konva.Layer();
        text.add(new Konva.Text({x: 25, y: h-50, text: "Iteration: "+i,
              fontSize: 25,
              fill: 'red'
         }));

        canvas.add(text);
        layers[i] = layer;
        i++;
    }
}

// Reset Fractal
function reset(){
    i = -1;
    canvas.removeChildren();
}

// Extra code to control the interface
function updateIterationLabel(){
    $("#iterationsLabel").val($("#iterationsSlider").val());
}

function updateIterationSlider(){
    $("#iterationsSlider").val($("#iterationsLabel").val());
}

function updateFractionLabel(){
    $("#fractionLabel").val($("#fractionSlider").val());
}

function updateFractionSlider(){
    $("#fractionSlider").val($("#fractionLabel").val());
}
