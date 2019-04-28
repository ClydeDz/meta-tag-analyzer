"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const assert = __importStar(require("assert"));
const ttm = __importStar(require("azure-pipelines-task-lib/mock-test"));
//_________________________________________________________________________________
describe('index / run', function () {
    it('should succeed with simple inputs', function (done) {
        this.timeout(150000);
        let tp = path.join(__dirname, 'success.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Execution time') >= 0, true, "should display Execution time");
        done();
    });
    it('it should fail with no sitemap input', function (done) {
        this.timeout(15000);
        let tp = path.join(__dirname, 'failure.js');
        let tr = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: sitemapURL', 'error issue output');
        done();
    });
});
