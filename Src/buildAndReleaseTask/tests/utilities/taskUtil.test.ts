import * as assert from "assert";
import { TaskUtil } from "../../utilities/taskUtil";
import { AppConstants, MetadataTagsIncluded } from "../../constants/appConstants"; 

describe("utilities / taskUtil / isSitemapURLValid", function (): void {
    it("should succeed with valid URLs", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidURL: boolean = taskUtil.isSitemapURLValid(
            "https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.strictEqual(isValidURL, true, "should have succeeded");
        isValidURL = taskUtil.isSitemapURLValid("https://profilesticker.net/sitemap.xml");
        assert.strictEqual(isValidURL, true, "should have succeeded");

        done();
    });

    it("should fail with invalid URLs", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidURL: boolean = taskUtil.isSitemapURLValid(
            "https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.strictEqual(isValidURL, false, "should have succeeded");
        isValidURL = taskUtil.isSitemapURLValid("https://profilesticker.net/sitemap.txt");
        assert.strictEqual(isValidURL, false, "should have succeeded");

        done();
    });
});

describe("utilities / taskUtil / isPageURLValid", function (): void {
    it("should succeed with valid URLs", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidURL: boolean = taskUtil.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/");
        assert.strictEqual(isValidURL, true, "should have succeeded");
        isValidURL = taskUtil.isPageURLValid("https://profilesticker.net/about");
        assert.strictEqual(isValidURL, true, "should have succeeded");

        done();
    });

    it("should fail with invalid URLs", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidURL: boolean = taskUtil.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/content.pdf");
        assert.strictEqual(isValidURL, false, "should have succeeded");
        isValidURL = taskUtil.isPageURLValid("https://profilesticker.net/dummy.pdf");
        assert.strictEqual(isValidURL, false, "should have succeeded");

        done();
    });
});

describe("utilities / taskUtil / isOutputFilenameValid", function (): void {
    it("should succeed with valid filename", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidFilename: boolean = taskUtil.isOutputFilenameValid("meta-report");
        assert.strictEqual(isValidFilename, true, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("meta report post release pipeline");
        assert.strictEqual(isValidFilename, true, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("MetaTagReport-DemoBuild-20190429.2");
        assert.strictEqual(isValidFilename, true, "should have succeeded");
        done();
    });

    it("should fail with invalid filename", function (done: Mocha.Done): void {
        this.timeout(1000);
        const taskUtil: TaskUtil = new TaskUtil();

        let isValidFilename: boolean = taskUtil.isOutputFilenameValid("");
        assert.strictEqual(isValidFilename, false, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("report.xlsx");
        assert.strictEqual(isValidFilename, false, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("report.xlsx.latestreport");
        assert.strictEqual(isValidFilename, false, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("report.xls");
        assert.strictEqual(isValidFilename, false, "should have succeeded");
        isValidFilename = taskUtil.isOutputFilenameValid("report.xls.latestreport");
        assert.strictEqual(isValidFilename, false, "should have succeeded");
        done();
    });
});

describe("utilities / taskUtil / getTransformedInvalidOutputFilename", function (): void {
    it("should return transformed filename when filename is null or empty", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();

        let transformedFilename: string = taskUtil.getTransformedInvalidOutputFilename("");
        assert.strictEqual(transformedFilename, "<input was left blank or was not defined>",
            "should be <input was left blank or was not defined>");
        transformedFilename = taskUtil.getTransformedInvalidOutputFilename(null);
        assert.strictEqual(transformedFilename, "<input was left blank or was not defined>",
            "should be <input was left blank or was not defined>");
        done();
    });
    it("should return transformed filename when a valid filename is passed", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();

        const transformedFilename: string = taskUtil.getTransformedInvalidOutputFilename("meta report");
        assert.strictEqual(transformedFilename, "meta report", "should be meta report");
        done();
    });
});

describe("utilities / taskUtil / getMetadataTagPosition", function (): void {
    it("should succeed with valid tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let position: number = taskUtil.getMetadataTagPosition("title-tag", metatags);
        assert.strictEqual(position, 2, "should be 2");
        position = taskUtil.getMetadataTagPosition("description", metatags);
        assert.strictEqual(position, 4, "should be 4");
        done();
    });
    it("should return 0 for invalid tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let position: number = taskUtil.getMetadataTagPosition("script", metatags);
        assert.strictEqual(position, 0, "should be 0");
        position = taskUtil.getMetadataTagPosition("", metatags);
        assert.strictEqual(position, 0, "should be 0");
        done();
    });
});

describe("utilities / taskUtil / isKeyUnderNameAttrCategory", function (): void {
    it("should true for name-attribute tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let actual: boolean = taskUtil.isKeyUnderNameAttrCategory("title", metatags);
        assert.strictEqual(actual, true, "should be true");
        actual = taskUtil.isKeyUnderNameAttrCategory("twitter:creator", metatags);
        assert.strictEqual(actual, true, "should be true");
        done();
    });
    it("should return false for non name-attribute tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let actual: boolean = taskUtil.isKeyUnderNameAttrCategory("script", metatags);
        assert.strictEqual(actual, false, "should be 0");
        actual = taskUtil.isKeyUnderNameAttrCategory("", metatags);
        assert.strictEqual(actual, false, "should be 0");
        actual = taskUtil.isKeyUnderNameAttrCategory("og:title", metatags);
        assert.strictEqual(actual, false, "should be 0");
        done();
    });
});

describe("utilities / taskUtil / isKeyUnderPropertyAttrCategory", function (): void {
    it("should true for name-attribute tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let actual: boolean = taskUtil.isKeyUnderPropertyAttrCategory("og:description", metatags);
        assert.strictEqual(actual, true, "should be true");
        actual = taskUtil.isKeyUnderPropertyAttrCategory("fb:app_id", metatags);
        assert.strictEqual(actual, true, "should be true");
        done();
    });
    it("should return false for non name-attribute tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();
        const appConstants: AppConstants = new AppConstants();
        const metatags: MetadataTagsIncluded[] = appConstants.getMetadataTagsIncluded();

        let actual: boolean = taskUtil.isKeyUnderPropertyAttrCategory("Keywords", metatags);
        assert.strictEqual(actual, false, "should be 0");
        actual = taskUtil.isKeyUnderPropertyAttrCategory("", metatags);
        assert.strictEqual(actual, false, "should be 0");
        actual = taskUtil.isKeyUnderPropertyAttrCategory("twitter:site", metatags);
        assert.strictEqual(actual, false, "should be 0");
        done();
    });
});

describe("utilities / taskUtil / getMaxLengthOfMetatag", function (): void {
    it("should return correct length for meta tags", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();

        let maxLength: number = taskUtil.getMaxLengthOfMetatag("h1");
        assert.strictEqual(maxLength, 70, "should be 70");
        maxLength = taskUtil.getMaxLengthOfMetatag("og:title");
        assert.strictEqual(maxLength, 60, "should be 60");
        maxLength = taskUtil.getMaxLengthOfMetatag("og:description");
        assert.strictEqual(maxLength, 300, "should be 300");
        done();
    });
    it("should return 0 for meta tags not requiring a length check or invalid input", function (done: Mocha.Done): void {
        const taskUtil: TaskUtil = new TaskUtil();

        let maxLength: number = taskUtil.getMaxLengthOfMetatag("");
        assert.strictEqual(maxLength, 0, "should be 0");
        maxLength = taskUtil.getMaxLengthOfMetatag("twitter:site");
        assert.strictEqual(maxLength, 0, "should be 0");
        maxLength = taskUtil.getMaxLengthOfMetatag("fb:app_id");
        assert.strictEqual(maxLength, 0, "should be 0");
        done();
    });
});