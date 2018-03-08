const relevanceMapService = require('./relevanceMap.service');

const selectedRelevantPropertyToAttrNameMap = {
    idAttr: 'id',
    onclickAttr: 'onclick',
    hrefAttr: 'href'
};

module.exports = {
    retrieveSampleData(sampleElement) {
        const initialSampleAttrData = {
            idAttr: null,
            onclickAttr: null,
            hrefAttr: null
        };

        const elementAttributes = Array.prototype.slice.apply(sampleElement.attributes);
        const sampleAttrData = elementAttributes.reduce((attrData, attr) => {
            switch (attr.name) {
                case 'id': {
                    return Object.assign({}, attrData, {idAttr: attr.value})
                }
                case 'onclick': {
                    return Object.assign({}, attrData, {onclickAttr: attr.value})
                }
                case 'href': {
                    return Object.assign({}, attrData, {hrefAttr: attr.value})
                }

                default:
                    return attrData;
            }
        }, initialSampleAttrData);

        return Object.assign(sampleAttrData, {
            textContent: sampleElement.textContent.trim(),

            // it is out of relevance
            tagName: sampleElement.tagName
        });
    },

    getTargetItems(subjectDom, sampleData, relevanceMap) {
        const consequentFilters = relevanceMapService.buildConsequentFilters(relevanceMap, sampleData);

        const tagName = sampleData.tagName.toLowerCase();
        const preFilteredElements = filterAvailable(subjectDom.window, subjectDom.window.document.querySelectorAll(tagName));

        // {items, verifiedFilters}
        if (preFilteredElements.length) {
            const result = filterTargetItem(preFilteredElements, consequentFilters, 0, []);
            console.log('Most relevant filter', result.verifiedFilters.join('-'));
            return result.elements;
        } else {
            return null;
        }
    }
};

function filterTargetItem(elements, consequentFilters, currentFilterIndex = 0, verifiedFilters = []) {
    if (currentFilterIndex >= consequentFilters.length) {
        return {
            elements,
            verifiedFilters
        };
    }

    const filterItem = consequentFilters[currentFilterIndex];


    let filteredElements = elements.filter((element) => {
        if (Object.keys(selectedRelevantPropertyToAttrNameMap).includes(filterItem.name)
            && filterItem.value !== null) {
            const filterAttrName = selectedRelevantPropertyToAttrNameMap[filterItem.name];

            const elementAttributesArr = Array.prototype.slice.apply(element.attributes);
            const successAttributeIndex = elementAttributesArr.findIndex((elementAttribute) => {
                return elementAttribute.name.toLowerCase() === filterAttrName.toLowerCase()
                    && elementAttribute.value === filterItem.value;
            });

            return !!~successAttributeIndex;
        }

        if (filterItem.name === 'textContent') {
            return element.textContent.trim().toLowerCase() === filterItem.value.toLowerCase();
        }

        // not sure we need this
        return false;
    });

    verifiedFilters = verifiedFilters.slice();
    if (filteredElements.length) {
        verifiedFilters[currentFilterIndex] = 1;
    } else {
        verifiedFilters[currentFilterIndex] = 0;

        filteredElements = elements;
    }

    return filterTargetItem(filteredElements, consequentFilters, currentFilterIndex + 1, verifiedFilters);
}

function filterAvailable(domWindow, domElements) {
    const displayOfUnavailable = 'none';

    return Array.prototype.slice.apply(domElements)
        .filter((domElement) => {
            const domElementDisplay = domWindow.getComputedStyle(domElement).display;
            return domElementDisplay !== displayOfUnavailable;
        })
}