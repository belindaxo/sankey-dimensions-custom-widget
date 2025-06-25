export function processSankeyData(data, dimensions, measures) {
    const linksMap = new Map();
    const nodesSet = new Set();
    const weightKey = measures[0]?.key; 

    data.forEach(row => {
        const path = dimensions.map(dim => row[dim.key]?.id || "Unknown");

        for (let i = 0; i < path.length - 1; i++) {
            const from = path[i];
            const to = path[i + 1];
            const weight = row[weightKey]?.raw ?? 0;

            if (!from || !to || isNaN(weight)) {
                continue; // Skip invalid paths
            }

            const key = `${from}-${to}`;
            const existing = linksMap.get(key);

            if (existing) {
                existing.weight += weight;
            } else {
                linksMap.set(key, { from, to, weight });
            }

            const nodes = Array.from(nodesSet).map(name => ({id: name, name }));
            const links = Array.from(linksMap.values());

            return { nodes, links };
        }
    })
}