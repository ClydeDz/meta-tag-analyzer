"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const taskHelper_1 = require("../../utilities/taskHelper");
//_________________________________________________________________________________
describe('utilities / taskHelper / isSitemapURLValid', function () {
    it('should succeed with valid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isSitemapURLValid("https://profilesticker.net/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        done();
    });
    it('should fail with invalid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isSitemapURLValid("https://profilesticker.net/sitemap.txt");
        assert.equal(isValidURL, false, 'should have succeeded');
        done();
    });
});
//_________________________________________________________________________________
describe('utilities / taskHelper / isPageURLValid', function () {
    it('should succeed with valid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isPageURLValid("https://profilesticker.net/about");
        assert.equal(isValidURL, true, 'should have succeeded');
        done();
    });
    it('should fail with invalid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/content.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isPageURLValid("https://profilesticker.net/dummy.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');
        done();
    });
});
//_________________________________________________________________________________
describe('utilities / taskHelper / isOutputFilenameValid', function () {
    it('should succeed with valid filename', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidFilename = taskHelper.isOutputFilenameValid("meta-report");
        assert.equal(isValidFilename, true, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("meta report post release pipeline");
        assert.equal(isValidFilename, true, 'should have succeeded');
        done();
    });
    it('should fail with invalid filename', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidFilename = taskHelper.isOutputFilenameValid("");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("report.xlsx");
        assert.equal(isValidFilename, false, 'should have succeeded');
        done();
    });
});
