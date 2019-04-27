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
describe('utilities / taskHelper / isURLValid', function () {
    it('should succeed with valid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isURLValid("https://profilesticker.net/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        done();
    });
    it('should fail with invalid URLs', function (done) {
        this.timeout(1000);
        const taskHelper = new taskHelper_1.TaskHelper();
        var isValidURL = taskHelper.isURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isURLValid("https://profilesticker.net/sitemap.txt");
        assert.equal(isValidURL, false, 'should have succeeded');
        done();
    });
});
