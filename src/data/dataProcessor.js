import { link } from "d3";

export function processSankeyData(data, dimensions, measures) {
    if (!dimensions.length || !measures.length) {
        return { nodes: [], links: [] };
    }

    const weightKey = measures[0].key;
    const linksMap = new Map(); // "from->to" -> { from, to, weight }
    const nodesSet = new Set(); // unique node names

    data.forEach(row => {
        const path = dimensions.map(dim => {
            const cell = row[dim.key] || {};
            return (cell.label ?? cell.id ?? '(Empty)').trim();
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

            nodesSet.add(from);
            nodesSet.add(to);
        }
    });

    const nodes = Array.from(nodesSet).map(name => ({ id: name, name }));
    const links = Array.from(linksMap.values());

    return { nodes, links };
}