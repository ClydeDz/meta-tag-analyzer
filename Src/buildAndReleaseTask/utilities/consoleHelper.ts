export class ConsoleHelper {
    /**
     * Prints supplied URL on the console
     * @param url URL to be printed
     */  
    printPageURL(url: string){
        console.log("");
        console.log("----------------------------------");
        console.log("URL:", url);
        console.log("----------------------------------");
    }

    /**
     * Prints the supplied sitemap URL on the console
     * @param url URL of the sitemap file
     */
    printSitemapFileURL(url: string){
        console.log("");
        console.log("==================================================");
        console.log('Sitemap file:', url);
        console.log("==================================================");
    }

    /**
     * Prints a copyright message on the console
     */
    printConsoleCopyright(){
        console.log(); 
        console.log("Meta Tag Analyzer (c) 2019 Clyde D'Souza"); 
        console.log(); 
    } 
}