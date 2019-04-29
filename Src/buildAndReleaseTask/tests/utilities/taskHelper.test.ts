import * as assert from 'assert';
import { TaskHelper } from "../../utilities/taskHelper";
import { AppConstants } from '../../constants/appConstants';

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
    it('should return transformed filename when filename is null or empty', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();

        var transformedFilename = taskHelper.getTransformedInvalidOutputFilename("");
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        transformedFilename = taskHelper.getTransformedInvalidOutputFilename(null);
        assert.equal(transformedFilename, "<input was left blank>", 'should be <input was left blank>');
        done();
    });  
    it('should return transformed filename when a valid filename is passed', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();

        var transformedFilename = taskHelper.getTransformedInvalidOutputFilename("meta report");
        assert.equal(transformedFilename, "meta report", 'should be meta report');
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskHelper / getMetadataTagPosition', function () {
    it('should succeed with valid tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var position = taskHelper.getMetadataTagPosition("title-tag", metatags);
        assert.equal(position, 2, 'should be 2'); 
        position = taskHelper.getMetadataTagPosition("description", metatags);
        assert.equal(position, 4, 'should be 4'); 
        done();
    });   
    it('should return 0 for invalid tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var position = taskHelper.getMetadataTagPosition("script", metatags);
        assert.equal(position, 0, 'should be 0');
        position = taskHelper.getMetadataTagPosition("", metatags);
        assert.equal(position, 0, 'should be 0');
        done();
    });    
});

//_________________________________________________________________________________

describe('utilities / taskHelper / isKeyUnderNameAttrCategory', function () {
    it('should true for name-attribute tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskHelper.isKeyUnderNameAttrCategory("title", metatags);
        assert.equal(actual, true, 'should be true'); 
        actual = taskHelper.isKeyUnderNameAttrCategory("twitter:creator", metatags);
        assert.equal(actual, true, 'should be true'); 
        done();
    });   
    it('should return false for non name-attribute tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskHelper.isKeyUnderNameAttrCategory("script", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskHelper.isKeyUnderNameAttrCategory("", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskHelper.isKeyUnderNameAttrCategory("og:title", metatags);
        assert.equal(actual, false, 'should be 0'); 
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskHelper / isKeyUnderPropertyAttrCategory', function () {
    it('should true for name-attribute tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskHelper.isKeyUnderPropertyAttrCategory("og:description", metatags);
        assert.equal(actual, true, 'should be true'); 
        actual = taskHelper.isKeyUnderPropertyAttrCategory("fb:app_id", metatags);
        assert.equal(actual, true, 'should be true'); 
        done();
    });   
    it('should return false for non name-attribute tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper();
        const appConstants = new AppConstants();
        const metatags = appConstants.getMetadataTagsIncluded();

        var actual = taskHelper.isKeyUnderPropertyAttrCategory("Keywords", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskHelper.isKeyUnderPropertyAttrCategory("", metatags);
        assert.equal(actual, false, 'should be 0');
        actual = taskHelper.isKeyUnderPropertyAttrCategory("twitter:site", metatags);
        assert.equal(actual, false, 'should be 0'); 
        done();
    });    
});


//_________________________________________________________________________________

describe('utilities / taskHelper / getMaxLengthOfMetatag', function () {
    it('should return correct length for meta tags', function(done: MochaDone) {   
        const taskHelper = new TaskHelper(); 

        var maxLength = taskHelper.getMaxLengthOfMetatag("h1");
        assert.equal(maxLength, 70, 'should be 70'); 
        maxLength = taskHelper.getMaxLengthOfMetatag("og:title");
        assert.equal(maxLength, 60, 'should be 60'); 
        maxLength = taskHelper.getMaxLengthOfMetatag("og:description");
        assert.equal(maxLength, 300, 'should be 300');
        done();
    });   
    it('should return 0 for meta tags not requiring a length check or invalid input', function(done: MochaDone) {   
        const taskHelper = new TaskHelper(); 

        var maxLength = taskHelper.getMaxLengthOfMetatag("");
        assert.equal(maxLength, 0, 'should be 0');
        maxLength = taskHelper.getMaxLengthOfMetatag("twitter:site");
        assert.equal(maxLength, 0, 'should be 0'); 
        maxLength = taskHelper.getMaxLengthOfMetatag("fb:app_id");
        assert.equal(maxLength, 0, 'should be 0'); 
        done();
    });    
});