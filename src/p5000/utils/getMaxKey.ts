function getMaxKey(map: Map<number, any>): number | undefined {
    if (map.size === 0) {
        return undefined; // Return undefined if the map is empty
    }

    let maxKey: number | undefined = undefined;

    for (const key of map.keys()) {
        if (maxKey === undefined || key > maxKey) {
            maxKey = key;
        }
    }

    return maxKey;
}

export {
    getMaxKey,
}