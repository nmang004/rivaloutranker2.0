import ExcelJS from 'exceljs';
import { format } from 'date-fns';

/**
 * Audit Export Service
 * Handles exporting audit results to various formats (Excel, PDF, CSV)
 */
export class AuditExportService {

  /**
   * Export audit results in specified format
   */
  async exportAudit(audit: any, format: 'excel' | 'pdf' | 'csv'): Promise<any> {
    console.log(`[AuditExport] Exporting audit ${audit.id} in ${format} format`);
    
    switch (format) {
      case 'excel':
        return this.exportToExcel(audit);
      case 'csv':
        return this.exportToCsv(audit);
      case 'pdf':
        return this.exportToPdf(audit);
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export to Excel format
   */
  private async exportToExcel(audit: any): Promise<any> {
    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = 'Rival Outranker 2.0';
    workbook.created = new Date();
    workbook.modified = new Date();
    
    // 1. Summary Sheet
    const summarySheet = workbook.addWorksheet('Executive Summary');
    await this.createSummarySheet(summarySheet, audit);
    
    // 2. Content Quality Sheet
    if (audit.results?.contentQuality?.items?.length > 0) {
      const contentSheet = workbook.addWorksheet('Content Quality');
      await this.createFactorSheet(contentSheet, audit.results.contentQuality.items, 'Content Quality Analysis');
    }
    
    // 3. Technical SEO Sheet
    if (audit.results?.technicalSEO?.items?.length > 0) {
      const technicalSheet = workbook.addWorksheet('Technical SEO');
      await this.createFactorSheet(technicalSheet, audit.results.technicalSEO.items, 'Technical SEO Analysis');
    }
    
    // 4. Local SEO Sheet
    if (audit.results?.localSEO?.items?.length > 0) {
      const localSheet = workbook.addWorksheet('Local SEO');
      await this.createFactorSheet(localSheet, audit.results.localSEO.items, 'Local SEO Analysis');
    }
    
    // 5. UX & Performance Sheet
    if (audit.results?.uxPerformance?.items?.length > 0) {
      const uxSheet = workbook.addWorksheet('UX & Performance');
      await this.createFactorSheet(uxSheet, audit.results.uxPerformance.items, 'UX & Performance Analysis');
    }
    
    // 6. Page Analysis Sheet
    if (audit.results?.pageAnalysis?.length > 0) {
      const pageSheet = workbook.addWorksheet('Page Analysis');
      await this.createPageAnalysisSheet(pageSheet, audit.results.pageAnalysis);
    }
    
    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    const filename = `audit-${audit.id}-${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    
    return {
      buffer,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  /**
   * Create summary sheet
   */
  private async createSummarySheet(sheet: ExcelJS.Worksheet, audit: any): Promise<void> {
    // Header
    sheet.mergeCells('A1:F1');
    const headerCell = sheet.getCell('A1');
    headerCell.value = 'Rival Outranker 2.0 - SEO Audit Report';
    headerCell.style = {
      font: { bold: true, size: 16, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    sheet.getRow(1).height = 30;
    
    // Audit Information
    let row = 3;
    const auditInfo = [
      ['Website:', audit.url],
      ['Audit Title:', audit.title],
      ['Audit Type:', audit.type],
      ['Date Completed:', audit.completedAt ? format(new Date(audit.completedAt), 'PPP') : 'In Progress'],
      ['Total Factors Analyzed:', audit.results?.summary?.totalFactors || 0]
    ];
    
    auditInfo.forEach(([label, value]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`A${row}`).style = { font: { bold: true } };
      sheet.getCell(`B${row}`).value = value;
      row++;
    });
    
    // Scores Summary
    row += 2;
    sheet.getCell(`A${row}`).value = 'Overall Scores';
    sheet.getCell(`A${row}`).style = { font: { bold: true, size: 14 } };
    row++;
    
    const scores = [
      ['Overall Score:', audit.results?.summary?.overallScore || 0],
      ['Content Quality:', audit.results?.summary?.categoryScores?.contentQuality || 0],
      ['Technical SEO:', audit.results?.summary?.categoryScores?.technicalSEO || 0],
      ['Local SEO:', audit.results?.summary?.categoryScores?.localSEO || 0],
      ['UX & Performance:', audit.results?.summary?.categoryScores?.uxPerformance || 0]
    ];
    
    scores.forEach(([label, score]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`A${row}`).style = { font: { bold: true } };
      sheet.getCell(`B${row}`).value = score;
      sheet.getCell(`B${row}`).style = { 
        fill: { 
          type: 'pattern', 
          pattern: 'solid', 
          fgColor: { argb: this.getScoreColor(score as number) } 
        } 
      };
      row++;
    });
    
    // Issues Summary
    row += 2;
    sheet.getCell(`A${row}`).value = 'Issues Summary';
    sheet.getCell(`A${row}`).style = { font: { bold: true, size: 14 } };
    row++;
    
    const issues = [
      ['Priority OFI:', audit.results?.summary?.priorityOfiCount || 0],
      ['OFI:', audit.results?.summary?.ofiCount || 0],
      ['OK:', audit.results?.summary?.okCount || 0],
      ['N/A:', audit.results?.summary?.naCount || 0]
    ];
    
    issues.forEach(([label, count]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`A${row}`).style = { font: { bold: true } };
      sheet.getCell(`B${row}`).value = count;
      row++;
    });
    
    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.width = 25;
    });
  }

  /**
   * Create factor analysis sheet
   */
  private async createFactorSheet(
    sheet: ExcelJS.Worksheet, 
    items: any[], 
    title: string
  ): Promise<void> {
    // Header
    sheet.mergeCells('A1:F1');
    const headerCell = sheet.getCell('A1');
    headerCell.value = title;
    headerCell.style = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    sheet.getRow(1).height = 25;
    
    // Column headers
    const headers = ['Factor', 'Status', 'Importance', 'Page', 'Description', 'Notes'];
    headers.forEach((header, index) => {
      const cell = sheet.getCell(2, index + 1);
      cell.value = header;
      cell.style = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } }
      };
    });
    
    // Data rows
    items.forEach((item, index) => {
      const rowIndex = index + 3;
      
      sheet.getCell(rowIndex, 1).value = item.name || 'Unknown Factor';
      sheet.getCell(rowIndex, 2).value = item.status || 'N/A';
      sheet.getCell(rowIndex, 3).value = item.importance || 'Medium';
      sheet.getCell(rowIndex, 4).value = item.pageUrl || item.pageTitle || 'N/A';
      sheet.getCell(rowIndex, 5).value = item.description || '';
      sheet.getCell(rowIndex, 6).value = item.notes || '';
      
      // Color-code status
      const statusCell = sheet.getCell(rowIndex, 2);
      statusCell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getStatusColor(item.status) }
        }
      };
    });
    
    // Auto-fit columns
    sheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 30; // Factor name
      else if (index === 4) column.width = 40; // Description
      else if (index === 5) column.width = 50; // Notes
      else column.width = 15;
    });
    
    // Freeze header rows
    sheet.views = [{ state: 'frozen', ySplit: 2 }];
  }

  /**
   * Create page analysis sheet
   */
  private async createPageAnalysisSheet(sheet: ExcelJS.Worksheet, pageAnalysis: any[]): Promise<void> {
    // Header
    sheet.mergeCells('A1:G1');
    const headerCell = sheet.getCell('A1');
    headerCell.value = 'Page-by-Page Analysis';
    headerCell.style = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: '2563EB' } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    
    // Column headers
    const headers = ['Page URL', 'Page Title', 'Type', 'Priority OFI', 'OFI', 'OK', 'Score'];
    headers.forEach((header, index) => {
      const cell = sheet.getCell(2, index + 1);
      cell.value = header;
      cell.style = {
        font: { bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F3F4F6' } }
      };
    });
    
    // Data rows
    pageAnalysis.forEach((page, index) => {
      const rowIndex = index + 3;
      
      sheet.getCell(rowIndex, 1).value = page.pageUrl || '';
      sheet.getCell(rowIndex, 2).value = page.pageTitle || '';
      sheet.getCell(rowIndex, 3).value = page.pageType || '';
      sheet.getCell(rowIndex, 4).value = page.priorityOfiCount || 0;
      sheet.getCell(rowIndex, 5).value = page.ofiCount || 0;
      sheet.getCell(rowIndex, 6).value = page.okCount || 0;
      sheet.getCell(rowIndex, 7).value = page.score || 0;
      
      // Color-code score
      const scoreCell = sheet.getCell(rowIndex, 7);
      scoreCell.style = {
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.getScoreColor(page.score || 0) }
        }
      };
    });
    
    // Auto-fit columns
    sheet.columns.forEach((column, index) => {
      if (index === 0 || index === 1) column.width = 40; // URLs and titles
      else column.width = 15;
    });
  }

  /**
   * Export to CSV format
   */
  private async exportToCsv(audit: any): Promise<any> {
    const csvRows = [];
    
    // Header
    csvRows.push(['Factor', 'Status', 'Importance', 'Category', 'Page', 'Description', 'Notes'].join(','));
    
    // Collect all items from all categories
    const allItems: any[] = [];
    
    ['contentQuality', 'technicalSEO', 'localSEO', 'uxPerformance'].forEach(category => {
      const categoryData = audit.results?.[category];
      if (categoryData?.items) {
        categoryData.items.forEach((item: any) => {
          allItems.push({
            ...item,
            category: category
          });
        });
      }
    });
    
    // Add data rows
    allItems.forEach(item => {
      const row = [
        this.escapeCsv(item.name || ''),
        this.escapeCsv(item.status || ''),
        this.escapeCsv(item.importance || ''),
        this.escapeCsv(item.category || ''),
        this.escapeCsv(item.pageUrl || item.pageTitle || ''),
        this.escapeCsv(item.description || ''),
        this.escapeCsv(item.notes || '')
      ];
      csvRows.push(row.join(','));
    });
    
    const csvContent = csvRows.join('\n');
    const buffer = Buffer.from(csvContent, 'utf8');
    const filename = `audit-${audit.id}-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    
    return {
      buffer,
      filename,
      mimeType: 'text/csv'
    };
  }

  /**
   * Export to PDF format (placeholder)
   */
  private async exportToPdf(audit: any): Promise<any> {
    // In production, this would use a PDF library like PDFKit or Puppeteer
    // For now, return an error message
    throw new Error('PDF export is not yet implemented. Please use Excel or CSV format.');
  }

  /**
   * Get color for score visualization
   */
  private getScoreColor(score: number): string {
    if (score >= 80) return '10B981'; // Green
    if (score >= 60) return 'F59E0B'; // Yellow
    if (score >= 40) return 'F97316'; // Orange
    return 'EF4444'; // Red
  }

  /**
   * Get color for status visualization
   */
  private getStatusColor(status: string): string {
    switch (status) {
      case 'OK': return 'D1FAE5'; // Light green
      case 'OFI': return 'FEF3C7'; // Light yellow
      case 'Priority OFI': return 'FEE2E2'; // Light red
      case 'N/A': return 'F3F4F6'; // Light gray
      default: return 'FFFFFF'; // White
    }
  }

  /**
   * Escape CSV values
   */
  private escapeCsv(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }
}