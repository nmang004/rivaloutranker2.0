import ExcelJS from 'exceljs';
import fs from 'fs/promises';
import path from 'path';
import type { EnhancedAuditResult } from '../audit/enhanced-analyzer.service';

/**
 * White-Label Reporting Service - Phase 3.3
 * Creates professional, branded reports for agency clients with customizable branding,
 * interactive elements, and automated delivery capabilities
 */
export class WhiteLabelReportingService {
  
  /**
   * Generate comprehensive white-label report
   */
  async generateWhiteLabelReport(
    auditResults: EnhancedAuditResult,
    reportConfig: {
      agencyName: string;
      agencyLogo?: string;
      clientName: string;
      websiteUrl: string;
      reportTitle?: string;
      brandColors?: {
        primary: string;
        secondary: string;
        accent: string;
      };
      includeExecutiveSummary?: boolean;
      includeTechnicalDetails?: boolean;
      includeImplementationGuide?: boolean;
      customSections?: Array<{
        title: string;
        content: string;
        order: number;
      }>;
    },
    format: 'excel' | 'pdf' | 'html' = 'excel'
  ): Promise<{
    buffer: Buffer;
    filename: string;
    mimeType: string;
  }> {

    console.log(`[WhiteLabelReporting] Generating ${format} report for ${reportConfig.clientName}`);

    switch (format) {
      case 'excel':
        return await this.generateExcelReport(auditResults, reportConfig);
      case 'pdf':
        return await this.generatePDFReport(auditResults, reportConfig);
      case 'html':
        return await this.generateHTMLReport(auditResults, reportConfig);
      default:
        throw new Error(`Unsupported report format: ${format}`);
    }
  }

  /**
   * Generate professional Excel report with branding
   */
  private async generateExcelReport(
    auditResults: EnhancedAuditResult,
    config: any
  ): Promise<{ buffer: Buffer; filename: string; mimeType: string }> {

    const workbook = new ExcelJS.Workbook();
    
    // Set workbook properties
    workbook.creator = config.agencyName || 'SEO Agency';
    workbook.lastModifiedBy = config.agencyName || 'SEO Agency';
    workbook.created = new Date();
    workbook.modified = new Date();
    workbook.title = `SEO Audit Report - ${config.clientName}`;
    workbook.subject = 'Comprehensive SEO Analysis';
    workbook.keywords = 'SEO, Audit, Analysis, Website Optimization';
    workbook.description = `Professional SEO audit report for ${config.websiteUrl}`;

    // Define brand colors
    const colors = {
      primary: config.brandColors?.primary || '#2563EB',
      secondary: config.brandColors?.secondary || '#1E40AF',
      accent: config.brandColors?.accent || '#3B82F6',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      text: '#1F2937',
      lightGray: '#F9FAFB',
      mediumGray: '#E5E7EB'
    };

    // Create Executive Summary sheet
    await this.createExecutiveSummarySheet(workbook, auditResults, config, colors);
    
    // Create detailed analysis sheets
    await this.createContentAnalysisSheet(workbook, auditResults, colors);
    await this.createTechnicalSEOSheet(workbook, auditResults, colors);
    await this.createLocalSEOSheet(workbook, auditResults, colors);
    await this.createUXPerformanceSheet(workbook, auditResults, colors);
    
    // Create AI Insights sheet if available
    if (auditResults.aiInsights) {
      await this.createAIInsightsSheet(workbook, auditResults, colors);
    }
    
    // Create Implementation Guide sheet
    if (config.includeImplementationGuide !== false) {
      await this.createImplementationGuideSheet(workbook, auditResults, colors);
    }
    
    // Create Priority Actions sheet
    await this.createPriorityActionsSheet(workbook, auditResults, colors);

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer() as Buffer;
    const filename = `SEO_Audit_${config.clientName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.xlsx`;

    return {
      buffer,
      filename,
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };
  }

  /**
   * Create Executive Summary sheet
   */
  private async createExecutiveSummarySheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    config: any,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Executive Summary', {
      pageSetup: { paperSize: 9, orientation: 'portrait', margins: { left: 0.7, right: 0.7, top: 1, bottom: 1, header: 0.3, footer: 0.3 }}
    });

    let row = 1;

    // Header with agency branding
    worksheet.mergeCells(`A${row}:H${row + 2}`);
    const headerCell = worksheet.getCell(`A${row}`);
    headerCell.value = `${config.agencyName || 'SEO Agency'}\nSEO Audit Report`;
    headerCell.style = {
      font: { size: 24, bold: true, color: { argb: colors.primary.replace('#', '') } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.lightGray.replace('#', '') } }
    };
    worksheet.getRow(row).height = 60;
    row += 4;

    // Client information
    worksheet.mergeCells(`A${row}:D${row}`);
    worksheet.getCell(`A${row}`).value = 'CLIENT INFORMATION';
    worksheet.getCell(`A${row}`).style = {
      font: { size: 14, bold: true, color: { argb: colors.text.replace('#', '') } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.mediumGray.replace('#', '') } }
    };
    row++;

    const clientInfo = [
      ['Client Name:', config.clientName],
      ['Website:', config.websiteUrl],
      ['Report Date:', new Date().toLocaleDateString()],
      ['Analysis Period:', 'Current State']
    ];

    clientInfo.forEach(([label, value]) => {
      worksheet.getCell(`A${row}`).value = label;
      worksheet.getCell(`B${row}`).value = value;
      worksheet.getCell(`A${row}`).style = { font: { bold: true } };
      row++;
    });

    row += 2;

    // Overall Score Section
    worksheet.mergeCells(`A${row}:D${row}`);
    worksheet.getCell(`A${row}`).value = 'OVERALL SEO SCORE';
    worksheet.getCell(`A${row}`).style = {
      font: { size: 14, bold: true, color: { argb: colors.text.replace('#', '') } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.mediumGray.replace('#', '') } }
    };
    row++;

    // Score visualization
    const overallScore = auditResults.summary.overallScore || 0;
    worksheet.mergeCells(`A${row}:B${row + 2}`);
    const scoreCell = worksheet.getCell(`A${row}`);
    scoreCell.value = `${overallScore}/100`;
    scoreCell.style = {
      font: { size: 36, bold: true, color: { argb: this.getScoreColor(overallScore).replace('#', '') } },
      alignment: { horizontal: 'center', vertical: 'middle' }
    };
    worksheet.getRow(row).height = 50;

    // Score interpretation
    worksheet.getCell(`C${row}`).value = 'Score Interpretation:';
    worksheet.getCell(`C${row + 1}`).value = this.getScoreInterpretation(overallScore);
    worksheet.getCell(`C${row}`).style = { font: { bold: true } };
    worksheet.getCell(`C${row + 1}`).style = { alignment: { wrapText: true } };
    
    row += 4;

    // Category Scores
    worksheet.mergeCells(`A${row}:D${row}`);
    worksheet.getCell(`A${row}`).value = 'CATEGORY BREAKDOWN';
    worksheet.getCell(`A${row}`).style = {
      font: { size: 14, bold: true, color: { argb: colors.text.replace('#', '') } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.mediumGray.replace('#', '') } }
    };
    row++;

    const categoryScores = auditResults.summary.categoryScores || {};
    const categories = [
      ['Content Quality', categoryScores.contentQuality || 0],
      ['Technical SEO', categoryScores.technicalSEO || 0],
      ['Local SEO', categoryScores.localSEO || 0],
      ['UX & Performance', categoryScores.uxPerformance || 0]
    ];

    categories.forEach(([category, score]) => {
      worksheet.getCell(`A${row}`).value = category;
      worksheet.getCell(`B${row}`).value = `${score}/100`;
      worksheet.getCell(`C${row}`).value = this.getScoreStatus(score as number);
      
      worksheet.getCell(`A${row}`).style = { font: { bold: true } };
      worksheet.getCell(`B${row}`).style = { 
        font: { bold: true, color: { argb: this.getScoreColor(score as number).replace('#', '') } }
      };
      
      row++;
    });

    row += 2;

    // Key Findings
    worksheet.mergeCells(`A${row}:D${row}`);
    worksheet.getCell(`A${row}`).value = 'KEY FINDINGS';
    worksheet.getCell(`A${row}`).style = {
      font: { size: 14, bold: true, color: { argb: colors.text.replace('#', '') } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.mediumGray.replace('#', '') } }
    };
    row++;

    const findings = [
      `Total Factors Analyzed: ${auditResults.summary.totalFactors}`,
      `Critical Issues: ${auditResults.summary.priorityOfiCount}`,
      `Opportunities for Improvement: ${auditResults.summary.ofiCount}`,
      `Optimized Factors: ${auditResults.summary.okCount}`
    ];

    findings.forEach(finding => {
      worksheet.getCell(`A${row}`).value = `• ${finding}`;
      row++;
    });

    // Set column widths
    worksheet.getColumn('A').width = 20;
    worksheet.getColumn('B').width = 20;
    worksheet.getColumn('C').width = 25;
    worksheet.getColumn('D').width = 25;
  }

  /**
   * Create Content Analysis sheet
   */
  private async createContentAnalysisSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Content Analysis');
    
    // Add header
    this.addSheetHeader(worksheet, 'Content Quality Analysis', colors);
    
    let row = 4;

    // Content factors table
    const contentFactors = auditResults.contentQuality?.items || [];
    
    if (contentFactors.length > 0) {
      // Table headers
      const headers = ['Factor', 'Status', 'Importance', 'Page', 'Recommendation'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } },
          alignment: { horizontal: 'center' }
        };
      });
      
      row++;

      // Add content factors
      contentFactors.forEach(factor => {
        worksheet.getCell(row, 1).value = factor.name;
        worksheet.getCell(row, 2).value = factor.status;
        worksheet.getCell(row, 3).value = factor.importance;
        worksheet.getCell(row, 4).value = factor.pageTitle || factor.pageUrl || 'Multiple pages';
        worksheet.getCell(row, 5).value = this.extractRecommendation(factor.notes);

        // Style status cell based on status
        this.styleStatusCell(worksheet.getCell(row, 2), factor.status, colors);
        
        row++;
      });
    }

    // AI Content Insights (if available)
    if (auditResults.aiInsights?.contentAnalysis) {
      row += 2;
      
      worksheet.mergeCells(`A${row}:E${row}`);
      worksheet.getCell(`A${row}`).value = 'AI-POWERED CONTENT INSIGHTS';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true, color: { argb: colors.text.replace('#', '') } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.accent.replace('#', '') } }
      };
      row++;

      const insights = auditResults.aiInsights.contentAnalysis;
      
      // Content gaps
      if (insights.contentGaps?.length) {
        worksheet.getCell(`A${row}`).value = 'Content Gaps:';
        worksheet.getCell(`A${row}`).style = { font: { bold: true } };
        row++;
        
        insights.contentGaps.forEach(gap => {
          worksheet.getCell(`A${row}`).value = `• ${gap}`;
          row++;
        });
        row++;
      }

      // Semantic recommendations
      if (insights.semanticRecommendations?.length) {
        worksheet.getCell(`A${row}`).value = 'Semantic SEO Recommendations:';
        worksheet.getCell(`A${row}`).style = { font: { bold: true } };
        row++;
        
        insights.semanticRecommendations.forEach(rec => {
          worksheet.getCell(`A${row}`).value = `• ${rec}`;
          row++;
        });
      }
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create Technical SEO sheet
   */
  private async createTechnicalSEOSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Technical SEO');
    
    this.addSheetHeader(worksheet, 'Technical SEO Analysis', colors);
    
    let row = 4;

    const technicalFactors = auditResults.technicalSEO?.items || [];
    
    if (technicalFactors.length > 0) {
      // Table headers
      const headers = ['Factor', 'Status', 'Importance', 'Impact', 'Fix Difficulty', 'Recommendation'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } },
          alignment: { horizontal: 'center' }
        };
      });
      
      row++;

      // Add technical factors
      technicalFactors.forEach(factor => {
        worksheet.getCell(row, 1).value = factor.name;
        worksheet.getCell(row, 2).value = factor.status;
        worksheet.getCell(row, 3).value = factor.importance;
        worksheet.getCell(row, 4).value = factor.analysisDetails?.estimatedImpact || 'Medium';
        worksheet.getCell(row, 5).value = factor.analysisDetails?.difficulty || 'Medium';
        worksheet.getCell(row, 6).value = this.extractRecommendation(factor.notes);

        this.styleStatusCell(worksheet.getCell(row, 2), factor.status, colors);
        
        row++;
      });
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create Local SEO sheet
   */
  private async createLocalSEOSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Local SEO');
    
    this.addSheetHeader(worksheet, 'Local SEO & E-E-A-T Analysis', colors);
    
    let row = 4;

    const localFactors = auditResults.localSEO?.items || [];
    
    if (localFactors.length > 0) {
      const headers = ['Factor', 'Status', 'Importance', 'Page Type', 'Recommendation'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } },
          alignment: { horizontal: 'center' }
        };
      });
      
      row++;

      localFactors.forEach(factor => {
        worksheet.getCell(row, 1).value = factor.name;
        worksheet.getCell(row, 2).value = factor.status;
        worksheet.getCell(row, 3).value = factor.importance;
        worksheet.getCell(row, 4).value = factor.pageType || 'General';
        worksheet.getCell(row, 5).value = this.extractRecommendation(factor.notes);

        this.styleStatusCell(worksheet.getCell(row, 2), factor.status, colors);
        
        row++;
      });
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create UX Performance sheet
   */
  private async createUXPerformanceSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('UX & Performance');
    
    this.addSheetHeader(worksheet, 'User Experience & Performance Analysis', colors);
    
    let row = 4;

    const uxFactors = auditResults.uxPerformance?.items || [];
    
    if (uxFactors.length > 0) {
      const headers = ['Factor', 'Status', 'Importance', 'User Impact', 'Recommendation'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } },
          alignment: { horizontal: 'center' }
        };
      });
      
      row++;

      uxFactors.forEach(factor => {
        worksheet.getCell(row, 1).value = factor.name;
        worksheet.getCell(row, 2).value = factor.status;
        worksheet.getCell(row, 3).value = factor.importance;
        worksheet.getCell(row, 4).value = this.getUXImpact(factor);
        worksheet.getCell(row, 5).value = this.extractRecommendation(factor.notes);

        this.styleStatusCell(worksheet.getCell(row, 2), factor.status, colors);
        
        row++;
      });
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create AI Insights sheet
   */
  private async createAIInsightsSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('AI Insights');
    
    this.addSheetHeader(worksheet, 'AI-Powered SEO Insights', colors);
    
    let row = 4;

    const aiInsights = auditResults.aiInsights!;

    // Strategic Recommendations
    if (aiInsights.strategicRecommendations?.priorityActions?.length) {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.getCell(`A${row}`).value = 'PRIORITY ACTIONS';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.accent.replace('#', '') } }
      };
      row++;

      const headers = ['Action', 'Impact', 'Difficulty', 'Timeframe', 'Category', 'Description'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
        };
      });
      row++;

      aiInsights.strategicRecommendations.priorityActions.forEach(action => {
        worksheet.getCell(row, 1).value = action.title;
        worksheet.getCell(row, 2).value = action.impact;
        worksheet.getCell(row, 3).value = action.difficulty;
        worksheet.getCell(row, 4).value = action.timeframe;
        worksheet.getCell(row, 5).value = action.category;
        worksheet.getCell(row, 6).value = action.description;
        
        row++;
      });

      row += 2;
    }

    // Quick Wins
    if (aiInsights.strategicRecommendations?.quickWins?.length) {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.getCell(`A${row}`).value = 'QUICK WINS';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.success.replace('#', '') } }
      };
      row++;

      aiInsights.strategicRecommendations.quickWins.forEach(quickWin => {
        worksheet.getCell(`A${row}`).value = `• ${quickWin}`;
        row++;
      });

      row += 2;
    }

    // Content Strategy
    if (aiInsights.contentStrategy?.length) {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.getCell(`A${row}`).value = 'CONTENT STRATEGY';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.accent.replace('#', '') } }
      };
      row++;

      aiInsights.contentStrategy.forEach(strategy => {
        worksheet.getCell(`A${row}`).value = `• ${strategy}`;
        row++;
      });
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create Implementation Guide sheet
   */
  private async createImplementationGuideSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Implementation Guide');
    
    this.addSheetHeader(worksheet, 'SEO Implementation Roadmap', colors);
    
    let row = 4;

    // Check if AI implementation plan exists
    const implementationPlan = auditResults.aiInsights?.strategicRecommendations?.implementationPlan;
    
    if (implementationPlan?.length) {
      implementationPlan.forEach((phase, index) => {
        worksheet.mergeCells(`A${row}:F${row}`);
        worksheet.getCell(`A${row}`).value = phase.phase;
        worksheet.getCell(`A${row}`).style = {
          font: { size: 14, bold: true },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
        };
        row++;

        worksheet.getCell(`A${row}`).value = 'Timeline:';
        worksheet.getCell(`B${row}`).value = phase.timeline;
        worksheet.getCell(`A${row}`).style = { font: { bold: true } };
        row++;

        worksheet.getCell(`A${row}`).value = 'Actions:';
        worksheet.getCell(`A${row}`).style = { font: { bold: true } };
        row++;

        phase.actions.forEach(action => {
          worksheet.getCell(`A${row}`).value = `• ${action}`;
          row++;
        });

        worksheet.getCell(`A${row}`).value = 'Expected Outcome:';
        worksheet.getCell(`B${row}`).value = phase.expectedOutcome;
        worksheet.getCell(`A${row}`).style = { font: { bold: true } };
        row += 3;
      });
    } else {
      // Fallback implementation guide
      const phases = [
        {
          title: 'Phase 1: Critical Issues (Week 1-2)',
          actions: [
            'Fix Priority OFI issues immediately',
            'Optimize page titles and meta descriptions',
            'Resolve technical crawling issues',
            'Update critical content gaps'
          ]
        },
        {
          title: 'Phase 2: Content Optimization (Week 3-6)',
          actions: [
            'Expand thin content pages',
            'Improve keyword optimization',
            'Add structured data markup',
            'Enhance internal linking'
          ]
        },
        {
          title: 'Phase 3: Technical Enhancements (Week 7-10)',
          actions: [
            'Improve site speed and performance',
            'Optimize for mobile experience',
            'Implement advanced technical SEO',
            'Set up monitoring and tracking'
          ]
        }
      ];

      phases.forEach(phase => {
        worksheet.mergeCells(`A${row}:F${row}`);
        worksheet.getCell(`A${row}`).value = phase.title;
        worksheet.getCell(`A${row}`).style = {
          font: { size: 14, bold: true },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
        };
        row++;

        phase.actions.forEach(action => {
          worksheet.getCell(`A${row}`).value = `• ${action}`;
          row++;
        });

        row += 2;
      });
    }

    this.autoFitColumns(worksheet);
  }

  /**
   * Create Priority Actions sheet
   */
  private async createPriorityActionsSheet(
    workbook: ExcelJS.Workbook,
    auditResults: EnhancedAuditResult,
    colors: any
  ): Promise<void> {

    const worksheet = workbook.addWorksheet('Priority Actions');
    
    this.addSheetHeader(worksheet, 'Priority Action Items', colors);
    
    let row = 4;

    // Get all Priority OFI items
    const allFactors = [
      ...(auditResults.contentQuality?.items || []),
      ...(auditResults.technicalSEO?.items || []),
      ...(auditResults.localSEO?.items || []),
      ...(auditResults.uxPerformance?.items || [])
    ];

    const priorityItems = allFactors.filter(factor => factor.status === 'Priority OFI');
    const highImpactItems = allFactors.filter(factor => 
      factor.status === 'OFI' && factor.importance === 'High'
    );

    // Priority OFI section
    if (priorityItems.length > 0) {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.getCell(`A${row}`).value = 'CRITICAL ISSUES (Priority OFI)';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true, color: { argb: 'FFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.danger.replace('#', '') } }
      };
      row++;

      const headers = ['Issue', 'Page/Section', 'Impact', 'Recommendation', 'Priority Score'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
        };
      });
      row++;

      priorityItems.forEach(item => {
        worksheet.getCell(row, 1).value = item.name;
        worksheet.getCell(row, 2).value = item.pageTitle || 'Multiple pages';
        worksheet.getCell(row, 3).value = item.importance;
        worksheet.getCell(row, 4).value = this.extractRecommendation(item.notes);
        worksheet.getCell(row, 5).value = item.analysisDetails?.priority || 8;
        
        row++;
      });

      row += 2;
    }

    // High Impact OFI section
    if (highImpactItems.length > 0) {
      worksheet.mergeCells(`A${row}:F${row}`);
      worksheet.getCell(`A${row}`).value = 'HIGH IMPACT OPPORTUNITIES';
      worksheet.getCell(`A${row}`).style = {
        font: { size: 14, bold: true, color: { argb: 'FFFFFF' } },
        fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.warning.replace('#', '') } }
      };
      row++;

      const headers = ['Opportunity', 'Page/Section', 'Expected Impact', 'Recommendation', 'Difficulty'];
      headers.forEach((header, index) => {
        const cell = worksheet.getCell(row, index + 1);
        cell.value = header;
        cell.style = {
          font: { bold: true, color: { argb: 'FFFFFF' } },
          fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
        };
      });
      row++;

      highImpactItems.slice(0, 10).forEach(item => { // Limit to top 10
        worksheet.getCell(row, 1).value = item.name;
        worksheet.getCell(row, 2).value = item.pageTitle || 'Multiple pages';
        worksheet.getCell(row, 3).value = item.importance;
        worksheet.getCell(row, 4).value = this.extractRecommendation(item.notes);
        worksheet.getCell(row, 5).value = item.analysisDetails?.difficulty || 'Medium';
        
        row++;
      });
    }

    this.autoFitColumns(worksheet);
  }

  // Placeholder methods for PDF and HTML generation
  private async generatePDFReport(auditResults: any, config: any): Promise<any> {
    // TODO: Implement PDF generation using puppeteer or similar
    throw new Error('PDF generation not yet implemented');
  }

  private async generateHTMLReport(auditResults: any, config: any): Promise<any> {
    // TODO: Implement interactive HTML report generation
    throw new Error('HTML generation not yet implemented');
  }

  // Helper methods
  private addSheetHeader(worksheet: ExcelJS.Worksheet, title: string, colors: any): void {
    worksheet.mergeCells('A1:F2');
    const headerCell = worksheet.getCell('A1');
    headerCell.value = title;
    headerCell.style = {
      font: { size: 18, bold: true, color: { argb: 'FFFFFF' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.primary.replace('#', '') } }
    };
    worksheet.getRow(1).height = 40;
  }

  private styleStatusCell(cell: ExcelJS.Cell, status: string, colors: any): void {
    let backgroundColor = colors.mediumGray;
    let textColor = colors.text;

    switch (status) {
      case 'OK':
        backgroundColor = colors.success;
        textColor = 'FFFFFF';
        break;
      case 'OFI':
        backgroundColor = colors.warning;
        textColor = 'FFFFFF';
        break;
      case 'Priority OFI':
        backgroundColor = colors.danger;
        textColor = 'FFFFFF';
        break;
    }

    cell.style = {
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: backgroundColor.replace('#', '') } },
      font: { bold: true, color: { argb: textColor.replace('#', '') } },
      alignment: { horizontal: 'center' }
    };
  }

  private extractRecommendation(notes: string): string {
    // Extract the "How:" section or return a summary
    const howMatch = notes.match(/How:\s*(.+?)(?:\n\n|$)/s);
    if (howMatch) {
      return howMatch[1].trim().substring(0, 100) + '...';
    }
    
    // Return first sentence or truncated notes
    const firstSentence = notes.split('.')[0];
    return firstSentence.length > 100 ? firstSentence.substring(0, 100) + '...' : firstSentence;
  }

  private getScoreColor(score: number): string {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Yellow
    return '#EF4444'; // Red
  }

  private getScoreInterpretation(score: number): string {
    if (score >= 90) return 'Excellent SEO performance';
    if (score >= 80) return 'Good SEO performance with minor opportunities';
    if (score >= 70) return 'Above average with room for improvement';
    if (score >= 60) return 'Average performance, focus on key improvements';
    if (score >= 50) return 'Below average, significant improvements needed';
    return 'Poor performance, comprehensive optimization required';
  }

  private getScoreStatus(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Needs Work';
    return 'Critical';
  }

  private getUXImpact(factor: any): string {
    // Determine UX impact based on factor type
    if (factor.name.toLowerCase().includes('mobile')) return 'High';
    if (factor.name.toLowerCase().includes('speed')) return 'High';
    if (factor.name.toLowerCase().includes('navigation')) return 'Medium';
    return 'Medium';
  }

  private autoFitColumns(worksheet: ExcelJS.Worksheet): void {
    worksheet.columns.forEach(column => {
      if (column.eachCell) {
        let maxLength = 10;
        column.eachCell({ includeEmpty: false }, cell => {
          const length = cell.value ? cell.value.toString().length : 0;
          if (length > maxLength) maxLength = length;
        });
        column.width = Math.min(maxLength + 2, 50); // Cap at 50 characters
      }
    });
  }
}