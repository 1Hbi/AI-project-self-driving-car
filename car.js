/**
 * Represents a car entity.
 */
class Car {
    /**
     * Creates a car instance.
     * @param {number} x - The x-coordinate of the car.
     * @param {number} y - The y-coordinate of the car.
     * @param {number} width - The width of the car.
     * @param {number} height - The height of the car.
     * @param {string} controlsType - The type of controls for the car ('AI', 'DUMMY', or any other value).
     * @param {number} maxspeed - The maximum speed of the car (default is 3).
     */
    constructor(x, y, width, height, controlsType, maxspeed = 3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed = 0;
        this.maxspeed = maxspeed;
        this.friction = 0.05;
        this.acceleration = 0.2;
        this.angle = 0;
        this.damaged = false;

        this.useBrain = controlsType == 'AI';

        if (controlsType != 'DUMMY') {
            this.sensor = new Sensor(this);
            this.brain = new NeuralNetwork([this.sensor.rayCount, 6, 4]);
        }
        this.controls = new Controls(controlsType);
    }

    /**
     * Updates the car's position and status based on the road borders and traffic.
     * @param {Array<Array<{x: number, y: number}>>} roadBorders - The borders of the road.
     * @param {Array<Car>} traffic - The array of traffic cars.
     */
    update(roadBorders, traffic) {
        if (!this.damaged) {
            this.#move();

            this.polygon = this.#createPolygon();
            this.damaged = this.#assessDamage(roadBorders, traffic);
        }
        if (this.sensor) {
            this.sensor.update(roadBorders, traffic);
            const offsets = this.sensor.readings.map(s => s == null ? 0 : 1 - s.offset);
            const outputs = NeuralNetwork.feedForward(offsets, this.brain);

            if (this.useBrain) {
                this.controls.forward = outputs[0];
                this.controls.left = outputs[1];
                this.controls.right = outputs[2];
                this.controls.reverse = outputs[3];
            }
        }
    }

    /**
     * Checks if the car is damaged by colliding with road borders or traffic.
     * @param {Array<Array<{x: number, y: number}>>} roadBorders - The borders of the road.
     * @param {Array<Car>} traffic - The array of traffic cars.
     * @returns {boolean} - True if the car is damaged, false otherwise.
     */
    #assessDamage(roadBorders, traffic) {
        for (let i = 0; i < roadBorders.length; i++) {
            if (polysIntersect(this.polygon, roadBorders[i])) {
                return true;
            }
        }
        for (let i = 0; i < traffic.length; i++) {
            if (polysIntersect(this.polygon, traffic[i].polygon)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Creates the polygon representing the car's shape.
     * @returns {Array<{x: number, y: number}>} - Array of points representing the car's polygon.
     */
    #createPolygon() {
        const points = [];
        const rad = Math.hypot(this.width, this.height) / 2;
        const alpha = Math.atan2(this.width, this.height);
        points.push({
            x: this.x - Math.sin(this.angle - alpha) * rad,
            y: this.y - Math.cos(this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(this.angle + alpha) * rad,
            y: this.y - Math.cos(this.angle + alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle - alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle - alpha) * rad
        });
        points.push({
            x: this.x - Math.sin(Math.PI + this.angle + alpha) * rad,
            y: this.y - Math.cos(Math.PI + this.angle + alpha) * rad
        });
        return points;
    }

    /**
     * Moves the car based on its speed, acceleration, and controls.
     */
    #move() {
        if (this.controls.forward) {
            this.speed += this.acceleration;
        }
        if (this.controls.reverse) {
            this.speed -= this.acceleration;
        }
        if (this.speed >= this.maxspeed) {
            this.speed = this.maxspeed;
        };
        if (this.speed < -this.maxspeed / 2) {
            this.speed = -this.maxspeed / 2;
        }
        if (this.speed < 0) {
            this.speed += this.friction;
        }
        if (this.speed > 0) {
            this.speed -= this.friction;
        }
        if (Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }
        if (this.speed != 0) {
            const flip = this.speed > 0 ? 1 : -1;
            if (this.controls.left) {
                this.angle += 0.013 * flip;
            }
            if (this.controls.right) {
                this.angle -= 0.013 * flip;
            }
        }
        this.x -= Math.sin(this.angle) * this.speed;
        this.y -= Math.cos(this.angle) * this.speed;
    }

    /**
     * Draws the car on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     * @param {string} color - The color of the car.
     * @param {boolean} drawSensor - Whether to draw the sensor of the car.
     */
    draw(ctx, color, drawSensor = false) {
        if (this.damaged) {
            ctx.fillStyle = "gray";
        } else {
            ctx.fillStyle = color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for (let i = 1; i < this.polygon.length; i++) {
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if (this.sensor && drawSensor == true) {
            this.sensor.draw(ctx);
        }
    }

}
