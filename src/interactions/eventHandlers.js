/**
 * Event handler for point click events.
 * @param {Object} event - The event object containing the click event.
 * @param {Object} dataBinding - The data binding object containing the data.
 * @param {Array} dimensions - Array of dimension objects.
 * @param {Object} widget - Reference to the widget ('this', in context).
 */
export function handlePointClick(event, dataBinding, dimensions, widget) {
    const point = event.target;
    console.log('Point clicked:', point);
    if (!point) {
        console.error('Point is undefined');
        return;
    }

    const [toKey, toLabelRaw] = point.to.split('::');
    const [fromKey, fromLabelRaw] = point.from.split('::');

    const fromLabel = fromLabelRaw;
    const toLabel = toLabelRaw;
    console.log('toLabel:', toLabel);
    console.log('fromLabel:', fromLabel);

    const fromDimIndex = dimensions.findIndex(d => d.key === fromKey);
    const toDimIndex = dimensions.findIndex(d => d.key === toKey);
    if (fromDimIndex === -1 || toDimIndex === -1) {
        console.log('Could not resolve dimension metadata for link');
        return;
    }
    console.log('fromDimIndex:', fromDimIndex);
    console.log('toDimIndex:', toDimIndex);

    const fromDim = dimensions[fromDimIndex];
    const toDim = dimensions[toDimIndex];
    console.log('fromDim:', fromDim);
    console.log('toDim:', toDim);

    const row = dataBinding.data.find(r => 
    (r[fromKey]?.label).trim() === fromLabel &&
    (r[toKey]?.label).trim() === toLabel
    );
    if (!row) {
        console.log('Row not found for the selected point');
        return;
    }
    console.log('Row:', row);

    const selection = {};

    for (let i = 0; i <= fromDimIndex; i++) {
        const dim = dimensions[i];
        selection[dim.id] = row[dim.key].id;
    }

    selection[toDim.id] = row[toKey].id;


    const linkedAnalysis = widget.dataBindings.getDataBinding('dataBinding').getLinkedAnalysis();

    if (widget._selectedPoint && widget._selectedPoint !== point) {
        linkedAnalysis.removeFilters();
        widget._selectedPoint.select(false, false);
        widget._selectedPoint = null;
    }

    if (event.type === 'select') {
        linkedAnalysis.setFilters(selection);
        widget._selectedPoint = point;
    } else if (event.type === 'unselect') {
        linkedAnalysis.removeFilters();
        widget._selectedPoint = null;
    }
}
