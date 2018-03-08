const map = {
    idAttr: 10000,
    textContent: 1000,
    onclickAttr: 100,
    hrefAttr: 10
};

module.exports = {
    getMap() {
        return Object.assign({}, map);
    },

    buildConsequentFilters(relevanceMap, sampleData) {
        return Object.keys(relevanceMap).map((key) => {
            return {
                name: key,
                value: sampleData[key] || null,
                power: map[key]
            };
        }).sort(({power: aPower}, {power: bPower}) => {
            return bPower - aPower;
        });
    }
};