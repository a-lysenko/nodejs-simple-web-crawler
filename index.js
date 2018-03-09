const bunyan = require('bunyan');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const cssQuery = 'div[id="success"] button[class*="btn-primary"]';

const logger = bunyan.createLogger({ name: "myapp" });

const basicElemId = 'a[id="make-everything-ok-button"]';

const xpath = require('./services/xpath.service');

let button;

try {
    const sampleFile = fs.readFileSync('./pages/origin/sample-0-origin.html');
    const dom = new JSDOM(sampleFile);

    button = dom.window.document.querySelector(basicElemId);
    logger.info(`#########: ${xpath("button")}`);

    logger.info(`Successfully found element. Element Text: ${button.textContent.trim()}`);
    logger.info(`Successfully found element. Parent: ${button.parentElement}`);
    logger.info(`Successfully found element. xpath(button): ${xpath(button)}`);
    logger.info(`Successfully found element. xpath(button.parentElement): ${xpath(button.parentElement)}`);

    const array = Array.prototype.slice.apply(button.attributes);
    logger.info(array.map(attr => `${attr.name} = ${attr.value}`).join(', '));
} catch (err) {
    logger.error('Error trying to find element by css selector', err);
}

const crowlerService = require('./services/crowler.service'); // mock
const sampleData = crowlerService.retrieveSampleData(button); // no need to pass dom until distance is not analyzed

const relevanceMapService = require('./services/relevanceMap.service');
const relevanceMap = relevanceMapService.getMap();

const subjectFile = fs.readFileSync('./pages/other/sample-4-the-mash.html');
// const subjectFile = fs.readFileSync('./pages/other/sample-3-the-escape.html');
// const subjectFile = fs.readFileSync('./pages/other/sample-2-container-and-clone.html');
// const subjectFile = fs.readFileSync('./pages/other/sample-1-evil-gemini.html');
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
