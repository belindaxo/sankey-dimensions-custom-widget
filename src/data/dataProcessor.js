export function processSankeyData(data, dimensions, measures) {
    if (!dimensions.length || !measures.length) {
        return { nodes: [], links: [] };
    }

    const weightKey = measures[0].key;
    const linksMap = new Map();
    const nodeMap = new Map(); // "id" -> { id, name }

    data.forEach(row => {
        const path = dimensions.map(dim => {
            const cell = row[dim.key] || {};
            const label = (cell.label ?? cell.id ?? '').trim() || '(Empty)';
            const id = `${dim.key}::${label}`;
            if (!nodeMap.has(id)) {
                nodeMap.set(id, { id, name: label });
            }
            return id;
        });

        const weight = row[weightKey]?.raw ?? 0;
        if (!Number.isFinite(weight) || !weight) {
            return; // Skip invalid weights
        }

        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            if (!from || !to) continue;

            const key = `${from}->${to}`;
            const existing = linksMap.get(key);

            if (existing) {
                existing.weight += weight;
            } else {
                linksMap.set(key, { from, to, weight });
            }
        }
    });

    const nodes = Array.from(nodeMap.values());
    const links = Array.from(linksMap.values());

    return { nodes, links };
}