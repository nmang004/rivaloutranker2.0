import { z } from "zod";
/**
 * Enhanced Audit Schemas for Rival Outranker 2.0
 * Preserves the sophisticated 140+ factor analysis system while adding new capabilities
 */
export declare const auditStatusSchema: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
export declare const seoImportanceSchema: z.ZodEnum<["High", "Medium", "Low"]>;
export declare const auditTypeSchema: z.ZodEnum<["standard", "comprehensive", "technical", "content", "local", "competitor"]>;
export declare const auditItemSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodString;
    status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
    importance: z.ZodEnum<["High", "Medium", "Low"]>;
    notes: z.ZodString;
    category: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
    pageUrl: z.ZodOptional<z.ZodString>;
    pageTitle: z.ZodOptional<z.ZodString>;
    pageType: z.ZodOptional<z.ZodString>;
    analysisDetails: z.ZodOptional<z.ZodObject<{
        actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
        metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
        estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
        priority: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        priority?: number | undefined;
        expected?: string | number | boolean | undefined;
        recommendations?: string[] | undefined;
        difficulty?: "medium" | "easy" | "hard" | undefined;
        metrics?: Record<string, string | number | boolean> | undefined;
        actual?: string | number | boolean | undefined;
        estimatedImpact?: "high" | "medium" | "low" | undefined;
    }, {
        priority?: number | undefined;
        expected?: string | number | boolean | undefined;
        recommendations?: string[] | undefined;
        difficulty?: "medium" | "easy" | "hard" | undefined;
        metrics?: Record<string, string | number | boolean> | undefined;
        actual?: string | number | boolean | undefined;
        estimatedImpact?: "high" | "medium" | "low" | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    status: "OK" | "Priority OFI" | "OFI" | "N/A";
    name: string;
    description: string;
    category: string;
    importance: "High" | "Medium" | "Low";
    notes: string;
    score?: number | undefined;
    pageUrl?: string | undefined;
    pageTitle?: string | undefined;
    pageType?: string | undefined;
    analysisDetails?: {
        priority?: number | undefined;
        expected?: string | number | boolean | undefined;
        recommendations?: string[] | undefined;
        difficulty?: "medium" | "easy" | "hard" | undefined;
        metrics?: Record<string, string | number | boolean> | undefined;
        actual?: string | number | boolean | undefined;
        estimatedImpact?: "high" | "medium" | "low" | undefined;
    } | undefined;
}, {
    status: "OK" | "Priority OFI" | "OFI" | "N/A";
    name: string;
    description: string;
    category: string;
    importance: "High" | "Medium" | "Low";
    notes: string;
    score?: number | undefined;
    pageUrl?: string | undefined;
    pageTitle?: string | undefined;
    pageType?: string | undefined;
    analysisDetails?: {
        priority?: number | undefined;
        expected?: string | number | boolean | undefined;
        recommendations?: string[] | undefined;
        difficulty?: "medium" | "easy" | "hard" | undefined;
        metrics?: Record<string, string | number | boolean> | undefined;
        actual?: string | number | boolean | undefined;
        estimatedImpact?: "high" | "medium" | "low" | undefined;
    } | undefined;
}>;
export declare const pageIssueSummarySchema: z.ZodObject<{
    pageUrl: z.ZodString;
    pageTitle: z.ZodString;
    pageType: z.ZodString;
    priority: z.ZodOptional<z.ZodNumber>;
    priorityWeight: z.ZodOptional<z.ZodNumber>;
    priorityOfiCount: z.ZodNumber;
    ofiCount: z.ZodNumber;
    okCount: z.ZodNumber;
    naCount: z.ZodNumber;
    totalIssues: z.ZodNumber;
    score: z.ZodOptional<z.ZodNumber>;
    weightedScore: z.ZodOptional<z.ZodNumber>;
    topIssues: z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
        importance: z.ZodEnum<["High", "Medium", "Low"]>;
        category: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        category: string;
        importance: "High" | "Medium" | "Low";
    }, {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        category: string;
        importance: "High" | "Medium" | "Low";
    }>, "many">>;
}, "strip", z.ZodTypeAny, {
    pageUrl: string;
    pageTitle: string;
    pageType: string;
    priorityOfiCount: number;
    ofiCount: number;
    okCount: number;
    naCount: number;
    totalIssues: number;
    priority?: number | undefined;
    score?: number | undefined;
    priorityWeight?: number | undefined;
    weightedScore?: number | undefined;
    topIssues?: {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        category: string;
        importance: "High" | "Medium" | "Low";
    }[] | undefined;
}, {
    pageUrl: string;
    pageTitle: string;
    pageType: string;
    priorityOfiCount: number;
    ofiCount: number;
    okCount: number;
    naCount: number;
    totalIssues: number;
    priority?: number | undefined;
    score?: number | undefined;
    priorityWeight?: number | undefined;
    weightedScore?: number | undefined;
    topIssues?: {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        category: string;
        importance: "High" | "Medium" | "Low";
    }[] | undefined;
}>;
export declare const auditSectionSchema: z.ZodObject<{
    items: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        description: z.ZodString;
        status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
        importance: z.ZodEnum<["High", "Medium", "Low"]>;
        notes: z.ZodString;
        category: z.ZodString;
        score: z.ZodOptional<z.ZodNumber>;
        pageUrl: z.ZodOptional<z.ZodString>;
        pageTitle: z.ZodOptional<z.ZodString>;
        pageType: z.ZodOptional<z.ZodString>;
        analysisDetails: z.ZodOptional<z.ZodObject<{
            actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
            metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
            recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
            difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
            estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
            priority: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        }, {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        description: string;
        category: string;
        importance: "High" | "Medium" | "Low";
        notes: string;
        score?: number | undefined;
        pageUrl?: string | undefined;
        pageTitle?: string | undefined;
        pageType?: string | undefined;
        analysisDetails?: {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        } | undefined;
    }, {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        description: string;
        category: string;
        importance: "High" | "Medium" | "Low";
        notes: string;
        score?: number | undefined;
        pageUrl?: string | undefined;
        pageTitle?: string | undefined;
        pageType?: string | undefined;
        analysisDetails?: {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        } | undefined;
    }>, "many">;
    score: z.ZodOptional<z.ZodNumber>;
    completionRate: z.ZodOptional<z.ZodNumber>;
    categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
    insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    items: {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        description: string;
        category: string;
        importance: "High" | "Medium" | "Low";
        notes: string;
        score?: number | undefined;
        pageUrl?: string | undefined;
        pageTitle?: string | undefined;
        pageType?: string | undefined;
        analysisDetails?: {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        } | undefined;
    }[];
    categoryScores?: Record<string, number> | undefined;
    insights?: string[] | undefined;
    score?: number | undefined;
    completionRate?: number | undefined;
}, {
    items: {
        status: "OK" | "Priority OFI" | "OFI" | "N/A";
        name: string;
        description: string;
        category: string;
        importance: "High" | "Medium" | "Low";
        notes: string;
        score?: number | undefined;
        pageUrl?: string | undefined;
        pageTitle?: string | undefined;
        pageType?: string | undefined;
        analysisDetails?: {
            priority?: number | undefined;
            expected?: string | number | boolean | undefined;
            recommendations?: string[] | undefined;
            difficulty?: "medium" | "easy" | "hard" | undefined;
            metrics?: Record<string, string | number | boolean> | undefined;
            actual?: string | number | boolean | undefined;
            estimatedImpact?: "high" | "medium" | "low" | undefined;
        } | undefined;
    }[];
    categoryScores?: Record<string, number> | undefined;
    insights?: string[] | undefined;
    score?: number | undefined;
    completionRate?: number | undefined;
}>;
export declare const aiInsightsSchema: z.ZodOptional<z.ZodObject<{
    contentAnalysis: z.ZodObject<{
        contentGaps: z.ZodArray<z.ZodString, "many">;
        semanticRecommendations: z.ZodArray<z.ZodString, "many">;
        keywordOpportunities: z.ZodArray<z.ZodString, "many">;
        readabilityInsights: z.ZodArray<z.ZodString, "many">;
        entityAnalysis: z.ZodObject<{
            entities: z.ZodArray<z.ZodString, "many">;
            authorityIndicators: z.ZodArray<z.ZodString, "many">;
            eeatScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        }, {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        }>;
        contentScore: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        contentGaps: string[];
        keywordOpportunities: string[];
        semanticRecommendations: string[];
        readabilityInsights: string[];
        entityAnalysis: {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        };
        contentScore: number;
    }, {
        contentGaps: string[];
        keywordOpportunities: string[];
        semanticRecommendations: string[];
        readabilityInsights: string[];
        entityAnalysis: {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        };
        contentScore: number;
    }>;
    strategicRecommendations: z.ZodObject<{
        priorityActions: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            impact: z.ZodString;
            difficulty: z.ZodString;
            timeframe: z.ZodString;
            category: z.ZodString;
            description: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }, {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }>, "many">;
        quickWins: z.ZodArray<z.ZodString, "many">;
        longTermStrategy: z.ZodArray<z.ZodString, "many">;
        implementationPlan: z.ZodArray<z.ZodObject<{
            phase: z.ZodString;
            timeline: z.ZodString;
            actions: z.ZodArray<z.ZodString, "many">;
            expectedOutcome: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }, {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }>, "many">;
    }, "strip", z.ZodTypeAny, {
        priorityActions: {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }[];
        quickWins: string[];
        longTermStrategy: string[];
        implementationPlan: {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }[];
    }, {
        priorityActions: {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }[];
        quickWins: string[];
        longTermStrategy: string[];
        implementationPlan: {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }[];
    }>;
    contentStrategy: z.ZodArray<z.ZodString, "many">;
    generatedAt: z.ZodString;
    aiModel: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contentAnalysis: {
        contentGaps: string[];
        keywordOpportunities: string[];
        semanticRecommendations: string[];
        readabilityInsights: string[];
        entityAnalysis: {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        };
        contentScore: number;
    };
    strategicRecommendations: {
        priorityActions: {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }[];
        quickWins: string[];
        longTermStrategy: string[];
        implementationPlan: {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }[];
    };
    contentStrategy: string[];
    generatedAt: string;
    aiModel: string;
    error?: string | undefined;
}, {
    contentAnalysis: {
        contentGaps: string[];
        keywordOpportunities: string[];
        semanticRecommendations: string[];
        readabilityInsights: string[];
        entityAnalysis: {
            entities: string[];
            authorityIndicators: string[];
            eeatScore: number;
        };
        contentScore: number;
    };
    strategicRecommendations: {
        priorityActions: {
            description: string;
            title: string;
            category: string;
            impact: string;
            difficulty: string;
            timeframe: string;
        }[];
        quickWins: string[];
        longTermStrategy: string[];
        implementationPlan: {
            actions: string[];
            phase: string;
            timeline: string;
            expectedOutcome: string;
        }[];
    };
    contentStrategy: string[];
    generatedAt: string;
    aiModel: string;
    error?: string | undefined;
}>>;
export declare const enhancedAuditResultSchema: z.ZodObject<{
    summary: z.ZodObject<{
        totalFactors: z.ZodNumber;
        priorityOfiCount: z.ZodNumber;
        ofiCount: z.ZodNumber;
        okCount: z.ZodNumber;
        naCount: z.ZodNumber;
        overallScore: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodObject<{
            contentQuality: z.ZodOptional<z.ZodNumber>;
            technicalSEO: z.ZodOptional<z.ZodNumber>;
            localSEO: z.ZodOptional<z.ZodNumber>;
            uxPerformance: z.ZodOptional<z.ZodNumber>;
        }, "strip", z.ZodTypeAny, {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        }, {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        }>>;
        recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        estimatedFixTime: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalFactors: number;
        overallScore?: number | undefined;
        categoryScores?: {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        estimatedFixTime?: string | undefined;
    }, {
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalFactors: number;
        overallScore?: number | undefined;
        categoryScores?: {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        estimatedFixTime?: string | undefined;
    }>;
    onPage: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    structureNavigation: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    contactPage: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    servicePages: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    locationPages: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    serviceAreaPages: z.ZodOptional<z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>>;
    contentQuality: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    technicalSEO: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    localSEO: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    uxPerformance: z.ZodObject<{
        items: z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            description: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            notes: z.ZodString;
            category: z.ZodString;
            score: z.ZodOptional<z.ZodNumber>;
            pageUrl: z.ZodOptional<z.ZodString>;
            pageTitle: z.ZodOptional<z.ZodString>;
            pageType: z.ZodOptional<z.ZodString>;
            analysisDetails: z.ZodOptional<z.ZodObject<{
                actual: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                expected: z.ZodOptional<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>;
                metrics: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBoolean]>>>;
                recommendations: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
                difficulty: z.ZodOptional<z.ZodEnum<["easy", "medium", "hard"]>>;
                estimatedImpact: z.ZodOptional<z.ZodEnum<["low", "medium", "high"]>>;
                priority: z.ZodOptional<z.ZodNumber>;
            }, "strip", z.ZodTypeAny, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }, {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            }>>;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }>, "many">;
        score: z.ZodOptional<z.ZodNumber>;
        completionRate: z.ZodOptional<z.ZodNumber>;
        categoryScores: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodNumber>>;
        insights: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }, {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    }>;
    pageAnalysis: z.ZodOptional<z.ZodArray<z.ZodObject<{
        pageUrl: z.ZodString;
        pageTitle: z.ZodString;
        pageType: z.ZodString;
        priority: z.ZodOptional<z.ZodNumber>;
        priorityWeight: z.ZodOptional<z.ZodNumber>;
        priorityOfiCount: z.ZodNumber;
        ofiCount: z.ZodNumber;
        okCount: z.ZodNumber;
        naCount: z.ZodNumber;
        totalIssues: z.ZodNumber;
        score: z.ZodOptional<z.ZodNumber>;
        weightedScore: z.ZodOptional<z.ZodNumber>;
        topIssues: z.ZodOptional<z.ZodArray<z.ZodObject<{
            name: z.ZodString;
            status: z.ZodEnum<["Priority OFI", "OFI", "OK", "N/A"]>;
            importance: z.ZodEnum<["High", "Medium", "Low"]>;
            category: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }, {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }>, "many">>;
    }, "strip", z.ZodTypeAny, {
        pageUrl: string;
        pageTitle: string;
        pageType: string;
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalIssues: number;
        priority?: number | undefined;
        score?: number | undefined;
        priorityWeight?: number | undefined;
        weightedScore?: number | undefined;
        topIssues?: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }[] | undefined;
    }, {
        pageUrl: string;
        pageTitle: string;
        pageType: string;
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalIssues: number;
        priority?: number | undefined;
        score?: number | undefined;
        priorityWeight?: number | undefined;
        weightedScore?: number | undefined;
        topIssues?: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }[] | undefined;
    }>, "many">>;
    competitorComparison: z.ZodOptional<z.ZodObject<{
        competitors: z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            score: z.ZodNumber;
            strengths: z.ZodArray<z.ZodString, "many">;
            weaknesses: z.ZodArray<z.ZodString, "many">;
        }, "strip", z.ZodTypeAny, {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }, {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }>, "many">>;
        gaps: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        opportunities: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        competitors?: {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }[] | undefined;
        gaps?: string[] | undefined;
        opportunities?: string[] | undefined;
    }, {
        competitors?: {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }[] | undefined;
        gaps?: string[] | undefined;
        opportunities?: string[] | undefined;
    }>>;
    crawlMetadata: z.ZodOptional<z.ZodObject<{
        pagesAnalyzed: z.ZodNumber;
        maxPagesReached: z.ZodOptional<z.ZodBoolean>;
        crawlDuration: z.ZodOptional<z.ZodNumber>;
        errors: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        pagesAnalyzed: number;
        errors?: string[] | undefined;
        maxPagesReached?: boolean | undefined;
        crawlDuration?: number | undefined;
    }, {
        pagesAnalyzed: number;
        errors?: string[] | undefined;
        maxPagesReached?: boolean | undefined;
        crawlDuration?: number | undefined;
    }>>;
    aiInsights: z.ZodOptional<z.ZodObject<{
        contentAnalysis: z.ZodObject<{
            contentGaps: z.ZodArray<z.ZodString, "many">;
            semanticRecommendations: z.ZodArray<z.ZodString, "many">;
            keywordOpportunities: z.ZodArray<z.ZodString, "many">;
            readabilityInsights: z.ZodArray<z.ZodString, "many">;
            entityAnalysis: z.ZodObject<{
                entities: z.ZodArray<z.ZodString, "many">;
                authorityIndicators: z.ZodArray<z.ZodString, "many">;
                eeatScore: z.ZodNumber;
            }, "strip", z.ZodTypeAny, {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            }, {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            }>;
            contentScore: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        }, {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        }>;
        strategicRecommendations: z.ZodObject<{
            priorityActions: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                impact: z.ZodString;
                difficulty: z.ZodString;
                timeframe: z.ZodString;
                category: z.ZodString;
                description: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }, {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }>, "many">;
            quickWins: z.ZodArray<z.ZodString, "many">;
            longTermStrategy: z.ZodArray<z.ZodString, "many">;
            implementationPlan: z.ZodArray<z.ZodObject<{
                phase: z.ZodString;
                timeline: z.ZodString;
                actions: z.ZodArray<z.ZodString, "many">;
                expectedOutcome: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }, {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }>, "many">;
        }, "strip", z.ZodTypeAny, {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        }, {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        }>;
        contentStrategy: z.ZodArray<z.ZodString, "many">;
        generatedAt: z.ZodString;
        aiModel: z.ZodString;
        error: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        contentAnalysis: {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        };
        strategicRecommendations: {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        };
        contentStrategy: string[];
        generatedAt: string;
        aiModel: string;
        error?: string | undefined;
    }, {
        contentAnalysis: {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        };
        strategicRecommendations: {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        };
        contentStrategy: string[];
        generatedAt: string;
        aiModel: string;
        error?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    contentQuality: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    summary: {
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalFactors: number;
        overallScore?: number | undefined;
        categoryScores?: {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        estimatedFixTime?: string | undefined;
    };
    technicalSEO: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    localSEO: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    uxPerformance: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    onPage: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    structureNavigation: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    contactPage: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    servicePages: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    locationPages: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    aiInsights?: {
        contentAnalysis: {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        };
        strategicRecommendations: {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        };
        contentStrategy: string[];
        generatedAt: string;
        aiModel: string;
        error?: string | undefined;
    } | undefined;
    serviceAreaPages?: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
    pageAnalysis?: {
        pageUrl: string;
        pageTitle: string;
        pageType: string;
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalIssues: number;
        priority?: number | undefined;
        score?: number | undefined;
        priorityWeight?: number | undefined;
        weightedScore?: number | undefined;
        topIssues?: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }[] | undefined;
    }[] | undefined;
    competitorComparison?: {
        competitors?: {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }[] | undefined;
        gaps?: string[] | undefined;
        opportunities?: string[] | undefined;
    } | undefined;
    crawlMetadata?: {
        pagesAnalyzed: number;
        errors?: string[] | undefined;
        maxPagesReached?: boolean | undefined;
        crawlDuration?: number | undefined;
    } | undefined;
}, {
    contentQuality: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    summary: {
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalFactors: number;
        overallScore?: number | undefined;
        categoryScores?: {
            contentQuality?: number | undefined;
            technicalSEO?: number | undefined;
            localSEO?: number | undefined;
            uxPerformance?: number | undefined;
        } | undefined;
        recommendations?: string[] | undefined;
        estimatedFixTime?: string | undefined;
    };
    technicalSEO: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    localSEO: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    uxPerformance: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    onPage: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    structureNavigation: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    contactPage: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    servicePages: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    locationPages: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    };
    aiInsights?: {
        contentAnalysis: {
            contentGaps: string[];
            keywordOpportunities: string[];
            semanticRecommendations: string[];
            readabilityInsights: string[];
            entityAnalysis: {
                entities: string[];
                authorityIndicators: string[];
                eeatScore: number;
            };
            contentScore: number;
        };
        strategicRecommendations: {
            priorityActions: {
                description: string;
                title: string;
                category: string;
                impact: string;
                difficulty: string;
                timeframe: string;
            }[];
            quickWins: string[];
            longTermStrategy: string[];
            implementationPlan: {
                actions: string[];
                phase: string;
                timeline: string;
                expectedOutcome: string;
            }[];
        };
        contentStrategy: string[];
        generatedAt: string;
        aiModel: string;
        error?: string | undefined;
    } | undefined;
    serviceAreaPages?: {
        items: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            description: string;
            category: string;
            importance: "High" | "Medium" | "Low";
            notes: string;
            score?: number | undefined;
            pageUrl?: string | undefined;
            pageTitle?: string | undefined;
            pageType?: string | undefined;
            analysisDetails?: {
                priority?: number | undefined;
                expected?: string | number | boolean | undefined;
                recommendations?: string[] | undefined;
                difficulty?: "medium" | "easy" | "hard" | undefined;
                metrics?: Record<string, string | number | boolean> | undefined;
                actual?: string | number | boolean | undefined;
                estimatedImpact?: "high" | "medium" | "low" | undefined;
            } | undefined;
        }[];
        categoryScores?: Record<string, number> | undefined;
        insights?: string[] | undefined;
        score?: number | undefined;
        completionRate?: number | undefined;
    } | undefined;
    pageAnalysis?: {
        pageUrl: string;
        pageTitle: string;
        pageType: string;
        priorityOfiCount: number;
        ofiCount: number;
        okCount: number;
        naCount: number;
        totalIssues: number;
        priority?: number | undefined;
        score?: number | undefined;
        priorityWeight?: number | undefined;
        weightedScore?: number | undefined;
        topIssues?: {
            status: "OK" | "Priority OFI" | "OFI" | "N/A";
            name: string;
            category: string;
            importance: "High" | "Medium" | "Low";
        }[] | undefined;
    }[] | undefined;
    competitorComparison?: {
        competitors?: {
            url: string;
            strengths: string[];
            weaknesses: string[];
            score: number;
        }[] | undefined;
        gaps?: string[] | undefined;
        opportunities?: string[] | undefined;
    } | undefined;
    crawlMetadata?: {
        pagesAnalyzed: number;
        errors?: string[] | undefined;
        maxPagesReached?: boolean | undefined;
        crawlDuration?: number | undefined;
    } | undefined;
}>;
export declare const audits: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "audits";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "audits";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "audits";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        teamId: import("drizzle-orm/pg-core").PgColumn<{
            name: "team_id";
            tableName: "audits";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: import("drizzle-orm/pg-core").PgColumn<{
            name: "url";
            tableName: "audits";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: import("drizzle-orm/pg-core").PgColumn<{
            name: "title";
            tableName: "audits";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 255;
        }>;
        type: import("drizzle-orm/pg-core").PgColumn<{
            name: "type";
            tableName: "audits";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 50;
        }>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "audits";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 20;
        }>;
        progress: import("drizzle-orm/pg-core").PgColumn<{
            name: "progress";
            tableName: "audits";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        results: import("drizzle-orm/pg-core").PgColumn<{
            name: "results";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                contentQuality: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                summary: {
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalFactors: number;
                    overallScore?: number | undefined;
                    categoryScores?: {
                        contentQuality?: number | undefined;
                        technicalSEO?: number | undefined;
                        localSEO?: number | undefined;
                        uxPerformance?: number | undefined;
                    } | undefined;
                    recommendations?: string[] | undefined;
                    estimatedFixTime?: string | undefined;
                };
                technicalSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                localSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                uxPerformance: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                onPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                structureNavigation: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                contactPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                servicePages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                locationPages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                aiInsights?: {
                    contentAnalysis: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        semanticRecommendations: string[];
                        readabilityInsights: string[];
                        entityAnalysis: {
                            entities: string[];
                            authorityIndicators: string[];
                            eeatScore: number;
                        };
                        contentScore: number;
                    };
                    strategicRecommendations: {
                        priorityActions: {
                            description: string;
                            title: string;
                            category: string;
                            impact: string;
                            difficulty: string;
                            timeframe: string;
                        }[];
                        quickWins: string[];
                        longTermStrategy: string[];
                        implementationPlan: {
                            actions: string[];
                            phase: string;
                            timeline: string;
                            expectedOutcome: string;
                        }[];
                    };
                    contentStrategy: string[];
                    generatedAt: string;
                    aiModel: string;
                    error?: string | undefined;
                } | undefined;
                serviceAreaPages?: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                } | undefined;
                pageAnalysis?: {
                    pageUrl: string;
                    pageTitle: string;
                    pageType: string;
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalIssues: number;
                    priority?: number | undefined;
                    score?: number | undefined;
                    priorityWeight?: number | undefined;
                    weightedScore?: number | undefined;
                    topIssues?: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                    }[] | undefined;
                }[] | undefined;
                competitorComparison?: {
                    competitors?: {
                        url: string;
                        strengths: string[];
                        weaknesses: string[];
                        score: number;
                    }[] | undefined;
                    gaps?: string[] | undefined;
                    opportunities?: string[] | undefined;
                } | undefined;
                crawlMetadata?: {
                    pagesAnalyzed: number;
                    errors?: string[] | undefined;
                    maxPagesReached?: boolean | undefined;
                    crawlDuration?: number | undefined;
                } | undefined;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                contentQuality: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                summary: {
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalFactors: number;
                    overallScore?: number | undefined;
                    categoryScores?: {
                        contentQuality?: number | undefined;
                        technicalSEO?: number | undefined;
                        localSEO?: number | undefined;
                        uxPerformance?: number | undefined;
                    } | undefined;
                    recommendations?: string[] | undefined;
                    estimatedFixTime?: string | undefined;
                };
                technicalSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                localSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                uxPerformance: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                onPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                structureNavigation: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                contactPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                servicePages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                locationPages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                aiInsights?: {
                    contentAnalysis: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        semanticRecommendations: string[];
                        readabilityInsights: string[];
                        entityAnalysis: {
                            entities: string[];
                            authorityIndicators: string[];
                            eeatScore: number;
                        };
                        contentScore: number;
                    };
                    strategicRecommendations: {
                        priorityActions: {
                            description: string;
                            title: string;
                            category: string;
                            impact: string;
                            difficulty: string;
                            timeframe: string;
                        }[];
                        quickWins: string[];
                        longTermStrategy: string[];
                        implementationPlan: {
                            actions: string[];
                            phase: string;
                            timeline: string;
                            expectedOutcome: string;
                        }[];
                    };
                    contentStrategy: string[];
                    generatedAt: string;
                    aiModel: string;
                    error?: string | undefined;
                } | undefined;
                serviceAreaPages?: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                } | undefined;
                pageAnalysis?: {
                    pageUrl: string;
                    pageTitle: string;
                    pageType: string;
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalIssues: number;
                    priority?: number | undefined;
                    score?: number | undefined;
                    priorityWeight?: number | undefined;
                    weightedScore?: number | undefined;
                    topIssues?: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                    }[] | undefined;
                }[] | undefined;
                competitorComparison?: {
                    competitors?: {
                        url: string;
                        strengths: string[];
                        weaknesses: string[];
                        score: number;
                    }[] | undefined;
                    gaps?: string[] | undefined;
                    opportunities?: string[] | undefined;
                } | undefined;
                crawlMetadata?: {
                    pagesAnalyzed: number;
                    errors?: string[] | undefined;
                    maxPagesReached?: boolean | undefined;
                    crawlDuration?: number | undefined;
                } | undefined;
            };
        }>;
        config: import("drizzle-orm/pg-core").PgColumn<{
            name: "config";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                maxPages?: number;
                includeSubdomains?: boolean;
                analyzeCompetitors?: boolean;
                competitorUrls?: string[];
                focusAreas?: string[];
                customFactors?: object[];
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                maxPages?: number;
                includeSubdomains?: boolean;
                analyzeCompetitors?: boolean;
                competitorUrls?: string[];
                focusAreas?: string[];
                customFactors?: object[];
            };
        }>;
        metrics: import("drizzle-orm/pg-core").PgColumn<{
            name: "metrics";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                analysisTimeMs: number;
                pagesAnalyzed: number;
                factorsAnalyzed: number;
                apiCallsUsed: number;
                costUsd?: number;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                analysisTimeMs: number;
                pagesAnalyzed: number;
                factorsAnalyzed: number;
                apiCallsUsed: number;
                costUsd?: number;
            };
        }>;
        exports: import("drizzle-orm/pg-core").PgColumn<{
            name: "exports";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                excel?: {
                    generatedAt: string;
                    downloadCount: number;
                };
                pdf?: {
                    generatedAt: string;
                    downloadCount: number;
                };
                csv?: {
                    generatedAt: string;
                    downloadCount: number;
                };
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                excel?: {
                    generatedAt: string;
                    downloadCount: number;
                };
                pdf?: {
                    generatedAt: string;
                    downloadCount: number;
                };
                csv?: {
                    generatedAt: string;
                    downloadCount: number;
                };
            };
        }>;
        isScheduled: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_scheduled";
            tableName: "audits";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        scheduleConfig: import("drizzle-orm/pg-core").PgColumn<{
            name: "schedule_config";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                frequency?: "daily" | "weekly" | "monthly";
                dayOfWeek?: number;
                dayOfMonth?: number;
                time?: string;
                timezone?: string;
                nextRun?: string;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                frequency?: "daily" | "weekly" | "monthly";
                dayOfWeek?: number;
                dayOfMonth?: number;
                time?: string;
                timezone?: string;
                nextRun?: string;
            };
        }>;
        sharedWith: import("drizzle-orm/pg-core").PgColumn<{
            name: "shared_with";
            tableName: "audits";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                users?: number[];
                teams?: number[];
                publicLink?: {
                    enabled: boolean;
                    token: string;
                    expiresAt?: string;
                };
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                users?: number[];
                teams?: number[];
                publicLink?: {
                    enabled: boolean;
                    token: string;
                    expiresAt?: string;
                };
            };
        }>;
        startedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "started_at";
            tableName: "audits";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        completedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "completed_at";
            tableName: "audits";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "audits";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "audits";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const auditHistory: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "audit_history";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "audit_history";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        auditId: import("drizzle-orm/pg-core").PgColumn<{
            name: "audit_id";
            tableName: "audit_history";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        version: import("drizzle-orm/pg-core").PgColumn<{
            name: "version";
            tableName: "audit_history";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        results: import("drizzle-orm/pg-core").PgColumn<{
            name: "results";
            tableName: "audit_history";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                contentQuality: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                summary: {
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalFactors: number;
                    overallScore?: number | undefined;
                    categoryScores?: {
                        contentQuality?: number | undefined;
                        technicalSEO?: number | undefined;
                        localSEO?: number | undefined;
                        uxPerformance?: number | undefined;
                    } | undefined;
                    recommendations?: string[] | undefined;
                    estimatedFixTime?: string | undefined;
                };
                technicalSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                localSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                uxPerformance: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                onPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                structureNavigation: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                contactPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                servicePages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                locationPages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                aiInsights?: {
                    contentAnalysis: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        semanticRecommendations: string[];
                        readabilityInsights: string[];
                        entityAnalysis: {
                            entities: string[];
                            authorityIndicators: string[];
                            eeatScore: number;
                        };
                        contentScore: number;
                    };
                    strategicRecommendations: {
                        priorityActions: {
                            description: string;
                            title: string;
                            category: string;
                            impact: string;
                            difficulty: string;
                            timeframe: string;
                        }[];
                        quickWins: string[];
                        longTermStrategy: string[];
                        implementationPlan: {
                            actions: string[];
                            phase: string;
                            timeline: string;
                            expectedOutcome: string;
                        }[];
                    };
                    contentStrategy: string[];
                    generatedAt: string;
                    aiModel: string;
                    error?: string | undefined;
                } | undefined;
                serviceAreaPages?: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                } | undefined;
                pageAnalysis?: {
                    pageUrl: string;
                    pageTitle: string;
                    pageType: string;
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalIssues: number;
                    priority?: number | undefined;
                    score?: number | undefined;
                    priorityWeight?: number | undefined;
                    weightedScore?: number | undefined;
                    topIssues?: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                    }[] | undefined;
                }[] | undefined;
                competitorComparison?: {
                    competitors?: {
                        url: string;
                        strengths: string[];
                        weaknesses: string[];
                        score: number;
                    }[] | undefined;
                    gaps?: string[] | undefined;
                    opportunities?: string[] | undefined;
                } | undefined;
                crawlMetadata?: {
                    pagesAnalyzed: number;
                    errors?: string[] | undefined;
                    maxPagesReached?: boolean | undefined;
                    crawlDuration?: number | undefined;
                } | undefined;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                contentQuality: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                summary: {
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalFactors: number;
                    overallScore?: number | undefined;
                    categoryScores?: {
                        contentQuality?: number | undefined;
                        technicalSEO?: number | undefined;
                        localSEO?: number | undefined;
                        uxPerformance?: number | undefined;
                    } | undefined;
                    recommendations?: string[] | undefined;
                    estimatedFixTime?: string | undefined;
                };
                technicalSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                localSEO: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                uxPerformance: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                onPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                structureNavigation: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                contactPage: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                servicePages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                locationPages: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                };
                aiInsights?: {
                    contentAnalysis: {
                        contentGaps: string[];
                        keywordOpportunities: string[];
                        semanticRecommendations: string[];
                        readabilityInsights: string[];
                        entityAnalysis: {
                            entities: string[];
                            authorityIndicators: string[];
                            eeatScore: number;
                        };
                        contentScore: number;
                    };
                    strategicRecommendations: {
                        priorityActions: {
                            description: string;
                            title: string;
                            category: string;
                            impact: string;
                            difficulty: string;
                            timeframe: string;
                        }[];
                        quickWins: string[];
                        longTermStrategy: string[];
                        implementationPlan: {
                            actions: string[];
                            phase: string;
                            timeline: string;
                            expectedOutcome: string;
                        }[];
                    };
                    contentStrategy: string[];
                    generatedAt: string;
                    aiModel: string;
                    error?: string | undefined;
                } | undefined;
                serviceAreaPages?: {
                    items: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        description: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                        notes: string;
                        score?: number | undefined;
                        pageUrl?: string | undefined;
                        pageTitle?: string | undefined;
                        pageType?: string | undefined;
                        analysisDetails?: {
                            priority?: number | undefined;
                            expected?: string | number | boolean | undefined;
                            recommendations?: string[] | undefined;
                            difficulty?: "medium" | "easy" | "hard" | undefined;
                            metrics?: Record<string, string | number | boolean> | undefined;
                            actual?: string | number | boolean | undefined;
                            estimatedImpact?: "high" | "medium" | "low" | undefined;
                        } | undefined;
                    }[];
                    categoryScores?: Record<string, number> | undefined;
                    insights?: string[] | undefined;
                    score?: number | undefined;
                    completionRate?: number | undefined;
                } | undefined;
                pageAnalysis?: {
                    pageUrl: string;
                    pageTitle: string;
                    pageType: string;
                    priorityOfiCount: number;
                    ofiCount: number;
                    okCount: number;
                    naCount: number;
                    totalIssues: number;
                    priority?: number | undefined;
                    score?: number | undefined;
                    priorityWeight?: number | undefined;
                    weightedScore?: number | undefined;
                    topIssues?: {
                        status: "OK" | "Priority OFI" | "OFI" | "N/A";
                        name: string;
                        category: string;
                        importance: "High" | "Medium" | "Low";
                    }[] | undefined;
                }[] | undefined;
                competitorComparison?: {
                    competitors?: {
                        url: string;
                        strengths: string[];
                        weaknesses: string[];
                        score: number;
                    }[] | undefined;
                    gaps?: string[] | undefined;
                    opportunities?: string[] | undefined;
                } | undefined;
                crawlMetadata?: {
                    pagesAnalyzed: number;
                    errors?: string[] | undefined;
                    maxPagesReached?: boolean | undefined;
                    crawlDuration?: number | undefined;
                } | undefined;
            };
        }>;
        changes: import("drizzle-orm/pg-core").PgColumn<{
            name: "changes";
            tableName: "audit_history";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                added: string[];
                removed: string[];
                modified: string[];
                scoreChange: number;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                added: string[];
                removed: string[];
                modified: string[];
                scoreChange: number;
            };
        }>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "audit_history";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const auditComments: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "audit_comments";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "audit_comments";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        auditId: import("drizzle-orm/pg-core").PgColumn<{
            name: "audit_id";
            tableName: "audit_comments";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: import("drizzle-orm/pg-core").PgColumn<{
            name: "user_id";
            tableName: "audit_comments";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        factorName: import("drizzle-orm/pg-core").PgColumn<{
            name: "factor_name";
            tableName: "audit_comments";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 255;
        }>;
        content: import("drizzle-orm/pg-core").PgColumn<{
            name: "content";
            tableName: "audit_comments";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isResolved: import("drizzle-orm/pg-core").PgColumn<{
            name: "is_resolved";
            tableName: "audit_comments";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        resolvedBy: import("drizzle-orm/pg-core").PgColumn<{
            name: "resolved_by";
            tableName: "audit_comments";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        resolvedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "resolved_at";
            tableName: "audit_comments";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "audit_comments";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "updated_at";
            tableName: "audit_comments";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const crawlJobs: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "crawl_jobs";
    schema: undefined;
    columns: {
        id: import("drizzle-orm/pg-core").PgColumn<{
            name: "id";
            tableName: "crawl_jobs";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        auditId: import("drizzle-orm/pg-core").PgColumn<{
            name: "audit_id";
            tableName: "crawl_jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: import("drizzle-orm/pg-core").PgColumn<{
            name: "url";
            tableName: "crawl_jobs";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        status: import("drizzle-orm/pg-core").PgColumn<{
            name: "status";
            tableName: "crawl_jobs";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 20;
        }>;
        progress: import("drizzle-orm/pg-core").PgColumn<{
            name: "progress";
            tableName: "crawl_jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        pagesFound: import("drizzle-orm/pg-core").PgColumn<{
            name: "pages_found";
            tableName: "crawl_jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        pagesAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
            name: "pages_analyzed";
            tableName: "crawl_jobs";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        errors: import("drizzle-orm/pg-core").PgColumn<{
            name: "errors";
            tableName: "crawl_jobs";
            dataType: "json";
            columnType: "PgJsonb";
            data: string[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: string[];
        }>;
        siteStructure: import("drizzle-orm/pg-core").PgColumn<{
            name: "site_structure";
            tableName: "crawl_jobs";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                homepage?: object;
                contactPage?: object;
                servicePages?: object[];
                locationPages?: object[];
                otherPages?: object[];
                sitemapUrls?: string[];
                robotsTxt?: string;
            };
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                homepage?: object;
                contactPage?: object;
                servicePages?: object[];
                locationPages?: object[];
                otherPages?: object[];
                sitemapUrls?: string[];
                robotsTxt?: string;
            };
        }>;
        startedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "started_at";
            tableName: "crawl_jobs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        completedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "completed_at";
            tableName: "crawl_jobs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "created_at";
            tableName: "crawl_jobs";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export declare const insertAuditSchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "audits";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    title: import("drizzle-orm/pg-core").PgColumn<{
        name: "title";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    type: import("drizzle-orm/pg-core").PgColumn<{
        name: "type";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 50;
    }>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    progress: import("drizzle-orm/pg-core").PgColumn<{
        name: "progress";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
    }>;
    config: import("drizzle-orm/pg-core").PgColumn<{
        name: "config";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            maxPages?: number;
            includeSubdomains?: boolean;
            analyzeCompetitors?: boolean;
            competitorUrls?: string[];
            focusAreas?: string[];
            customFactors?: object[];
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            maxPages?: number;
            includeSubdomains?: boolean;
            analyzeCompetitors?: boolean;
            competitorUrls?: string[];
            focusAreas?: string[];
            customFactors?: object[];
        };
    }>;
    metrics: import("drizzle-orm/pg-core").PgColumn<{
        name: "metrics";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            analysisTimeMs: number;
            pagesAnalyzed: number;
            factorsAnalyzed: number;
            apiCallsUsed: number;
            costUsd?: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            analysisTimeMs: number;
            pagesAnalyzed: number;
            factorsAnalyzed: number;
            apiCallsUsed: number;
            costUsd?: number;
        };
    }>;
    exports: import("drizzle-orm/pg-core").PgColumn<{
        name: "exports";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            excel?: {
                generatedAt: string;
                downloadCount: number;
            };
            pdf?: {
                generatedAt: string;
                downloadCount: number;
            };
            csv?: {
                generatedAt: string;
                downloadCount: number;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            excel?: {
                generatedAt: string;
                downloadCount: number;
            };
            pdf?: {
                generatedAt: string;
                downloadCount: number;
            };
            csv?: {
                generatedAt: string;
                downloadCount: number;
            };
        };
    }>;
    isScheduled: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_scheduled";
        tableName: "audits";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    scheduleConfig: import("drizzle-orm/pg-core").PgColumn<{
        name: "schedule_config";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            frequency?: "daily" | "weekly" | "monthly";
            dayOfWeek?: number;
            dayOfMonth?: number;
            time?: string;
            timezone?: string;
            nextRun?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            frequency?: "daily" | "weekly" | "monthly";
            dayOfWeek?: number;
            dayOfMonth?: number;
            time?: string;
            timezone?: string;
            nextRun?: string;
        };
    }>;
    sharedWith: import("drizzle-orm/pg-core").PgColumn<{
        name: "shared_with";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            users?: number[];
            teams?: number[];
            publicLink?: {
                enabled: boolean;
                token: string;
                expiresAt?: string;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            users?: number[];
            teams?: number[];
            publicLink?: {
                enabled: boolean;
                token: string;
                expiresAt?: string;
            };
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, {
    url: z.ZodString;
    type: z.ZodEnum<["standard", "comprehensive", "technical", "content", "local", "competitor"]>;
    title: z.ZodOptional<z.ZodString>;
}>;
export declare const selectAuditSchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    teamId: import("drizzle-orm/pg-core").PgColumn<{
        name: "team_id";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "audits";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    title: import("drizzle-orm/pg-core").PgColumn<{
        name: "title";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    type: import("drizzle-orm/pg-core").PgColumn<{
        name: "type";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 50;
    }>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "audits";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    progress: import("drizzle-orm/pg-core").PgColumn<{
        name: "progress";
        tableName: "audits";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
    }>;
    config: import("drizzle-orm/pg-core").PgColumn<{
        name: "config";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            maxPages?: number;
            includeSubdomains?: boolean;
            analyzeCompetitors?: boolean;
            competitorUrls?: string[];
            focusAreas?: string[];
            customFactors?: object[];
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            maxPages?: number;
            includeSubdomains?: boolean;
            analyzeCompetitors?: boolean;
            competitorUrls?: string[];
            focusAreas?: string[];
            customFactors?: object[];
        };
    }>;
    metrics: import("drizzle-orm/pg-core").PgColumn<{
        name: "metrics";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            analysisTimeMs: number;
            pagesAnalyzed: number;
            factorsAnalyzed: number;
            apiCallsUsed: number;
            costUsd?: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            analysisTimeMs: number;
            pagesAnalyzed: number;
            factorsAnalyzed: number;
            apiCallsUsed: number;
            costUsd?: number;
        };
    }>;
    exports: import("drizzle-orm/pg-core").PgColumn<{
        name: "exports";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            excel?: {
                generatedAt: string;
                downloadCount: number;
            };
            pdf?: {
                generatedAt: string;
                downloadCount: number;
            };
            csv?: {
                generatedAt: string;
                downloadCount: number;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            excel?: {
                generatedAt: string;
                downloadCount: number;
            };
            pdf?: {
                generatedAt: string;
                downloadCount: number;
            };
            csv?: {
                generatedAt: string;
                downloadCount: number;
            };
        };
    }>;
    isScheduled: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_scheduled";
        tableName: "audits";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    scheduleConfig: import("drizzle-orm/pg-core").PgColumn<{
        name: "schedule_config";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            frequency?: "daily" | "weekly" | "monthly";
            dayOfWeek?: number;
            dayOfMonth?: number;
            time?: string;
            timezone?: string;
            nextRun?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            frequency?: "daily" | "weekly" | "monthly";
            dayOfWeek?: number;
            dayOfMonth?: number;
            time?: string;
            timezone?: string;
            nextRun?: string;
        };
    }>;
    sharedWith: import("drizzle-orm/pg-core").PgColumn<{
        name: "shared_with";
        tableName: "audits";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            users?: number[];
            teams?: number[];
            publicLink?: {
                enabled: boolean;
                token: string;
                expiresAt?: string;
            };
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            users?: number[];
            teams?: number[];
            publicLink?: {
                enabled: boolean;
                token: string;
                expiresAt?: string;
            };
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "audits";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export declare const insertAuditHistorySchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    version: import("drizzle-orm/pg-core").PgColumn<{
        name: "version";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "audit_history";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
    }>;
    changes: import("drizzle-orm/pg-core").PgColumn<{
        name: "changes";
        tableName: "audit_history";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            added: string[];
            removed: string[];
            modified: string[];
            scoreChange: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            added: string[];
            removed: string[];
            modified: string[];
            scoreChange: number;
        };
    }>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audit_history";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export declare const selectAuditHistorySchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    version: import("drizzle-orm/pg-core").PgColumn<{
        name: "version";
        tableName: "audit_history";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    results: import("drizzle-orm/pg-core").PgColumn<{
        name: "results";
        tableName: "audit_history";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            contentQuality: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            summary: {
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalFactors: number;
                overallScore?: number | undefined;
                categoryScores?: {
                    contentQuality?: number | undefined;
                    technicalSEO?: number | undefined;
                    localSEO?: number | undefined;
                    uxPerformance?: number | undefined;
                } | undefined;
                recommendations?: string[] | undefined;
                estimatedFixTime?: string | undefined;
            };
            technicalSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            localSEO: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            uxPerformance: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            onPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            structureNavigation: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            contactPage: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            servicePages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            locationPages: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            };
            aiInsights?: {
                contentAnalysis: {
                    contentGaps: string[];
                    keywordOpportunities: string[];
                    semanticRecommendations: string[];
                    readabilityInsights: string[];
                    entityAnalysis: {
                        entities: string[];
                        authorityIndicators: string[];
                        eeatScore: number;
                    };
                    contentScore: number;
                };
                strategicRecommendations: {
                    priorityActions: {
                        description: string;
                        title: string;
                        category: string;
                        impact: string;
                        difficulty: string;
                        timeframe: string;
                    }[];
                    quickWins: string[];
                    longTermStrategy: string[];
                    implementationPlan: {
                        actions: string[];
                        phase: string;
                        timeline: string;
                        expectedOutcome: string;
                    }[];
                };
                contentStrategy: string[];
                generatedAt: string;
                aiModel: string;
                error?: string | undefined;
            } | undefined;
            serviceAreaPages?: {
                items: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    description: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                    notes: string;
                    score?: number | undefined;
                    pageUrl?: string | undefined;
                    pageTitle?: string | undefined;
                    pageType?: string | undefined;
                    analysisDetails?: {
                        priority?: number | undefined;
                        expected?: string | number | boolean | undefined;
                        recommendations?: string[] | undefined;
                        difficulty?: "medium" | "easy" | "hard" | undefined;
                        metrics?: Record<string, string | number | boolean> | undefined;
                        actual?: string | number | boolean | undefined;
                        estimatedImpact?: "high" | "medium" | "low" | undefined;
                    } | undefined;
                }[];
                categoryScores?: Record<string, number> | undefined;
                insights?: string[] | undefined;
                score?: number | undefined;
                completionRate?: number | undefined;
            } | undefined;
            pageAnalysis?: {
                pageUrl: string;
                pageTitle: string;
                pageType: string;
                priorityOfiCount: number;
                ofiCount: number;
                okCount: number;
                naCount: number;
                totalIssues: number;
                priority?: number | undefined;
                score?: number | undefined;
                priorityWeight?: number | undefined;
                weightedScore?: number | undefined;
                topIssues?: {
                    status: "OK" | "Priority OFI" | "OFI" | "N/A";
                    name: string;
                    category: string;
                    importance: "High" | "Medium" | "Low";
                }[] | undefined;
            }[] | undefined;
            competitorComparison?: {
                competitors?: {
                    url: string;
                    strengths: string[];
                    weaknesses: string[];
                    score: number;
                }[] | undefined;
                gaps?: string[] | undefined;
                opportunities?: string[] | undefined;
            } | undefined;
            crawlMetadata?: {
                pagesAnalyzed: number;
                errors?: string[] | undefined;
                maxPagesReached?: boolean | undefined;
                crawlDuration?: number | undefined;
            } | undefined;
        };
    }>;
    changes: import("drizzle-orm/pg-core").PgColumn<{
        name: "changes";
        tableName: "audit_history";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            added: string[];
            removed: string[];
            modified: string[];
            scoreChange: number;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            added: string[];
            removed: string[];
            modified: string[];
            scoreChange: number;
        };
    }>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audit_history";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export declare const insertAuditCommentSchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    factorName: import("drizzle-orm/pg-core").PgColumn<{
        name: "factor_name";
        tableName: "audit_comments";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    content: import("drizzle-orm/pg-core").PgColumn<{
        name: "content";
        tableName: "audit_comments";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isResolved: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_resolved";
        tableName: "audit_comments";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    resolvedBy: import("drizzle-orm/pg-core").PgColumn<{
        name: "resolved_by";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    resolvedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "resolved_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, {
    content: z.ZodString;
}>;
export declare const selectAuditCommentSchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    userId: import("drizzle-orm/pg-core").PgColumn<{
        name: "user_id";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    factorName: import("drizzle-orm/pg-core").PgColumn<{
        name: "factor_name";
        tableName: "audit_comments";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 255;
    }>;
    content: import("drizzle-orm/pg-core").PgColumn<{
        name: "content";
        tableName: "audit_comments";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    isResolved: import("drizzle-orm/pg-core").PgColumn<{
        name: "is_resolved";
        tableName: "audit_comments";
        dataType: "boolean";
        columnType: "PgBoolean";
        data: boolean;
        driverParam: boolean;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    resolvedBy: import("drizzle-orm/pg-core").PgColumn<{
        name: "resolved_by";
        tableName: "audit_comments";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    resolvedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "resolved_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    updatedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "updated_at";
        tableName: "audit_comments";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export declare const insertCrawlJobSchema: import("drizzle-zod").BuildSchema<"insert", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "crawl_jobs";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "crawl_jobs";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    progress: import("drizzle-orm/pg-core").PgColumn<{
        name: "progress";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pagesFound: import("drizzle-orm/pg-core").PgColumn<{
        name: "pages_found";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pagesAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
        name: "pages_analyzed";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    errors: import("drizzle-orm/pg-core").PgColumn<{
        name: "errors";
        tableName: "crawl_jobs";
        dataType: "json";
        columnType: "PgJsonb";
        data: string[];
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: string[];
    }>;
    siteStructure: import("drizzle-orm/pg-core").PgColumn<{
        name: "site_structure";
        tableName: "crawl_jobs";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            homepage?: object;
            contactPage?: object;
            servicePages?: object[];
            locationPages?: object[];
            otherPages?: object[];
            sitemapUrls?: string[];
            robotsTxt?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            homepage?: object;
            contactPage?: object;
            servicePages?: object[];
            locationPages?: object[];
            otherPages?: object[];
            sitemapUrls?: string[];
            robotsTxt?: string;
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, {
    url: z.ZodString;
}>;
export declare const selectCrawlJobSchema: import("drizzle-zod").BuildSchema<"select", {
    id: import("drizzle-orm/pg-core").PgColumn<{
        name: "id";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgSerial";
        data: number;
        driverParam: number;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: true;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    auditId: import("drizzle-orm/pg-core").PgColumn<{
        name: "audit_id";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    url: import("drizzle-orm/pg-core").PgColumn<{
        name: "url";
        tableName: "crawl_jobs";
        dataType: "string";
        columnType: "PgText";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    status: import("drizzle-orm/pg-core").PgColumn<{
        name: "status";
        tableName: "crawl_jobs";
        dataType: "string";
        columnType: "PgVarchar";
        data: string;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: [string, ...string[]];
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        length: 20;
    }>;
    progress: import("drizzle-orm/pg-core").PgColumn<{
        name: "progress";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pagesFound: import("drizzle-orm/pg-core").PgColumn<{
        name: "pages_found";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    pagesAnalyzed: import("drizzle-orm/pg-core").PgColumn<{
        name: "pages_analyzed";
        tableName: "crawl_jobs";
        dataType: "number";
        columnType: "PgInteger";
        data: number;
        driverParam: string | number;
        notNull: false;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    errors: import("drizzle-orm/pg-core").PgColumn<{
        name: "errors";
        tableName: "crawl_jobs";
        dataType: "json";
        columnType: "PgJsonb";
        data: string[];
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: string[];
    }>;
    siteStructure: import("drizzle-orm/pg-core").PgColumn<{
        name: "site_structure";
        tableName: "crawl_jobs";
        dataType: "json";
        columnType: "PgJsonb";
        data: {
            homepage?: object;
            contactPage?: object;
            servicePages?: object[];
            locationPages?: object[];
            otherPages?: object[];
            sitemapUrls?: string[];
            robotsTxt?: string;
        };
        driverParam: unknown;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {
        $type: {
            homepage?: object;
            contactPage?: object;
            servicePages?: object[];
            locationPages?: object[];
            otherPages?: object[];
            sitemapUrls?: string[];
            robotsTxt?: string;
        };
    }>;
    startedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "started_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    completedAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "completed_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: false;
        hasDefault: false;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
    createdAt: import("drizzle-orm/pg-core").PgColumn<{
        name: "created_at";
        tableName: "crawl_jobs";
        dataType: "date";
        columnType: "PgTimestamp";
        data: Date;
        driverParam: string;
        notNull: true;
        hasDefault: true;
        isPrimaryKey: false;
        isAutoincrement: false;
        hasRuntimeDefault: false;
        enumValues: undefined;
        baseColumn: never;
        identity: undefined;
        generated: undefined;
    }, {}, {}>;
}, undefined>;
export type Audit = typeof audits.$inferSelect;
export type NewAudit = typeof audits.$inferInsert;
export type AuditHistory = typeof auditHistory.$inferSelect;
export type NewAuditHistory = typeof auditHistory.$inferInsert;
export type AuditComment = typeof auditComments.$inferSelect;
export type NewAuditComment = typeof auditComments.$inferInsert;
export type CrawlJob = typeof crawlJobs.$inferSelect;
export type NewCrawlJob = typeof crawlJobs.$inferInsert;
