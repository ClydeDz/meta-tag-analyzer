import { Worksheet } from "exceljs";
import { MetadataTagsIncluded } from "../constants/appConstants";

export class ExcelHelper {  

    addExcelHeader(workingSheet: Worksheet, allMetaTags: MetadataTagsIncluded[]): Worksheet {
        let cellA1 = workingSheet.getRow(1).getCell(1);
        cellA1.value = "URL";
        cellA1.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFFFF00'} 
        };
        cellA1.font = {
            bold: true
        };

        for (var si = 0; si < allMetaTags.length; si++){
            let cell =  workingSheet.getRow(1).getCell(allMetaTags[si].columnPosition);
            cell.value = allMetaTags[si].displayText;
            cell.fill = {
                type: 'pattern',
                pattern:'solid',
                fgColor:{argb:'FFFFFF00'}
            };
            cell.font = {
                bold: true
            };
        } 
        return workingSheet;
    }
    
    addExcelFooter(workingSheet: Worksheet, row: number): Worksheet {
        // Legend
        workingSheet.getRow(++row).getCell(1).value = "Legend:";
        let legendCell1 = workingSheet.getRow(++row).getCell(1);
        legendCell1.value = "Over ideal limit";
        legendCell1.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFF8C00'}
        };
        let legendCell2 = workingSheet.getRow(row).getCell(2);
        legendCell2.value = "No data when required";
        legendCell2.fill = {
            type: 'pattern',
            pattern:'solid',
            fgColor:{argb:'FFFF6347'}
        }; 
        workingSheet.getRow(++row).getCell(1).value = "Blank cells mean the tag wasn't found on a page";
        ++row;

        // Meta
        workingSheet.getRow(++row).getCell(1).value = "Report generated on: ";
        workingSheet.getRow(row).getCell(2).value = "" + new Date();
        workingSheet.getRow(++row).getCell(1).value = "Meta Tag Analyzer (c) 2019 Clyde D'Souza";
        workingSheet.getRow(row).getCell(2).value = "www.clydedsouza.net";
        return workingSheet;
    }

    addExcelCellContent(workingSheet: Worksheet, row: number, column: number, content: any): Worksheet{
        workingSheet.getRow(row).getCell(column).value = content;
        return workingSheet;
    }
}