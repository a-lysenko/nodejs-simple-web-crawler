const bunyan = require('bunyan');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const logger = bunyan.createLogger({ name: "myapp" });

const xpath = require('./services/xpath.service');
const crowlerService = require('./services/crowler.service');

const DEFAULT_ELEM_ID = 'make-everything-ok-button';

const {_: [originFilePath, subjectFilePath], id: elemId} = require('minimist')(process.argv.slice(2));

let wrongParams = false;

if (!originFilePath || !fs.existsSync(originFilePath)) {
    logger.error('Path to origin file is not given or file doesn\'t exist');
    wrongParams = true;
}

if (!subjectFilePath || !fs.existsSync(subjectFilePath)) {
    logger.error('Path to subject file is not given or file doesn\'t exist');
    wrongParams = true;
}

if (wrongParams) {
    process.exit(1);
}

let targetElement;

try {
    const sampleFile = fs.readFileSync(originFilePath);
    const dom = new JSDOM(sampleFile);

    targetElement = dom.window.document.querySelector(`#${elemId || DEFAULT_ELEM_ID}`);

    if (targetElement) {
        logger.info(`Successfully found element. Element Text: ${targetElement.textContent.trim()}`);
    }

    const array = Array.prototype.slice.apply(targetElement.attributes);
    logger.info(array.map(attr => `${attr.name} = ${attr.value}`).join(', '));
} catch (err) {
    logger.error('Error trying to find element by css selector', err);
}

const sampleData = crowlerService.retrieveSampleData(targetElement); // no need to pass dom until distance is not analyzed

const relevanceMapService = require('./services/relevanceMap.service');
const relevanceMap = relevanceMapService.getMap();

const subjectFile = fs.readFileSync(subjectFilePath);
const subjectDom = new JSDOM(subjectFile);

const targetItems = crowlerService.getTargetItems(subjectDom, sampleData, relevanceMap);

if (!targetItems) {
    logger.info(`No user available element with tag name ${sampleData.tagName} was found! We are sorry!`);
    return;
}

if (targetItems.length) {
    if (targetItems.length > 1) {
        logger.info(`FOUND MORE THAN ONE TARGET ITEM`);
    }

    logger.info(targetItems.map((targetItem, targetItemIndex) => {
        return `Meet target element #${targetItemIndex + 1}! xpath: ${xpath(targetItem)}`;
    }).join('; '));
} else {
    logger.info('Target element is not found! We are sorry!');
}
