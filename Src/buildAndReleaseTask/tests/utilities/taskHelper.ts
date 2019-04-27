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