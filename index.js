const bunyan = require('bunyan');
const fs = require('fs');
const { JSDOM } = require('jsdom');

const cheerio = require('cheerio');

const cssQuery = 'div[id="success"] button[class*="btn-primary"]';

const logger = bunyan.createLogger({ name: "myapp" });

const basicElemId = 'a[id="make-everything-ok-button"]';

function xpath(el) {
    if (typeof el == "string") return document.evaluate(el, document, null, 0, null)
    if (!el || el.nodeType != 1) return ''
    if (el.id) return "//*[@id='" + el.id + "']"
    var sames = [].filter.call(el.parentNode.children, function (x) { return x.tagName == el.tagName })
    return xpath(el.parentNode) + '/' + el.tagName.toLowerCase() + (sames.length > 1 ? '['+([].indexOf.call(sames, el)+1)+']' : '')
}

let button;

try {
    const sampleFile = fs.readFileSync('./pages/origin/sample-0-origin.html');
    const dom = new JSDOM(sampleFile);
    const $ = cheerio.load(sampleFile);

    button = dom.window.document.querySelector(basicElemId);
    logger.info(`Successfully found element. Element Text: ${button.textContent.trim()}`);
    logger.info(`Successfully found element. Parent: ${button.parentElement}`);
    logger.info(`Successfully found element. xpath(button): ${xpath(button)}`);
    logger.info(`Successfully found element. xpath(button.parentElement): ${xpath(button.parentElement)}`);

    // const buttonC = $(basicElemId);
    // logger.info(`Successfully found element. buttonC.text().trim(): ${buttonC.text().trim()}`);
    // logger.info(`Successfully found element. buttonC.parent(): ${buttonC.parent()}`);
    // logger.info(`Successfully found element. buttonC.parent().get(0): ${buttonC.parent().get(0)}`);
    // logger.info(`Successfully found element. buttonC.attr('onclick'): ${buttonC.attr('onclick')}`);

    // logger.info(`Successfully found element. buttonC[0].attributes: ${buttonC[0].attributes}`);
    // logger.info(`Successfully found element. xpath(buttonC.parent()): ${xpath(buttonC.parent())}`);

    // logger.info(`Successfully found element. Element Text: ${button.textContent}`);
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
