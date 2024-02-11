/**
 * Linearly interpolates between two values.
 * @param {number} A - The start value.
 * @param {number} B - The end value.
 * @param {number} t - The interpolation factor.
 * @returns {number} The interpolated value.
 */
function lerp(A, B, t) {
    return A + (B - A) * t;
}

/**
 * Finds the intersection point of two line segments.
 * @param {Object} A - Start point of first line segment.
 * @param {Object} B - End point of first line segment.
 * @param {Object} C - Start point of second line segment.
 * @param {Object} D - End point of second line segment.
 * @returns {Object|null} The intersection point or null if no intersection.
 */
function getIntersection(A, B, C, D) { 
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
    
    if (bottom != 0) {
        const t = tTop / bottom;
        const u = uTop / bottom;
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: lerp(A.x, B.x, t),
                y: lerp(A.y, B.y, t),
                offset: t
            };
        }
    }

    return null;
}

/**
 * Checks if two polygons intersect.
 * @param {Array} poly1 - Array of points defining the first polygon.
 * @param {Array} poly2 - Array of points defining the second polygon.
 * @returns {boolean} True if polygons intersect, false otherwise.
 */
function polysIntersect(poly1, poly2) {
    for (let i = 0; i < poly1.length; i++) {
        for (let j = 0; j < poly2.length; j++) {
            const touch = getIntersection(
                poly1[i],
                poly1[(i + 1) % poly1.length],
                poly2[j],
                poly2[(j + 1) % poly2.length]
            );
            if (touch) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Generates an RGBA string based on a given value.
 * @param {number} value - The value to base the color on.
 * @returns {string} The RGBA string.
 */
function getRGBA(value) {
    const alpha = Math.abs(value);
    const R = value < 0 ? 0 : 255;
    const G = R;
    const B = value > 0 ? 0 : 255;
    return `rgba(${R},${G},${B},${alpha})`;
}
