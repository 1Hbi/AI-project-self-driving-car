/**
 * Represents a road with lanes.
 */
class Road {
    /**
     * Creates a new Road instance.
     * @param {number} x - The x-coordinate of the center of the road.
     * @param {number} width - The width of the road.
     * @param {number} [laneCount=3] - The number of lanes on the road.
     */
    constructor(x, width, laneCount = 3) {
        this.x = x;
        this.width = width;
        this.laneCount = laneCount;

        // Calculate the boundaries of the road
        this.left = x - width / 2;
        this.right = x + width / 2;
        const infinity = 1000000;
        this.top = -infinity;
        this.bottom = infinity;

        // Define the border lines of the road
        const topLeft = { x: this.left, y: this.top };
        const topRight = { x: this.right, y: this.top };
        const bottomLeft = { x: this.left, y: this.bottom };
        const bottomRight = { x: this.right, y: this.bottom };
        this.borders = [
            [topLeft, bottomLeft],
            [topRight, bottomRight]
        ];
    }

    /**
     * Calculates the x-coordinate of the center of a lane.
     * @param {number} laneIndex - The index of the lane.
     * @returns {number} The x-coordinate of the center of the lane.
     */
    getLaneCenter(laneIndex) {
        const laneWidth = this.width / this.laneCount;
        return this.left + laneWidth / 2 +
            Math.min(laneIndex, this.laneCount - 1) * laneWidth;
    }

    /**
     * Draws the road on a canvas context.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context.
     */
    draw(ctx) {
        ctx.lineWidth = 5;
        ctx.strokeStyle = "white";

        // Draw lane markings
        for (let i = 1; i <= this.laneCount - 1; i++) {
            const x = lerp(
                this.left,
                this.right,
                i / this.laneCount
            );

            ctx.setLineDash([20, 20]);
            ctx.beginPath();
            ctx.moveTo(x, this.top);
            ctx.lineTo(x, this.bottom);
            ctx.stroke();
        }

        // Draw road borders
        ctx.setLineDash([]);
        this.borders.forEach(border => {
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
    }
}
