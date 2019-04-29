import * as assert from 'assert';
import { TaskHelper } from "../../utilities/taskHelper";

//_________________________________________________________________________________

describe('utilities / taskHelper / isSitemapURLValid', function () {
    it('should succeed with valid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isSitemapURLValid("https://profilesticker.net/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');

        done();
    });    

    it('should fail with invalid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isSitemapURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isSitemapURLValid("https://profilesticker.net/sitemap.txt");
        assert.equal(isValidURL, false, 'should have succeeded');

        done();
    });  
});


//_________________________________________________________________________________

describe('utilities / taskHelper / isPageURLValid', function () {
    it('should succeed with valid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isPageURLValid("https://profilesticker.net/about");
        assert.equal(isValidURL, true, 'should have succeeded');

        done();
    });    

    it('should fail with invalid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isPageURLValid("https://clydedz.github.io/sass-snippet-pack/content.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isPageURLValid("https://profilesticker.net/dummy.pdf");
        assert.equal(isValidURL, false, 'should have succeeded');

        done();
    });  
});


//_________________________________________________________________________________

describe('utilities / taskHelper / isOutputFilenameValid', function () {
    it('should succeed with valid filename', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidFilename = taskHelper.isOutputFilenameValid("meta-report");
        assert.equal(isValidFilename, true, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("meta report post release pipeline");
        assert.equal(isValidFilename, true, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("MetaTagReport-DemoBuild-20190429.2");
        assert.equal(isValidFilename, true, 'should have succeeded');
        done();
    });    

    it('should fail with invalid filename', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidFilename = taskHelper.isOutputFilenameValid("");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("report.xlsx");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("report.xlsx.latestreport");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("report.xls");
        assert.equal(isValidFilename, false, 'should have succeeded');
        isValidFilename = taskHelper.isOutputFilenameValid("report.xls.latestreport");
        assert.equal(isValidFilename, false, 'should have succeeded');
        done();
    });  
});

//_________________________________________________________________________________

describe('utilities / taskHelper / getTransformedInvalidOutputFilename', function () {
    it('should succeed with valid filename', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();

        var transformedFilename = taskHelper.getTransformedInvalidOutputFilename("");
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        transformedFilename = taskHelper.getTransformedInvalidOutputFilename(null);
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        transformedFilename = taskHelper.getTransformedInvalidOutputFilename("meta report");
        assert.equal(transformedFilename, "meta report", 'should be meta report');
        done();
    });    
});