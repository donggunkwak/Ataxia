var canvas, ctx, flag = false,
            leftObjective = [10, 150, 50, 50],
            rightObjective = [940, 150, 50, 50],
            prevX = 0,
            currX = 0,
            prevY = 0,
            currY = 0,
            listX = [],
            listY = [],
            pretotal = 0,
            total = 0,
            out = 0,
            off = 0,
            maxX = 0,
            reverse = 0,
            reverseStart = false,
            curOff = false,
            started = false,
            dot_flag = false;
            ended = false;


            var OptimalY = 0;


        var x = "black",
            y = 2;
        
        function init() {
            canvas = document.getElementById('can');
            ctx = canvas.getContext("2d");
            w = canvas.width;
            h = canvas.height;

            ctx.fillStyle = "#FF0000";
            ctx.fillRect(leftObjective[0], leftObjective[1], leftObjective[2], leftObjective[3]);
            ctx.fillRect(rightObjective[0], rightObjective[1], rightObjective[2], rightObjective[3]);
        
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
        

        function displayList(){
            var e = "";
            e += " Size: " + listX.length+" "+listY.length+ "<br/>";
            for(var i = 0; i < listX.length; i++){
                e += " " + listX[i] + " " + listY[i] + "<br/>";
            }
            document.getElementById("list").innerHTML = e;
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
            if(ended)
                return;

            // If Mouse Held Down
            if (res == 'down') {
                prevX = currX;
                prevY = currY;
                currX = e.clientX - canvas.offsetLeft;
                currY = e.clientY - canvas.offsetTop;
                maxX= Math.max(maxX,currX);
                /*
                10,150
                10,200
                60,150
                60,200
                */

                //10, 150, 50, 50

                // If Not Started
                if (!started){
                    // If Click Button
                    if (currX >= leftObjective[0] && currX <= (leftObjective[0] + leftObjective[2]) && currY >= leftObjective[1] && currY <= (leftObjective[1] + leftObjective[3])) {
                        started = true;

                        ctx.fillStyle = "#00FF00";
                        ctx.fillRect(leftObjective[0], leftObjective[1], leftObjective[2], leftObjective[3]);
                        OptimalY = currY;
                    }

                    else {
                        pretotal += 1;
                        document.getElementById("misses").innerHTML = "Before-Start misses: "+pretotal.toString(); 
                        listX.push(currX);
                        listY.push(currY);
                        displayList();
                        return;
                        // Push Failed Attempts/Coords to List
                    }

                }
                if(started&&Math.abs(currY-OptimalY)>20&&curOff==false)
                {
                    curOff = true;
                    off+=1;
                    document.getElementById("off").innerHTML = "Off-By-20: "+off.toString();
                }
                if(curOff==true&&started&&Math.abs(currY-OptimalY)<=20)
                {
                    curOff=false;
                }
                listX.push(currX);
                listY.push(currY);
                displayList();
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
            if (res == 'up') {
                flag = false;
                if(started)total += 1;
                document.getElementById("discontinuities").innerHTML = "Discontinuities: "+total.toString();
            }
            if(res=='out')
            {
                flag = false;
                if(started)
                {
                    out+=1;
                    document.getElementById("outofcanvas").innerHTML = "OutOfCanvas: "+out.toString();
                }
            }

            // If Mouse Moves
            if (res == 'move' && started) {
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - canvas.offsetLeft;
                    currY = e.clientY - canvas.offsetTop;
                    if(currX>maxX)
                    {
                        maxX = currX;
                        reverseStart = false;
                    }

                    listX.push(currX);
                    listY.push(currY);
                    displayList();
                    
                    // If End Checkpoint is Reached
                    if (currX >= rightObjective[0] && currX <= (rightObjective[0] + rightObjective[2]) && currY >= rightObjective[1] && currY <= (rightObjective[1] + rightObjective[3])) {
                        ctx.fillStyle = "#00FF00";
                        ctx.fillRect(rightObjective[0], rightObjective[1], rightObjective[2], rightObjective[3]);
                        ended = true;

                    }
                    draw();



                    if(Math.abs(currY-OptimalY)>20&&curOff==false)
                    {
                        curOff = true;
                        off+=1;
                        document.getElementById("off").innerHTML = "Off-By-20: "+off.toString();
                    }
                    if(curOff==true&&Math.abs(currY-OptimalY)<=20)
                    {
                        curOff=false;
                    }
                    if(reverseStart==false&&currX<maxX)
                    {
                        reverseStart = true;
                        reverse+=1;
                        document.getElementById("reverses").innerHTML ="Reverses: "+reverse.toString();
                    }
                    
                }
            }
        }