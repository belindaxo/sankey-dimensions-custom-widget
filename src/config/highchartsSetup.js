import * as Highcharts from 'highcharts';

/**
 * Applies Highcharts global options
 */
export function applyHighchartsDefaults() {
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        },
        colors: ['#004b8d', '#939598', '#faa834', '#00aa7e', '#47a5dc', '#006ac7', '#ccced2', '#bf8028', '#00e4a7']
    });
}


/**
 * Override the default SVG shape for the Highcharts context button.
 */
export function overrideContextButtonSymbol() {
    Highcharts.SVGRenderer.prototype.symbols.contextButton = function (x, y, w, h) {
        const radius = w * 0.11;
        const spacing = w * 0.4;

        const offsetY = 2;    // moves dots slightly down
        const offsetX = 1;  // moves dots slightly to the right

        const centerY = y + h / 2 + offsetY;
        const startX = x + (w - spacing * 2) / 2 + offsetX;

        const makeCirclePath = (cx, cy, r) => [
            'M', cx - r, cy,
            'A', r, r, 0, 1, 0, cx + r, cy,
            'A', r, r, 0, 1, 0, cx - r, cy
        ];

        return [].concat(
            makeCirclePath(startX, centerY, radius),
            makeCirclePath(startX + spacing, centerY, radius),
            makeCirclePath(startX + spacing * 2, centerY, radius)
        );
    };
}
