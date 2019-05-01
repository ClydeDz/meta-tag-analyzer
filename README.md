# Meta Tag Analyzer
An Azure DevOps task that generates a report after analysing the meta tags of each page on your website. Install this extension from the [Visual Studio Marketplace](http://bit.ly/metataganalyzer).   

[![Build status](https://clydedsouza.visualstudio.com/Meta%20Tag%20Analyzer/_apis/build/status/Master%20build)](https://clydedsouza.visualstudio.com/Meta%20Tag%20Analyzer/_build/latest?definitionId=21)
[![Visual Studio Marketplace Installs - Azure DevOps Extension](https://img.shields.io/visual-studio-marketplace/azure-devops/installs/total/clydedsouza.meta-tag-analyzer.svg?color=brightgreen)](https://marketplace.visualstudio.com/items?itemName=clydedsouza.meta-tag-analyzer)
![GitHub](https://img.shields.io/github/license/ClydeDz/meta-tag-analyzer.svg)      

## What is Meta Tag Analyzer?
**Preface:** We all agree how important meta tags are to our website. It helps describe the contents of a page and thereby providing more useful information for search engines to display. You can also dictate what information is shown when you share a page from your website on social media.   

**Meta Tag Analyzer** is an Azure DevOps task that provides you with the ability to automatically run a check on your website and generate a report of the meta tag information. Benefits:
- **Assurance:** Ensure that your last release hasn't changed anything unexpectedly that will be impact your online presence   
- **Automatic and part of your value stream:** Don't neglect the significance of meta tag content by checking this on a one-off basis. Include this as part of your pipeline and part of each release artifact.
- **Comprehensive and easy to read:** Simply download this report and email it to the team that looks after your online presence. 

Meta Tag Analyzer Azure DevOps task will:   
- Generate an Excel report after analysing the meta tags of all your pages ([Download sample report](https://github.com/ClydeDz/meta-tag-analyzer/blob/master/Sample/meta-tag-analyzer-report.xlsx)).
- Log the analysis to the console too, so you get the same information from within the pipeline itself.     
 
## Usage
### Installing   
Install Meta Tag Analyzer extension for your Azure DevOps pipeline from [this page](http://bit.ly/metataganalyzer). Refer to Microsoft's [documentation page](https://docs.microsoft.com/en-us/azure/devops/marketplace/install-extension?view=azure-devops&viewFallbackFrom=tfs-2015) if you need help installing an extension, in general.  

### Adding the task   
Next, in your build or release task, click on *Add a new task* and search for *Meta Tag Analyzer*. Click on *Add*.

 ![Picture of Meta Tag Analyzer task showing up in the list when adding a new task to your pipeline](https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Screenshots/add-task.png) 

### Configuring inputs   
| Inputs             | Required (Y/N)  | Explanation  |
| ------------------ | --------------- | ------------ |
| Sitemap URL        | Y               | URL to the sitemap file of your website. Your sitemap file *must* follow [this pattern](https://www.sitemaps.org/protocol.html).  |
| Output filename    | N               | Customize the name of the Excel report generated by this task. Only include the file name and not the file extension. If left blank, default report name will be `meta-tag-analyzer-report.xlsx`. You can also use a variable to generate the report name. Example: `MetaTagReport-$(Build.BuildNumber)` appends the build number to the filename. |
   
 ![Picture of a demo build pipeline that uses Meta Tag Analyzer](https://raw.githubusercontent.com/ClydeDz/meta-tag-analyzer/master/Screenshots/run-copy-drop.png)       

### Additional notes
#### Downloading the report
This task generate the report in the working directory but doesn't copy the file to the drop location. If you'd like the file to be included in the artifacts, ensure you explicitly include it. [Read more](https://github.com/ClydeDz/meta-tag-analyzer/wiki#usage) for ideas around this.   

#### What about adding it to the release definition?
Since you cannot publish artifacts from your release definition, ensure you either:
- Upload the generated report to an external file server, storage account or a web app's folder, or;   
- Trigger a *'post release'* build from the release pipeline.  
[Read more](https://github.com/ClydeDz/meta-tag-analyzer/wiki#usage) for ideas around this.  

## Credits  
Meta Tag Analyzer (c) 2019 [Clyde D'Souza](https://clydedsouza.net)  

## Release notes   
Refer to the detailed release notes found [here](https://github.com/ClydeDz/meta-tag-analyzer/releases)