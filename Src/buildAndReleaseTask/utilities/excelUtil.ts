import { Cell, Worksheet } from "exceljs";
import { MetadataTagsIncluded, AppConstants } from "../constants/appConstants";

export class ExcelUtil {
    appConstants = new AppConstants();

    /**
     * Writes the first row of the report
     * @param workingSheet The current worksheet that the report is being written
     * @param allMetaTags The list of metatags included in the report
     */
    addExcelHeader(workingSheet: Worksheet, allMetaTags: MetadataTagsIncluded[]): Worksheet {
        const cellA1: Cell = workingSheet.getRow(1).getCell(1);
        cellA1.value = "URL";
        cellA1.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.appConstants.highlightCellColor }
        };
        cellA1.font = {
            bold: true
        };

        for (let si = 0; si < allMetaTags.length; si++) {
            const cell: Cell = workingSheet.getRow(1).getCell(allMetaTags[si].columnPosition);
            cell.value = allMetaTags[si].displayText;
            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: { argb: this.appConstants.highlightCellColor }
            };
            cell.font = {
                bold: true
            };
        }
        return workingSheet;
    }

    /**
     * Writes footer content to the Excel report
     * @param workingSheet The current worksheet that the report is being written
     * @param row The next row number
     */
    addExcelFooter(workingSheet: Worksheet, row: number): Worksheet {
        // legend
        workingSheet.getRow(++row).getCell(1).value = "Legend:";
        const legendCell1: Cell = workingSheet.getRow(++row).getCell(1);
        legendCell1.value = "Over ideal limit";
        legendCell1.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.appConstants.warningCellColor }
        };
        const legendCell2: Cell = workingSheet.getRow(row).getCell(2);
        legendCell2.value = "No data when required";
        legendCell2.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: this.appConstants.alertCellColor }
        };
        workingSheet.getRow(++row).getCell(1).value = "Blank cells mean the tag wasn't found on a page";
        ++row;

        // meta
        workingSheet.getRow(++row).getCell(1).value = "Report generated on: ";
        workingSheet.getRow(row).getCell(2).value = "" + new Date();
        workingSheet.getRow(++row).getCell(1).value = this.appConstants.copyrightText;
        workingSheet.getRow(row).getCell(2).value = "www.clydedsouza.net";
        return workingSheet;
    }

    /**
     * Add excel content into the working sheet.
     * @param workingSheet The current worksheet that the report is being written
     * @param row The row number of the cell to be written to
     * @param column The column number of the cell to be written to
     * @param content The content to be printed in the cell
     */
    addExcelCellContent(workingSheet: Worksheet, row: number, column: number, content: string | number): Worksheet {
        workingSheet.getRow(row).getCell(column).value = content;
        return workingSheet;
    }
}