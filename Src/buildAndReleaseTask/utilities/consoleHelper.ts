export class ConsoleHelper {  
    printPageURL(url: string){
        console.log("");
        console.log("----------------------------------");
        console.log("URL:", url);
        console.log("----------------------------------");
    }

    printSitemapFileURL(url: string){
        console.log("");
        console.log("==================================================");
        console.log('Sitemap file:', url);
        console.log("==================================================");
    }

    printConsoleCopyright(){
        console.log(); 
        console.log("Meta Tag Analyzer (c) 2019 Clyde D'Souza"); 
        console.log(); 
    } 
}