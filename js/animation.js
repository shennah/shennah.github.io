// MeteorRain = new function() {
//     var SCREEN_WIDTH = window.innerWidth;
//     var SCREEN_HEIGHT = window.innerHeight;

//     var cursor, canvas, context, image;

//     var particles = [];

//     var mouseX = 0;
//     var mouseY = 0;

//     var pattern;

//     this.init = function() {
//         canvas = document.getElementById("canvas");

//         if (canvas && canvas.getContext) {
//             context = canvas.getContext('2d');

//             document.addEventListener('mousemove', documentMouseMoveHandler, false);
//             // document.addEventListener('mousedown', documentMouseDownHandler, false);
//             window.addEventListener('resize', windowResizeHandler, false);

//             createCursor();

//             windowResizeHandler();

//             setInterval(loop, 1000/100);
//         }

//         image = new Image();

//         function drawPattern() {
//             pattern = context.createPattern(image, "repeat");
//         }

//         image.src = "images/water.gif";
//         image.onload = drawPattern;
//     }

//     function createCursor(position) {

//         if (!position){
//             var pos = {
//                 x: ( SCREEN_WIDTH  ) * 0.5 + (Math.random() * SCREEN_WIDTH), 
//                 y: ( SCREEN_HEIGHT  ) * 0.5 + (Math.random() * SCREEN_HEIGHT)
//             }

//             var m = new Cursor();
//             m.position.x = pos.x;
//             m.position.y = pos.y;

//             cursor = m;

//             createParticles(m.position);

//         } else {
//             var m = new Cursor();
//             m.position.x = position.x;
//             m.position.y = position.y;

//             createParticles(m.position);
//         }
//     }

//     function createParticles(pos) {
//         for (var i = 0; i < 1000; i++) {
//             var p = new Particle();
//             p.position.x = pos.x;
//             p.position.y = pos.y;
//             p.shift.x = pos.x;
//             p.shift.y = pos.y;

//             particles.push(p);
//         }
//     }

//     function documentMouseMoveHandler(event) {
//         mouseX = event.clientX;
//         mouseY = event.clientY;
//     }

//     // function documentMouseDownHandler(event) {
//     //     createCursor({x: mouseX, y: mouseY});
//     // }

//     function windowResizeHandler() {
//         canvas.width = SCREEN_WIDTH;
//         canvas.height = SCREEN_HEIGHT;

//         canvas.style.position = 'absolute';

//         canvas.style.left = (window.innerWidth - SCREEN_WIDTH) * 0.5 + 'px';
//         canvas.style.top = (window.innerHeight - SCREEN_HEIGHT) * 0.5 + 'px';
//     }

//     function loop() {
//         context.fillStyle = 'rgba(243,154,108,1)'; //trails
//         context.fillRect(0, 0, canvas.width, canvas.height);

//         var particle;
//         var i, j, ilen, jlen;

//         cursor.position.x += (mouseX - cursor.position.x)*0.1;
//         cursor.position.y += (mouseY - cursor.position.y)*0.1;

//         for (i = 0, ilen = particles.length; i < ilen; i++) {
//             particle = particles[i];

//             particle.angle += particle.speed;

//             particle.shift.x += (cursor.position.x - particle.shift.x) * particle.speed;
//             particle.shift.y += (cursor.position.y - particle.shift.y) * particle.speed;

//             particle.position.x = particle.shift.x + Math.sin(i + particle.angle) * (particle.orbit*particle.force);
//             particle.position.y = particle.shift.y + Math.cos(i + particle.angle) * (particle.orbit*particle.force);

//             particle.orbit += (cursor.orbit - particle.orbit) * 0.01;

//             context.beginPath();
//             // context.fillStyle = "hsl("+((particle.position.x/canvas.width + particle.position.y/canvas.height) * 180) + ", 100%, 70%)"; 

//             context.fillStyle = pattern 

//             context.arc(particle.position.x, particle.position.y, particle.size/2, 0, Math.PI*2, true);
//             context.fill();
//         }
//     }  
// }

// function distanceBetween(p1,p2) {
//     var dx = p2.x - p1.x;
//     var dy = p2.y - p1.y;
//     return Math.sqrt(dx^2 + dy^2);
// }

// function Particle() {
//     this.size = 3 + Math.random()*4;
//     this.position = {x: 0, y: 0};
//     this.shift = {x: 0, y: 0};
//     this.angle = 0;
//     this.speed = 0.001 + Math.random()*0.002;
//     this.force = -(Math.random()*10);
//     this.orbit = 1;
// }

// function Cursor() {
//     this.orbit = 100;
//     this.position = {x: 0, y: 0};
// }

// MeteorRain.init();


////////////////////////

(function() {
     var width, height, canvas, ctx, target, cursor, pattern
     var particles = [];

     // Main
    initStars();
    initAnimation();
    eventListeners();

    function initStars() {
        width = window.innerWidth;
        height = window.innerHeight;
        target = {x: width/2, y: height/2};

        canvas = document.getElementById('canvas');
        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext('2d');

        ctx.globalAlpha = 0.8

        image = new Image();
        function drawPattern() {
            pattern = ctx.createPattern(image, "repeat");
        }
        image.src = "images/water.gif";
        image.onload = drawPattern;

        // create particles
        for(var x = 0; x < width; x = x + width/15) {
            for(var y = 0; y < height; y = y + height/15) {
                var px = x + Math.random()*width/15;
                var py = y + Math.random()*height/15;
                var p = {x: px, originX: px, y: py, originY: py };
                particles.push(p);
            }
        }

        // for each point find the 5 closest particles
        for(var i = 0; i < particles.length; i++) {
            var closest = [];
            var p1 = particles[i];
            for(var j = 0; j < particles.length; j++) {
                var p2 = particles[j]
                if(!(p1 == p2)) {
                    var placed = false;
                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(closest[k] == undefined) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }

                    for(var k = 0; k < 5; k++) {
                        if(!placed) {
                            if(getDistance(p1, p2) < getDistance(p1, closest[k])) {
                                closest[k] = p2;
                                placed = true;
                            }
                        }
                    }
                }
            }
            p1.closest = closest;
        }

        // assign a circle to each point
        for(var i in particles) {
            var c = new Circle(particles[i], 1+Math.random()*2, 'rgba(255,255,255,0.3)');
            particles[i].circle = c;
        }
    }

    function eventListeners() {
        if(!('ontouchstart' in window)) {
            window.addEventListener('mousemove', mouseMove);
        }
    }

    function mouseMove(e) {
        var posx = posy = 0;
        if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
        }
        else if (e.clientX || e.clientY)    {
            posx = e.clientX;
            posy = e.clientY;
        }
        target.x = posx;
        target.y = posy;
    }

    function windowResizeHandler() {
        canvas.width = width;
        canvas.height = height;

        canvas.style.position = 'absolute';

        canvas.style.left = (window.innerWidth - width) * 0.5 + 'px';
        canvas.style.top = (window.innerHeight - height) * 0.5 + 'px';
    }

    function initAnimation() {
        animate();
        for(var i in particles) {
            shiftParticle(particles[i]);
        }
    }

    function animate() {

        ctx.clearRect(0,0,width,height);
        for(var i in particles) {
            // detect particles in range
            if(Math.abs(getDistance(target, particles[i])) < 40000) {
                particles[i].active = 0.4;
                particles[i].circle.active = 0.6;
            } else if(Math.abs(getDistance(target, particles[i])) < 2000000) {
                particles[i].active = 0.1;
                particles[i].circle.active = 0.3;
            } else if(Math.abs(getDistance(target, particles[i])) < 5000) {
                particles[i].active = 0.8;
                particles[i].circle.active = 0.1;
            } else {
                particles[i].active = 0;
                particles[i].circle.active = 0;
            }


            drawLines(particles[i]);
            particles[i].circle.draw();
        }

        requestAnimationFrame(animate);
    }

    function shiftParticle(p) {
        TweenLite.to(p, 1+1*Math.random(), {x:p.originX-50+Math.random()*100,
            y: p.originY-50+Math.random()*100, ease:Circ.easeInOut,
            onComplete: function() {
                shiftParticle(p);
            }});
    }

    // Canvas manipulation
    function drawLines(p) {
        if(!p.active) return;
        for(var i in p.closest) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.closest[i].x, p.closest[i].y);
            ctx.strokeStyle = 'rgba(156,217,249,'+ 1.5*p.active+')';
            ctx.stroke();
        }
    }

    function Circle(pos,rad,color) {
        var _this = this;

        // constructor
        (function() {
            _this.pos = pos || null;
            _this.radius = rad || null;
            _this.color = color || null;
        })();

        this.draw = function() {
            if(!_this.active) return;
            ctx.beginPath();
            ctx.arc(_this.pos.x, _this.pos.y, _this.radius, 0, 2 * Math.PI, false);
            // ctx.fillStyle = 'rgba(156,217,249,'+ _this.active+')';
            ctx.fillStyle = pattern;
            ctx.fill();
        };
    }

    // Util
    function getDistance(p1, p2) {
        return Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2);
    }

})();

//////////////////////////