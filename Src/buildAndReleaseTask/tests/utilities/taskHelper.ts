import * as assert from 'assert';
import { TaskHelper } from "../../utilities/taskHelper";

//_________________________________________________________________________________

describe('utilities / taskHelper / isURLValid', function () {
    it('should succeed with valid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Sample/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');
        isValidURL = taskHelper.isURLValid("https://profilesticker.net/sitemap.xml");
        assert.equal(isValidURL, true, 'should have succeeded');

        done();
    });    

    it('should fail with invalid URLs', function(done: MochaDone) {
        this.timeout(1000);    
        const taskHelper = new TaskHelper();

        var isValidURL = taskHelper.isURLValid("https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/");
        assert.equal(isValidURL, false, 'should have succeeded');
        isValidURL = taskHelper.isURLValid("https://profilesticker.net/sitemap.txt");
        assert.equal(isValidURL, false, 'should have succeeded');

        done();
    });  
});