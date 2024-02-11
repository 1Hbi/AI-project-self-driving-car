/**
 * Represents a sensor for detecting obstacles on the road.
 */
class Sensor {
    /**
     * Constructs a new Sensor instance.
     * @param {Car} car - The car to which the sensor is attached.
     */
    constructor(car) {
        this.car = car;               // Reference to the car object
        this.rayCount = 5;            // Number of rays emitted by the sensor
        this.rayLength = 150;         // Length of each ray
        this.raySpread = Math.PI / 2; // Spread angle of the rays (in radians)

        this.rays = [];               // Array to store ray endpoints
        this.readings = [];           // Array to store sensor readings
    }

    /**
     * Updates the sensor readings based on the current environment.
     * @param {Array<Array<{x: number, y: number}>>} roadBorders - Array of road borders represented as line segments.
     * @param {Array<Car>} traffic - Array of cars representing traffic on the road.
     */
    update(roadBorders, traffic) {
        this.#castRays();  // Emit rays from the sensor
        this.readings = []; // Clear previous readings

        // Iterate over each ray and calculate sensor readings
        for (let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders, traffic)
            );
        }
    }

    /**
     * Private method to calculate sensor reading for a single ray.
     * @param {Array<{x: number, y: number}>} ray - Array containing start and end points of the ray.
     * @param {Array<Array<{x: number, y: number}>>} roadBorders - Array of road borders represented as line segments.
     * @param {Array<Car>} traffic - Array of cars representing traffic on the road.
     * @returns {{x: number, y: number, offset: number} | null} - Intersection point with the nearest obstacle or null if no intersection.
     */
    #getReading(ray, roadBorders, traffic) {
        let touches = [];

        // Check for intersection with road borders
        for (let i = 0; i < roadBorders.length; i++) {
            const touch = getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]);
            if (touch) {
                touches.push(touch);
            }
        }

        // Check for intersection with other cars
        for (let i = 0; i < traffic.length; i++) {
            const poly = traffic[i].polygon;
            for (let j = 0; j < poly.length; j++) {
                const value = getIntersection(ray[0], ray[1], poly[j], poly[(j + 1) % poly.length]);
                if (value) {
                    touches.push(value);
                }
            }
        }

        // Return the intersection point with the nearest obstacle
        if (touches.length === 0) {
            return null;
        } else {
            const offsets = touches.map(e => e.offset);
            const minOffset = Math.min(...offsets);
            return touches.find(e => e.offset === minOffset);
        }
    }

    /**
     * Private method to emit rays from the sensor.
     */
    #castRays() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            // Calculate ray angle
            const rayAngle = lerp(
                this.raySpread / 2,
                -this.raySpread / 2,
                this.rayCount === 1 ? 0.5 : i / (this.rayCount - 1)
            ) + this.car.angle;

            // Calculate ray start and end points
            const start = { x: this.car.x, y: this.car.y };
            const end = {
                x: this.car.x - Math.sin(rayAngle) * this.rayLength,
                y: this.car.y - Math.cos(rayAngle) * this.rayLength
            };

            // Push the ray to the rays array
            this.rays.push([start, end]);
        }
    }

    /**
     * Draws the sensor rays on the canvas.
     * @param {CanvasRenderingContext2D} ctx - The 2D rendering context of the canvas.
     */
    draw(ctx) {
        for (let i = 0; i < this.rays.length; i++) {
            let end = this.rays[i][1];
            if (this.readings[i]) {
                end = this.readings[i];
            }

            // Draw the sensor rays
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();

            // Draw the connection between the sensor and the end point
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y);
            ctx.lineTo(end.x, end.y);
            ctx.stroke();
        }
    }
}
