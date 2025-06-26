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

    const toDim = dimensions.find(dim => dim.key === toKey);
    const fromDim = dimensions.find(dim => dim.key === fromKey);

    console.log('toLabel:', toLabelRaw);
    console.log('fromLabel:', fromLabelRaw);
    console.log('toKey:', toKey);
    console.log('fromKey:', fromKey);
    console.log('toDim:', toDim);
    console.log('fromDim:', fromDim);

    if (!fromDim || !toDim) {
        console.log('Dimensions not found for keys:', toKey, fromKey);
        return;
    }

    const fromRow = dataBinding.data.find(row => (row[fromKey]?.label ?? '').trim() === fromLabel);
    const toRow = dataBinding.data.find(row => (row[toKey]?.label ?? '').trim() === toLabel);
    if (!fromRow || !toRow) {
        console.log('Rows not found for labels:', fromLabel, toLabel);
        return;
    }


    const linkedAnalysis = widget.dataBindings.getDataBinding('dataBinding').getLinkedAnalysis();

    if (widget._selectedPoint && widget._selectedPoint !== point) {
        linkedAnalysis.removeFilters();
        widget._selectedPoint.select(false, false);
        widget._selectedPoint = null;
    }

    if (event.type === 'select') {
        const selection = {
            [fromDim.id]: fromRow[fromKey].id,
            [toDim.id]: toRow[toKey].id
        }

        console.log('Selection:', selection);
        linkedAnalysis.setFilters(selection);
        widget._selectedPoint = point;
    } else if (event.type === 'unselect') {
        linkedAnalysis.removeFilters();
        widget._selectedPoint = null;
    }
}
