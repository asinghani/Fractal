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

// This code generates one step of the fractal
function step(){
    if(i == -1){
        iterations = parseInt($("#iterationsLabel").val()); // This is the number of iterations
        fraction = parseInt($("#fractionLabel").val()); // This is the fraction
        i = 0;
        layers = new Array(iterations+2);

        var layer = new Konva.Layer();

        // Draw line from (0, 20) to (w, 20). The variable w is the width of the screen
        layer.add(new Konva.Line({points: [0, 20*(i+1), w, 20*(i+1)], stroke: 'black', strokeWidth: 3}));
        canvas.add(layer);

        layers[i] = layer;

        i++; // Now the program is onto the next step
    }else{
        var layer = new Konva.Layer();

        var segments = layers[i - 1].getChildren();
        console.log(segments[0]);
        for(var x = 0; x < segments.length; x++){
            // This code repeats for each segment in the previous step
            var seg = segments[x];

            var length = seg.points()[2] - seg.points()[0];

            var fraction1 = (fraction-1)*length;
            var fraction2 = (fraction+1)*length;

            fraction1 = fraction1 / (fraction*2);
            fraction2 = fraction2 / (fraction*2);

            var point1 = seg.points()[0]; // Point1 is the starting point of the previous segment
            var point2 = seg.points()[0] + fraction1; // Point2 is the point 1/3 the way through the previous segment (or other length, depends on fraction)
            var point3 = seg.points()[0] + fraction2; // Point3 is the point 2/3 of the way through the previous segment (or other length, depends on fraction)
            var point4 = seg.points()[2]; // Point4 is the ending point of the previous segment

            // Draw line from point1 to point2
            layer.add(new Konva.Line({points: [point1, 20*(i+1), point2, 20*(i+1)], stroke: 'black', strokeWidth: 3}));

            // Draw line from point3 to point4
            layer.add(new Konva.Line({points: [point3, 20*(i+1), point4, 20*(i+1)], stroke: 'black', strokeWidth: 3}));
            console.log("length: %d, point1: %d, point2: %d, point3: %d, point4: %d, frac1: %d, frac2: %d",
                length, point1, point2, point3, point4, fraction1, fraction2);
        }
        canvas.add(layer);
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
