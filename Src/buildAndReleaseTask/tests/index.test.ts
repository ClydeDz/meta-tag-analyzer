import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

//_________________________________________________________________________________

describe('index / run', function () {

    it('should succeed with simple inputs', function (done: MochaDone) {
        this.timeout(150000);
        let tp = path.join(__dirname, 'mockRunners/success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        assert.equal(tr.stdout.indexOf('Execution time') >= 0, true, "should display Execution time");
        done();
    });

    it('should fail with no sitemap input', function (done: MochaDone) {
        this.timeout(15000);
        let tp = path.join(__dirname, 'mockRunners/noSitemapFailure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Input required: sitemapURL', 'error issue output');
        done();
    });

    it('should fail with an invalid sitemap file input', function (done: MochaDone) {
        this.timeout(15000);
        let tp = path.join(__dirname, 'mockRunners/invalidSitemapFailure.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);
        tr.run();
        assert.equal(tr.succeeded, false, 'should have failed');
        assert.equal(tr.warningIssues, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
        assert.equal(tr.errorIssues[0], 'Invalid sitemap URL detected', 'error issue output');
        done();
    });
});