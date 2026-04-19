# The Perception Gap: Audience Research

**Research on how a Russian-speaking audience perceives AI capabilities**

Research: Artem Subbotin  
Data: survey of the Telegram channel "Silicon Bag" (t.me/prompt_design)  
Analysis performed with Claude Code (Opus 4.6)

---

## Executive Summary

The "Perception Gap" study examines how a Russian-speaking audience perceives the capabilities of AI tools. The sample was 632 participants. A significant gap was found between what modern AI can actually do and what people believe is achievable.

---

## Introduction

The study is aimed at identifying patterns of AI-capability perception and barriers to adoption among practicing specialists and enthusiasts.

**Key research questions:**
- How do people assess current AI capabilities?
- What barriers prevent wider adoption?
- Which products and formats are in greatest demand?
- Is there a connection between confidence in AI and actual usage?

---

## Methodology

**Approach:** mixed (quantitative + qualitative)

**Instruments:**
- TAM (Technology Acceptance Model) — for assessing adoption barriers
- Rogers' Diffusion of Innovations — for audience segmentation
- MAILS (Meta AI Literacy Scale) — for measuring AI literacy
- GAIL (General AI Literacy Scale) — additional validation

**Sample:** n = 632 participants, subscribers of the Telegram channel

**Analysis methods:**
- Clustering (k-means, k=2 and k=4)
- NLP analysis (sentence-transformers, UMAP, HDBSCAN)
- Statistical tests (ANOVA, Chi2, Spearman)

---

## Audience Profile

**Demographics:**
- Predominantly men aged 25–40
- Technical specialists and entrepreneurs
- High education level
- Regular users of AI tools

**Usage patterns:**
- The majority use AI daily or weekly
- Primary tools: Claude, ChatGPT, Midjourney
- Tasks: writing, data analysis, automation

---

## Confidence Analysis

Confidence in one's own AI competencies is distributed unevenly:

- **High confidence** (consider themselves advanced users): ~17%
- **Medium confidence** (use regularly, see the potential): ~50%
- **Low confidence** (feel barriers, use rarely): ~33%

Key observation: self-assessed level often does not match actual usage patterns.

---

## 4 Audience Segments

### Segment A: Curious (99 people, 15.7%)

**Characteristic:** interested in AI but haven't found a practical application yet.

**Patterns:**
- Read about AI but rarely use it
- Barrier: don't understand where to start
- High interest in educational content

**Requests:** step-by-step tutorials, concrete use cases, low barrier to entry.

---

### Segment B: Ambitious (315 people, 49.8%)

**Characteristic:** active AI users looking for deeper application.

**Patterns:**
- Regularly use several tools
- See potential for workflow automation
- Barrier: lack of systematic knowledge

**Requests:** advanced techniques, integrations, business-process automation.

---

### Segment C: Blocked (110 people, 17.4%)

**Characteristic:** want to use AI more actively but run into concrete obstacles.

**Patterns:**
- Tried different tools, haven't found a working approach
- Barriers: technical complexity, language barrier, cost
- Frustration from a mismatch between expectations and results

**Requests:** solutions to concrete problems, Russian-language instructions, affordable alternatives.

---

### Segment D: Advanced (108 people, 17.1%)

**Characteristic:** experienced users with a deep understanding of AI capabilities.

**Patterns:**
- Use AI for complex professional tasks
- Build their own integrations and automations
- Actively track new releases

**Requests:** frontier models, API integrations, research and benchmarks.

---

## Gap Analysis

**Main finding:** a significant gap exists between what AI can actually do today and what most users believe is possible.

**Manifestations of the gap:**
- Users underestimate the quality of code generation
- Overestimate the complexity of setting up agent systems
- Are unaware of many existing capabilities

**Consequence:** a huge share of AI's potential value remains untapped not because of technical limits but because of an information vacuum.

---

## NLP Analysis

Text responses to open-ended questions were processed with an NLP pipeline:

**19 task clusters** — most frequently mentioned:
1. Writing and editing texts
2. Data analysis and reporting
3. Code generation
4. Research and information gathering
5. Automation of routine tasks
6. Content creation for social media
7. Translation and localization
8. Customer support
9. Idea generation and brainstorming
10. Working with documents

**18 payment-behavior clusters** — key patterns:
- Willingness to pay for a concrete result, not a tool
- Preference for subscription models over one-off payments
- High sensitivity to price/quality ratio

---

## Thematic Analysis by Segment

### Segment A (Curious)
- Dominant theme: "I want to try it but don't know how"
- Main barrier: information overload
- Key request: a structured learning path

### Segment B (Ambitious)
- Dominant theme: "I use it but want more"
- Main barrier: lack of advanced knowledge
- Key request: practical cases and templates

### Segment C (Blocked)
- Dominant theme: "I tried, it didn't work"
- Main barrier: technical and language obstacles
- Key request: concrete help with problems

### Segment D (Advanced)
- Dominant theme: "need it deeper and more complex"
- Main barrier: information noise instead of depth
- Key request: technical detail and research

---

## Answers to the Research Questions

**1. How do people assess AI capabilities?**
Most systematically underestimate the capabilities of current models. Awareness grows, but slowly.

**2. What barriers prevent adoption?**
Top 3 barriers: (1) not understanding capabilities, (2) technical integration complexity, (3) the language barrier around Russian-language material.

**3. Which products are in greatest demand?**
Practical guides with real cases, templates for specific tasks, ready-to-use "out of the box" automated solutions.

**4. Is there a connection between confidence and usage?**
Weak positive correlation (Spearman rho=0.19, p<0.001). Confidence and actual use are not the same thing.

---

## Implications

**For content strategy:**
- Create materials based on segmentation: different formats for A, B, C, D
- Focus on practical cases, not theoretical overviews
- Lower the entry barrier for Segments A and C

**For product development:**
- Highest potential — Segment B (50% of the audience, high willingness to pay)
- Segment D — opinion leaders, early adopters of new products
- Segment C — high pain, willing to pay for solutions to concrete problems

**For positioning:**
- Emphasis on practical applicability, not technical complexity
- Demonstrate concrete results instead of describing capabilities
- Russian-language content as a competitive advantage

---

## 12. Verification of Results

| Test | Result | Interpretation |
|------|--------|----------------|
| Silhouette (k=2) | 0.281 | Karpathy's binary model confirmed |
| Silhouette (k=4) | 0.244 | 4-segment model acceptable |
| ANOVA (confidence) | F=214.63, p<0.001 | Segments differ significantly |
| Chi2 (barriers) | 52.47, p<0.001 | Barriers depend on segment |
| Chi2 (products) | 73.02, p<0.001 | Requests depend on segment |
| Spearman | rho=0.19, p<0.001 | Weak but significant connection |
| NLP convergence | Yes | NLP clusters align with segments |

---

## Appendices

### A. Technical Stack

- Python 3.x: pandas, scikit-learn, scipy, statsmodels
- NLP: sentence-transformers (multilingual MiniLM), UMAP, HDBSCAN
- Visualizations: matplotlib, seaborn

### B. Project Files

- `01_analysis.py` — cleaning, statistics, segmentation
- `02_nlp_analysis.py` — NLP pipeline
- `03_visualizations.py` — visualizations
- `enriched_data.csv` — enriched dataset with segments
- `segment_summary.csv` — segment summary
- `nlp_clusters_*.csv` — NLP clusters for each text field

### C. Bibliography

- Davis, F.D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. MIS Quarterly.
- Rogers, E.M. (2003). Diffusion of Innovations (5th ed.).
- Yin, R.K. (2014). Case Study Research: Design and Methods (5th ed.).
- Karpathy, A. (2026). Social media post on AI capability perception gap.
- Meta AI Literacy Scale (MAILS), 2023.
- General AI Literacy (GAIL) Scale, 2024.
