import * as path from "path";
import * as assert from "assert";
import * as ttm from "azure-pipelines-task-lib/mock-test";

describe("index / run", function (): void {

    it("should succeed with simple inputs", function (done: Mocha.Done): void {
        this.timeout(150000);
        const mockRunnerPath: string = path.join(__dirname, "mockRunners/success.js");
        const mockTestRunner: ttm.MockTestRunner = new ttm.MockTestRunner(mockRunnerPath);
        mockTestRunner.run(10);
        assert.strictEqual(mockTestRunner.succeeded, true, "should have succeeded");
        assert.strictEqual(mockTestRunner.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(mockTestRunner.errorIssues.length, 0, "should have no errors");
        assert.strictEqual(mockTestRunner.stdout.indexOf("Execution time") >= 0, true, "should display Execution time");
        done();
    });

    it("should fail with no sitemap input", function (done: Mocha.Done): void {
        this.timeout(15000);
        const mockRunnerPath: string = path.join(__dirname, "mockRunners/noSitemapFailure.js");
        const mockTestRunner: ttm.MockTestRunner = new ttm.MockTestRunner(mockRunnerPath);
        mockTestRunner.run(10);
        assert.strictEqual(mockTestRunner.succeeded, false, "should have failed");
        assert.strictEqual(mockTestRunner.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(mockTestRunner.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(mockTestRunner.errorIssues[0], "Input required: sitemapURL", "error issue output");
        done();
    });

    it("should fail with an invalid sitemap file input", function (done: Mocha.Done): void {
        this.timeout(15000);
        const mockRunnerPath: string = path.join(__dirname, "mockRunners/invalidSitemapFailure.js");
        const mockTestRunner: ttm.MockTestRunner = new ttm.MockTestRunner(mockRunnerPath);
        mockTestRunner.run(10);
        assert.strictEqual(mockTestRunner.succeeded, false, "should have failed");
        assert.strictEqual(mockTestRunner.warningIssues.length, 0, "should have no warnings");
        assert.strictEqual(mockTestRunner.errorIssues.length, 1, "should have 1 error issue");
        assert.strictEqual(mockTestRunner.errorIssues[0], "Invalid sitemap URL detected", "error issue output");
        done();
    });
});