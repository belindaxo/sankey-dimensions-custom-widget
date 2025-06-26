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

    const label = point.toNode.name;

    let matchItem = null;
    let matchDim = null;

    for (const dim of dimensions) {
        const row = dataBinding.data.find(
            (item) => item[dim.key]?.label === label
        );
        if (row) {
            matchItem = row;
            matchDim = dim;
            break;
        }
    }
    console.log('Matched dimension:', matchDim);
    console.log('Matched item:', matchItem);

    if (!matchItem || !matchDim) {
        console.log('No matching item or dimension found with label:', label);
        return;
    }


    const linkedAnalysis = widget.dataBindings.getDataBinding('dataBinding').getLinkedAnalysis();

    if (widget._selectedPoint && widget._selectedPoint !== point) {
        linkedAnalysis.removeFilters();
        widget._selectedPoint.select(false, false);
        widget._selectedPoint = null;
    }

    if (event.type === 'select') {
        const selection = {};
        selection[matchDim.id] = matchItem[matchDim.key].id;
        console.log('Selection:', selection);
        console.log('selection[matchDim.id]:', selection[matchDim.id]);
        console.log('matchItem[matchDim.key].id', matchItem[matchDim.key].id);
        linkedAnalysis.setFilters(selection);
        widget._selectedPoint = point;
    } else if (event.type === 'unselect') {
        linkedAnalysis.removeFilters();
        widget._selectedPoint = null;
    }
}
