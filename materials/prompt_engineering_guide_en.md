# Prompt Engineering Guide

Translation for Telegram channel @prompt_design

---

## Part I. Introduction to Prompt Engineering

### What Prompt Engineering Is

Prompt Engineering is the practice of designing and optimizing inputs (prompts) to language models in order to produce desired outputs.

A good prompt doesn't just ask a question — it shapes the model's behavior: it sets the role, context, format, and constraints.

### Why It Matters

LLMs are sensitive to phrasing. The same task phrased differently produces dramatically different results. Understanding prompting techniques lets you:

- Get more accurate and relevant answers
- Reduce hallucinations
- Control output format
- Solve complex multi-step tasks

### Anatomy of a Prompt

A well-structured prompt usually includes:

- **Instruction** — what needs to be done
- **Context** — additional information for the task
- **Input data** — the specific question or task
- **Output indicator** — the format or type of expected answer

Not every prompt needs all four. Which components are present depends on the task.

---

## Core Principles

### Specificity

The more precise the wording, the more precise the result.

**Bad:** "Write something about marketing"

**Good:** "Write three ideas for an email campaign for a SaaS product targeting small businesses. Each idea — 2–3 sentences"

### Role instructions

Assigning a role improves quality in specialized domains:

```
You are an expert marketing copywriter with 10 years of experience
in B2B SaaS. Write a compelling product description for...
```

### Output formatting

Explicitly state the format you want:

- "Respond in JSON format with the fields name, description, price"
- "Structure the response as a bulleted list"
- "Use a table for comparison"

---

## Prompt Examples

### Basic prompt

```
Classify the customer review as positive, neutral, or negative.

Review: "Delivery took 2 weeks instead of the promised 3 days, but the
product itself is of excellent quality."
```

### Prompt with context

```
You are an assistant in the support service of an online electronics store.
A customer writes:

"My laptop hasn't charged for two days. What should I do?"

Provide a structured response with 3–4 diagnostic steps.
```

---

## Generation Parameters

### Temperature

Controls output randomness:
- **0.0–0.3**: deterministic, predictable responses. For factual questions, code, classification.
- **0.7–1.0**: more creative, diverse responses. For brainstorming, creative writing.

### Top-p (nucleus sampling)

Limits sampling to tokens whose cumulative probability doesn't exceed p. `top_p=0.9` — the model picks from tokens comprising 90% of the probability mass.

### Max tokens

Output length limit. Set reasonable caps to avoid cutting off important parts of the response.

---

## Part II. Prompting Techniques

### Zero-Shot Prompting

The model performs the task without examples.

```
Classify the sentiment of the following movie review:
Review: "The movie was okay, nothing special but not terrible either."
Sentiment:
```

Works well for tasks the model has "seen" in training data. For specific formats or nuanced tasks, examples are needed.

---

### Few-Shot Prompting

Adding a few examples (shots) sharply improves quality.

```
Classify the sentiment.

Review: "This is awesome!"
Sentiment: Positive

Review: "This is bad!"
Sentiment: Negative

Review: "The movie was okay."
Sentiment: Neutral

Review: "The food here is exceptional!"
Sentiment:
```

**Few-shot tips:**
- Examples should be diverse and representative
- Order matters (recent examples carry more weight)
- Optimal count: 3–8 for most tasks

---

### Chain-of-Thought (CoT) Prompting

Induces the model to "think aloud" before answering. Critical for tasks requiring reasoning.

**Without CoT:**
```
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls.
Each can has 3 balls. How many balls does he have now?
A: 11
```

**With CoT:**
```
Q: Roger has 5 tennis balls. He buys 2 more cans of tennis balls.
Each can has 3 balls. How many balls does he have now?
A: Roger started with 5 balls. 2 cans × 3 balls = 6 new balls.
5 + 6 = 11. The answer is 11.
```

**Zero-Shot CoT** — just add "Let's think step by step":

```
Q: A juggler can juggle 16 balls. Half of the balls are golf balls,
and half of the golf balls are blue. How many blue golf balls are there?
A: Let's think step by step.
```

This single phrase significantly improves results on math and logic tasks.

---

### Self-Consistency

Run the same CoT prompt multiple times with `temperature > 0`, then take a majority vote.

Boosts accuracy on hard reasoning tasks. Expensive in tokens, but justified for critical decisions.

---

### Generated Knowledge Prompting

First generate knowledge, then use it for the answer.

**Step 1:** "Generate 5 facts about [topic]"

**Step 2:** Use those facts as context for the next prompt

Especially useful for questions about specific domains or to reduce hallucinations.

---

### Tree of Thoughts (ToT)

An extension of CoT — the model explores several reasoning paths in parallel.

Structure:
1. Break the task into intermediate "thoughts"
2. Generate multiple candidates at each step
3. Evaluate the promise of each branch
4. Continue the most promising ones

Useful for planning, writing code with complex dependencies, strategic decisions.

---

### RAG — Retrieval Augmented Generation

Combines knowledge-base search with generation. The model gets relevant context from external sources.

Flow:
```
User query → Vector DB search → 
Top-K documents → Prompt with context → Answer
```

Advantages:
- Up-to-date data without retraining
- Source citations
- Knowledge control without retraining

---

### ReAct (Reasoning + Acting)

Alternates between reasoning (Thought) and action (Action):

```
Question: What is the elevation range for the area that the
eastern sector of the Colorado orogeny extends into?

Thought: I need to search Colorado orogeny...
Action: Search[Colorado orogeny]
Observation: [search result]

Thought: The eastern sector extends into High Plains. Need elevation.
Action: Search[High Plains]
Observation: [search result]

Thought: High Plains range from 1,800 to 7,000 ft.
Action: Finish[1,800 to 7,000 ft]
```

ReAct reduces hallucinations by combining reasoning with external tools.

---

### Reflexion

The agent reflects on its own mistakes and improves its approach:

1. The agent tries to solve the task
2. Receives feedback (error or score)
3. Writes a "lesson" into verbal memory
4. Retries with the reflection in mind

Significantly improves results on multi-step coding and reasoning tasks.

---

### Multimodal CoT

An extension of CoT for tasks with images:

1. **Reasoning phase**: the model analyzes image and text, generates a reasoning chain
2. **Output phase**: using the reasoning, produces the final answer

1B-parameter models with Multimodal CoT beat GPT-3.5 (175B) on some benchmarks.

---

### Graph Prompting

Representing the task as a graph for structured reasoning. Useful for tasks with explicit relations between entities.

---

### Active-Prompt

Adapts Few-Shot examples to the specific task:

1. Run the model on tasks without CoT examples
2. Pick the tasks with the highest uncertainty (high answer variance)
3. Ask annotators to create CoT for those tasks
4. Use the annotated examples for further training

---

### Directional Stimulus Prompting

Adding a "stimulus" — a hint or keyword that steers generation:

```
Summarize the article. Focus on: climate impact, economic costs,
policy recommendations.

Article: [article text]
```

---

### Automatic Prompt Engineer (APE)

An LLM generates and evaluates prompts automatically:

1. Generate candidate prompts
2. Evaluate each on a validation set
3. Pick the best by a quality metric
4. Iteratively improve

---

### PAL — Program-Aided Language Models

The model generates a program (Python) to solve the task instead of a text answer:

```python
# Q: I have a garden with 5 rows and 8 columns of plants.
# After removing 3 diseased plants, how many remain?
rows = 5
columns = 8
total = rows * columns  # 40
removed = 3
remaining = total - removed  # 37
print(remaining)
```

Removes calculation errors by delegating math to an interpreter.

---

### Prompt Chaining

Breaking a complex task into a sequence of prompts, where the output of one is the input of the next.

Advantages:
- Better performance on hard tasks
- Transparency and controllability of LLM applications
- Easier debugging

Example — document QA in two steps:

1. Prompt 1: extract relevant quotes from the document
2. Prompt 2: form the answer based on the quotes and the document

---

## Part III. LLM Applications

### Code Generation

LLMs (e.g., ChatGPT) are effective at code generation. A system message sets the behavior:

```
You are a helpful code assistant that can teach a junior developer how to
code.
Your language of choice is Python. Don't explain the code, just generate the
code block itself.
```

Capabilities:
- **Generation from comments** — the model creates code from a description in comments
- **Function completion** — the model finishes partially written functions
- **SQL query generation** — the model generates queries from a database schema description
- **Code explanation** — the model clarifies the logic of existing code

SQL generation example:

```
"""
Table departments, columns = [DepartmentId, DepartmentName]
Table students, columns = [DepartmentId, StudentId, StudentName]
Create a MySQL query for all students in the Computer Science department
"""
```

The model generates a correct query with `INNER JOIN`. You can then ask it to create the schema and test data.

---

### Function Calling

Function calling is the ability to reliably connect an LLM to external tools and APIs.

Models like GPT-4 are trained to detect when a function should be called and to generate JSON with arguments for the call. This enables:

- Dialogue agents using external APIs
- Data-extraction and labeling solutions
- Applications converting natural language to API requests
- Knowledge-search dialogue systems

Example: "What is the weather like in London?" → the model returns a call to `get_current_weather(location="London", unit="celsius")` → the developer calls the real API → the response is passed back to the model for the final answer.

---

### Data Generation

LLMs can generate coherent data for experimentation and evaluation:

Prompt:
```
Produce 10 exemplars for sentiment analysis. Examples are categorized as either
positive or negative. Produce 2 negative examples and 8 positive examples.
Use this format for the examples:
Q: <sentence>
A: <sentiment>
```

The model generates 10 correct examples with the right positive-to-negative ratio.

---

### Diversity in Synthetic Datasets

Eldan et al. (2023) worked on generating children's stories. The main problem was ensuring diversity. The solution:

1. Prepare a vocabulary (~1,500 base words: nouns, verbs, adjectives)
2. Randomly pick one verb, noun, and adjective per generation
3. Randomly pick story features (dialogue, unexpected twist, moral)

The method significantly expanded dataset diversity.

**Textbooks Are All You Need**: Gunasekar et al. (2023) showed that training on synthetic data resembling textbooks (clear, informative, unbiased) substantially improves quality. The Phi-1 model (1.5B parameters) competes with models 10× larger.

Algorithm for your own tasks:

1. Define the variable parameters across samples
2. Prepare a collection of entities for substitution
3. Generate data with random substitutions (temperature above default, below maximum)
4. Train a local model on the synthetic data

---

### Synthetic Data for RAG

Dai et al. (2022) proposed: with just 8 labeled examples and a large corpus of unlabeled documents, you can achieve near-SOTA results for task-specific retrievers.

Method: the LLM generates queries for documents (a few-shot prompt with 2–8 examples). The (synthetic query, document) pair is used to train a local retrieval model.

Cost: ~$55 for 50,000 documents using GPT-3.5 Turbo — substantially cheaper than manual labeling.

---

### Prompt Functions

Prompts can be encapsulated as functions with a name and rules, creating reusable components:

```
function_name: [trans_word]
input: ["text"]
rule: [I want you to act as an English translator, spelling corrector and
improver. I will provide you with input forms including "text" in any language
and you will detect the language, translate it and answer in the corrected of
my text, in English.]
```

Functions can be called and composed into chains:

```
fix_english(expand_word(trans_word('original text')))
```

---

### Case Study: Job Classification

Clavié et al. (2023) applied prompt engineering to job-posting classification (suitable for a graduate). Key takeaways:

- Few-shot CoT prompting performed *worse* than zero-shot for tasks that don't require expert knowledge
- Right instructions are critical: F1 65.6 (baseline prompt) → F1 91.7 (optimized)
- Naming the model increased F1 by 0.6 points
- Reiterating key points was one of the main improvement factors

---

### Context Caching (Gemini)

Google released context caching for Gemini 1.5 Pro and Flash. The cache lets you load a large context once and run many queries without resending it.

Use case: analyzing hundreds of scientific papers — load summaries of every paper into the cache and query interactively: "Which papers mention Mamba?", "What innovations are there in long-context LLMs?".

---

### GPT-4o Fine-tuning

OpenAI enabled fine-tuning of GPT-4o and GPT-4o mini.

- Cost: $25 per 1M training tokens; $3.75/$15 per 1M input/output tokens at inference
- Example: fine-tuning for emotion classification using a JSONL dataset — substantial accuracy improvement over the standard models
