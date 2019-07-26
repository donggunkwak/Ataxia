var canvas, ctx, flag = false,
            prevX = 0,
            currX = 0,
            prevY = 0,
            currY = 0,
            listX = [],
            listY = [],
            pretotal = 0,
            total = 0,
            started = false,
            dot_flag = false;
    
        var x = "black",
            y = 2;
        
        function init() {
            canvas = document.getElementById('can');
            ctx = canvas.getContext("2d");
            w = canvas.width;
            h = canvas.height;

            ctx.fillStyle = "#FF0000";
            ctx.fillRect(10, 150, 50, 50);

            ctx.fillStyle = "#00FF00";
            ctx.fillRect(340, 150, 50, 50);
        
            canvas.addEventListener("mousemove", function (e) {
                findxy('move', e)
            }, false);
            canvas.addEventListener("mousedown", function (e) {
                findxy('down', e)
            }, false);
            canvas.addEventListener("mouseup", function (e) {
                findxy('up', e)
            }, false);
            canvas.addEventListener("mouseout", function (e) {
                findxy('out', e)
            }, false);
        }
        

        
        function draw() {
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(currX, currY);
            ctx.strokeStyle = x;
            ctx.lineWidth = y;
            ctx.stroke();
            ctx.closePath();
        }
        function findxy(res, e) {
            //console.log("List Length: " + listX.length);
            //console.log("Total Errors: " + total);
            //console.log("Total Pre Errors: " + pretotal);
            //console.log(currX + ", " + currY);

            // If Mouse Held Down
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;

                /*
                10,150
                10,200
                60,150
                60,200
                */

                // If Not Started
                if (!started){
                    // If Click Button
                    if (currX >= 10 && currX <= 60 && currY >= 150 && currY <= 200){
                        started = true;

                        ctx.fillStyle = "#00FF00";
                        ctx.fillRect(10, 150, 50, 50);
                }

                else {
                    pretotal += 1;

                    // Push Failed Attempts/Coords to List
                    listX.push(currX);
                    listY.push(currY);
                    //console.log(currX + ", " + currY);
                }

                }

                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.beginPath();
                    ctx.fillStyle = x;
                    ctx.fillRect(currX, currY, 2, 2);
                    ctx.closePath();
                    dot_flag = false;
                }
            }

            // If Mouse Not Held Down
            if (res == 'up' || res == 'out') {
                flag = false;
                total += 1;
            }

            // If Mouse Moves
            if (res == 'move' && started) {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.offsetLeft;
                    currY = e.clientY - canvas.offsetTop;
                    draw();

                    listX.push(currX);
                    listY.push(currY);
                    //console.log(currX + ", " + currY);
                }
            }
        }