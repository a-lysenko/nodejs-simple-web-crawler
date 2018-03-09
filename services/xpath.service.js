// copied from https://gist.github.com/iimos/e9e96f036a3c174d0bf4
// was modified: removed explicit handling "if (typeof el == "string") ..."
module.exports = function xpath(el) {
    if (!el || el.nodeType != 1) return '';
    if (el.id) return "//*[@id='" + el.id + "']";
    var sames = [].filter.call(el.parentNode.children, function (x) {
        return x.tagName == el.tagName
    });
    return xpath(el.parentNode) + '/' + el.tagName.toLowerCase() + (sames.length > 1 ? '[' + ([].indexOf.call(sames, el) + 1) + ']' : '')
};