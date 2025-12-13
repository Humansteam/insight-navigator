import { StructuredReportRenderer } from '@/components/report';

// Mock markdown report with STUDY_REF markers
const mockReport = `DECEMBER 13, 2025

# Lithium Battery Research Analysis: Global Innovation Trends

This comprehensive analysis examines recent advances in lithium battery technology across major research hubs, identifying key patterns in industrial processing, sustainability approaches, and emerging methodologies.

## ABSTRACT

This systematic review synthesizes findings from 7 peer-reviewed sources examining lithium battery research trends across China, USA, and Europe. The analysis reveals distinct regional patterns: Chinese research emphasizes industrial-scale extraction and manufacturing efficiency, while Western research focuses on sustainability and recycling technologies.

## METHODS

We conducted a systematic literature review using PubMed, Web of Science, and Scopus databases. Search terms included "lithium extraction," "battery recycling," "direct lithium extraction," and "sustainable battery materials." Studies were included if they were peer-reviewed, published between 2020-2024, and focused on industrial applications.

Selection criteria:
- Peer-reviewed publications only
- Sample size > 100 for experimental studies
- Clear methodology description
- Industrial relevance

Quality assessment was performed using the Newcastle-Ottawa Scale.

## RESULTS

### Characteristics of Included Studies

This review includes 7 sources spanning industrial chemistry, materials science, and environmental engineering. Research was distributed across three major regions with distinct methodological approaches.

## Thematic Analysis

### Industrial Processing and Manufacturing

Chinese research clusters demonstrate significant advances in high-efficiency extraction methods and large-scale manufacturing capabilities. *

[STUDY_REF:id=1,title="Industrial-Scale Direct Lithium Extraction Using Membrane Technology",year=2024,authors="Zhang, W., Liu, H., Chen, M.",finding="A novel membrane-based DLE system achieves 95% lithium recovery rate at industrial scale, reducing processing time by 60% compared to conventional evaporation methods."]

The membrane approach represents a paradigm shift in extraction efficiency, enabling continuous operation with minimal environmental footprint. *

[STUDY_REF:id=2,title="High-Throughput Battery Cell Manufacturing: Process Optimization",year=2023,authors="Wang, J., Li, X.",finding="Automated production lines utilizing AI-driven quality control achieve defect rates below 0.1%, with throughput increases of 40% over traditional methods."]

### Sustainability and Recycling

Western research emphasizes closed-loop systems and environmental impact reduction. *

[STUDY_REF:id=3,title="Circular Economy Approaches to Lithium Battery Recycling",year=2024,authors="Smith, R., Johnson, K., Williams, M.",finding="Hydrometallurgical recycling processes can recover 98% of lithium, cobalt, and nickel from spent batteries, with 70% lower carbon footprint than mining new materials."]

European initiatives focus on regulatory compliance and long-term sustainability metrics. *

[STUDY_REF:id=4,title="EU Battery Passport: Implementation Challenges and Opportunities",year=2024,authors="Mueller, A., Bergmann, S.",finding="Digital tracking systems enable complete lifecycle monitoring, with pilot programs showing 25% improvement in end-of-life collection rates."]

### Emerging Technologies

Next-generation battery chemistries show promise for reducing critical material dependencies. *

[STUDY_REF:id=5,title="Sodium-Ion Batteries: From Laboratory to Commercial Applications",year=2024,authors="Park, S., Kim, J., Lee, H.",finding="Sodium-ion cells achieve 160 Wh/kg energy density with 3000+ cycle life, approaching lithium-ion performance at 30% lower cost."]

## CONCLUSIONS

The analysis reveals a clear divergence in regional research priorities. Chinese institutions lead in industrial-scale manufacturing innovations, while Western research emphasizes sustainability and circular economy principles. Cross-regional collaboration could accelerate the development of efficient, sustainable battery technologies.
`;

const ReportDemo = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="mb-8 pb-4 border-b border-border">
          <h1 className="text-xl font-semibold text-foreground">Report Renderer Demo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Testing StructuredReportRenderer with STUDY_REF markers
          </p>
        </div>

        <StructuredReportRenderer markdown={mockReport} />
      </div>
    </div>
  );
};

export default ReportDemo;