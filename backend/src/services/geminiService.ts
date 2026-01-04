// backend/src/services/geminiService.ts
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  ITestResult,
  ExamGoal,
  IPlan,
  TestType,
  PlanWeek,
  Plan,
  PlanStep,
  Question,
  ChatMessage,
  QuestionAnalysis,
  TopicPerformance,
  Exam,
} from "../types";

// ✅ FIXED — Use ES module import (uuid is ESM-only)
import { v4 as uuidv4 } from "uuid";

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables.");
}

const ai = new GoogleGenerativeAI(geminiApiKey);

/** Normalize Gemini errors */
const mapGeminiError = (error: any, action: string): Error => {
  const rawMessage = typeof error?.message === "string" ? error.message : "";
  const rawErrorString = JSON.stringify(error, null, 2);

  let userMessage = `Something went wrong while ${action}. Please try again in a moment.`;
  let statusCode = 500;

  if (
    rawMessage.includes("You exceeded your current quota") ||
    rawMessage.includes('"code":429') ||
    rawMessage.includes("RESOURCE_EXHAUSTED") ||
    rawMessage.toLowerCase().includes("quota")
  ) {
    userMessage =
      "Our AI test generator has hit its daily limit for this project. Please wait a little while and try again, or come back later today.";
    statusCode = 429;
  } else if (rawMessage.includes("API key not valid") || rawMessage.includes("API_KEY_INVALID")) {
    userMessage = "AI Service Configuration Error: The API key provided is invalid.";
    console.error("CRITICAL: Gemini API Key is invalid. Check backend/.env");
  } else if (rawMessage.includes("not found") || rawMessage.includes("404")) {
    userMessage = "AI Service Error: The selected model is unavailable.";
    console.error("CRITICAL: Gemini model not found. Check geminiService.ts model names.");
  }

  console.error(`Gemini API error during [${action}]:`, {
    message: rawMessage,
    statusCode: statusCode,
    errorDetails: rawErrorString
  });

  const friendlyError = new Error(userMessage);
  (friendlyError as any).statusCode = statusCode;
  (friendlyError as any).rawGeminiError = rawMessage;
  return friendlyError;
};

/** Parse raw JSON from Gemini */
const parseJsonResponse = <T>(rawText: string | undefined): T => {
  if (!rawText || !rawText.trim()) {
    throw new Error("The AI response was empty.");
  }
  try {
    const cleanedText = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
    return JSON.parse(cleanedText) as T;
  } catch (e) {
    console.error("Failed to parse JSON:", rawText);
    throw new Error(
      `The AI returned malformed JSON. Parser error: ${(e as Error).message}`
    );
  }
};

/** Sanitize nested content */
const sanitizeContent = (content: any): any => {
  if (typeof content === "string") return content;
  if (content === null || content === undefined) return "";
  if (typeof content === "object") {
    if ("content" in content && typeof (content as any).content === "string") {
      return (content as any).content;
    }
    if (Array.isArray(content)) {
      return content.map(sanitizeContent);
    }
    for (const key in content) {
      if (typeof content[key] === "string") return content[key];
    }
  }
  return JSON.stringify(content);
};

interface AdminInsightStats {
  totalUsers: number;
  userStats: any[];
  weakestTopics: any[];
}

interface AnalysisResponse {
  summary: string;
  questionAnalysis: QuestionAnalysis[];
  topicPerformance: TopicPerformance[];
}

export const geminiService = {
  // ---------- 1. Generate Test Questions ----------
  async generateTestQuestions(
    testType: TestType,
    numQuestions: number,
    topic?: string,
    difficulty?: "easy" | "medium" | "hard",
    avoidTopics?: string[]
  ): Promise<Question[]> {
    const systemInstruction = `
You are an expert exam creator. 
Create high-quality, exam-level questions with:
- proper difficulty
- topic alignment
- NO arithmetic questions unless explicitly requested
- use passages when needed
- use logical reasoning
- make answer keys correct
`;

    // Build detailed prompt based on test type
    const lowerType = testType.toLowerCase();
    let contextualPrompt = "";

    // SAT Tests
    if (lowerType.includes("sat")) {
      if (lowerType.includes("math") || lowerType.includes("algebra") || lowerType.includes("geometry")) {
        contextualPrompt = `Create ${numQuestions} SAT Math questions. These should be college-level math problems covering:
- Algebra (linear equations, systems, quadratics)
- Problem solving and data analysis
- Advanced math (functions, polynomials, radicals)
- Geometry and trigonometry
Questions should be challenging and require multi-step reasoning. NO basic arithmetic like "6+7".`;

        if (lowerType.includes("algebra")) {
          contextualPrompt += " Focus specifically on algebraic concepts: equations, inequalities, functions, and systems.";
        } else if (lowerType.includes("geometry")) {
          contextualPrompt += " Focus specifically on geometry: shapes, angles, area, volume, coordinate geometry, and trigonometry.";
        }
      } else if (lowerType.includes("reading") || lowerType.includes("writing") || lowerType.includes("rw")) {
        contextualPrompt = `Create ${numQuestions} SAT Reading & Writing questions. Include:
- Reading comprehension with passages from literature, science, or history
- Grammar and usage questions
- Vocabulary in context
- Rhetoric and expression
- Standard English conventions
Provide relevant passages where needed.`;
      } else if (lowerType.includes("diagnostic")) {
        contextualPrompt = `Create ${numQuestions} diagnostic SAT questions covering a broad range:
- Mix of Math (algebra, geometry, data analysis) and Reading/Writing
- Varied difficulty levels to assess student's current level
- Comprehensive coverage of SAT topics`;
      }
    }
    // ACT Tests
    else if (lowerType.includes("act")) {
      if (lowerType.includes("math")) {
        contextualPrompt = `Create ${numQuestions} ACT Math questions covering:
- Pre-algebra and elementary algebra
- Intermediate algebra and coordinate geometry
- Plane geometry and trigonometry
Questions should test mathematical reasoning, NOT basic arithmetic.`;
      } else if (lowerType.includes("science")) {
        contextualPrompt = `Create ${numQuestions} ACT Science questions. These should:
- Include scientific passages with data, graphs, charts, or experimental descriptions
- Test interpretation of scientific information
- Cover biology, chemistry, physics, and earth science concepts
- Require analysis and evaluation of scientific data
Always include relevant passages or data representations.`;
      } else if (lowerType.includes("reading")) {
        contextualPrompt = `Create ${numQuestions} ACT Reading questions with:
- Passages from prose fiction, social science, humanities, or natural science
- Questions testing comprehension, inference, and analysis
- Focus on main ideas, details, sequence, and author's craft
Include complete passages for context.`;
      } else if (lowerType.includes("english") || lowerType.includes("writing")) {
        contextualPrompt = `Create ${numQuestions} ACT English questions testing:
- Grammar and usage
- Punctuation and sentence structure
- Strategy and organization
- Style and rhetoric
Provide passages with underlined portions or specific contexts.`;
      } else if (lowerType.includes("diagnostic")) {
        contextualPrompt = `Create ${numQuestions} diagnostic ACT questions covering:
- Math, Science, Reading, and English sections
- Broad topic coverage to assess overall ACT readiness
- Varied difficulty levels`;
      }
    }
    // AP Tests
    else if (lowerType.includes("ap")) {
      if (lowerType.includes("calculus") || lowerType.includes("calc")) {
        contextualPrompt = `Create ${numQuestions} AP Calculus AB questions covering:
- Limits and continuity
- Derivatives and their applications
- Integrals and their applications
- Fundamental Theorem of Calculus
Questions should be college-level and require deep understanding.`;
      } else if (lowerType.includes("biology")) {
        contextualPrompt = `Create ${numQuestions} AP Biology questions covering:
- Cell structure and function
- Genetics and heredity
- Evolution and ecology
- Molecular biology and biochemistry
Include scientific reasoning and data analysis questions.`;
      } else if (lowerType.includes("chemistry")) {
        contextualPrompt = `Create ${numQuestions} AP Chemistry questions covering:
- Atomic structure and periodicity
- Chemical bonding and molecular structure
- Chemical reactions and stoichiometry
- Thermodynamics and kinetics
Require conceptual understanding and problem-solving.`;
      } else if (lowerType.includes("physics")) {
        contextualPrompt = `Create ${numQuestions} AP Physics 1 questions covering:
- Kinematics and dynamics
- Energy and momentum
- Circular motion and gravitation
- Waves and electricity
Focus on conceptual understanding and application.`;
      } else if (lowerType.includes("history") || lowerType.includes("ush") || lowerType.includes("world")) {
        const historyType = lowerType.includes("world") ? "World History" : "US History";
        contextualPrompt = `Create ${numQuestions} AP ${historyType} questions covering:
- Historical periods and developments
- Causation and continuity
- Historical evidence and interpretation
- Contextualization of events
Include passages or historical documents where appropriate.`;
      } else if (lowerType.includes("literature") || lowerType.includes("lit")) {
        contextualPrompt = `Create ${numQuestions} AP English Literature questions:
- Literary analysis and interpretation
- Poetry and prose comprehension
- Literary devices and techniques
- Thematic analysis
Include passages from literature.`;
      } else if (lowerType.includes("psychology")) {
        contextualPrompt = `Create ${numQuestions} AP Psychology questions covering:
- Biological bases of behavior
- Cognitive processes
- Development and personality
- Social psychology and research methods
Test conceptual understanding and application.`;
      } else if (lowerType.includes("diagnostic")) {
        contextualPrompt = `Create ${numQuestions} diagnostic AP questions covering common AP subjects:
- Mix of STEM and humanities topics
- College-level rigor
- Varied difficulty to assess AP readiness`;
      }
    }
    // Daily/Concept Quiz
    else if (lowerType.includes("quiz")) {
      contextualPrompt = `Create ${numQuestions} quiz questions:
- Mixed topics across math, science, and reasoning
- Engaging and educational
- Appropriate difficulty for daily practice`;
    }
    // Adaptive Tests
    else if (lowerType.includes("adaptive")) {
      if (lowerType.includes("sat")) {
        contextualPrompt = `Create ${numQuestions} adaptive SAT Math questions:
- Start with medium difficulty
- Cover key SAT math topics
- Allow for difficulty adjustment based on performance`;
      } else if (lowerType.includes("act")) {
        contextualPrompt = `Create ${numQuestions} adaptive ACT Math questions:
- Start with medium difficulty
- Cover key ACT math topics
- Allow for difficulty adjustment based on performance`;
      }
    }
    // Fallback for unrecognized types
    else {
      contextualPrompt = `Create ${numQuestions} high-quality academic questions for "${testType}":
- Appropriate difficulty and depth
- Clear and unambiguous
- Correct answer keys`;
    }

    // Add topic focus if specified
    if (topic) {
      contextualPrompt += `\n\nSpecific topic focus: "${topic}". Ensure all questions relate to this topic.`;
    }

    // Add difficulty constraint if specified
    if (difficulty) {
      contextualPrompt += `\n\nDifficulty level: ${difficulty}. Adjust question complexity accordingly.`;
    }

    // Add topics to avoid if specified
    if (avoidTopics?.length) {
      contextualPrompt += `\n\nAvoid these topics: ${avoidTopics.join(", ")}.`;
    }

    const userPrompt = contextualPrompt;

    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction,
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                _id: { type: SchemaType.STRING },
                questionText: { type: SchemaType.STRING },
                options: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                correctAnswerIndex: { type: SchemaType.NUMBER },
                explanation: { type: SchemaType.STRING },
                topic: { type: SchemaType.STRING },
                difficulty: { type: SchemaType.STRING },
                passage: { type: SchemaType.STRING },
              },
              required: ["_id", "questionText", "options", "correctAnswerIndex", "explanation", "topic"],
            },
          },
        },
      });

      const result = parseJsonResponse<any[]>(response.response.text());

      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("AI returned an empty or invalid list of questions.");
      }

      return result.map((q: any, i: number): Question => ({
        _id: q._id || uuidv4(),
        questionText: sanitizeContent(q.questionText),
        options: q.options.map(sanitizeContent),
        correctAnswerIndex:
          typeof q.correctAnswerIndex === "number" &&
            q.correctAnswerIndex >= 0 &&
            q.correctAnswerIndex < q.options.length
            ? q.correctAnswerIndex
            : 0,
        explanation: sanitizeContent(q.explanation) || "No explanation provided.",
        topic: sanitizeContent(q.topic) || "General",
        difficulty: q.difficulty,
        passage: sanitizeContent(q.passage),
      }));
    } catch (error) {
      throw mapGeminiError(error, "generating test questions");
    }
  },

  // ---------- 2. Analyze Test Results ----------
  async analyzeTestResults(
    testResult: Partial<ITestResult>
  ): Promise<AnalysisResponse> {
    if (!testResult.questions || !testResult.answers) {
      throw new Error("Questions & answers required.");
    }

    const analysisPayload = testResult.questions.map((q) => {
      const userAnswer = testResult.answers!.find((ua) => ua.questionId === q._id);
      return {
        question: q.questionText,
        correctAnswer: q.options[q.correctAnswerIndex],
        userAnswer: userAnswer ? q.options[userAnswer.answerIndex] : "Not answered",
        topic: q.topic,
      };
    });

    const prompt = `Analyze test results: ${JSON.stringify(analysisPayload)}`;

    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const response = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              summary: { type: SchemaType.STRING },
              questionAnalysis: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    questionText: { type: SchemaType.STRING },
                    userAnswer: { type: SchemaType.STRING },
                    correctAnswer: { type: SchemaType.STRING },
                    isCorrect: { type: SchemaType.BOOLEAN },
                    explanation: { type: SchemaType.STRING },
                    topic: { type: SchemaType.STRING },
                    questionType: { type: SchemaType.STRING },
                  },
                  required: ["questionText", "userAnswer", "correctAnswer", "isCorrect", "explanation", "topic"],
                },
              },
              topicPerformance: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    topic: { type: SchemaType.STRING },
                    correct: { type: SchemaType.NUMBER },
                    total: { type: SchemaType.NUMBER },
                  },
                  required: ["topic", "correct", "total"],
                },
              },
            },
            required: ["summary", "questionAnalysis", "topicPerformance"],
          },
        },
      });

      const result = parseJsonResponse<any>(response.response.text());

      return {
        summary: sanitizeContent(result.summary),
        questionAnalysis: (result.questionAnalysis || []).map((qa: any) => ({
          questionText: sanitizeContent(qa.questionText),
          userAnswer: sanitizeContent(qa.userAnswer),
          correctAnswer: sanitizeContent(qa.correctAnswer),
          isCorrect: !!qa.isCorrect,
          explanation: sanitizeContent(qa.explanation),
          topic: sanitizeContent(qa.topic),
          questionType: sanitizeContent(qa.questionType),
        })),
        topicPerformance: (result.topicPerformance || []).map((tp: any) => ({
          topic: sanitizeContent(tp.topic),
          correct: tp.correct ?? 0,
          total: tp.total ?? 1,
        })),
      };
    } catch (error) {
      throw mapGeminiError(error, "analyzing your test results");
    }
  },

  // ---------- 3. Generate Learning Plan ----------
  async generateLearningPlan(goal: ExamGoal, result: ITestResult): Promise<Plan> {
    const sortedTopics = [...result.topicPerformance].sort((a, b) => {
      const accA = a.total ? a.correct / a.total : 0;
      const accB = b.total ? b.correct / b.total : 0;
      return accA - accB;
    });

    const weakest = sortedTopics.slice(0, 5).map((t) => t.topic);

    let weeksCount = 8;
    if (goal.examDate) {
      const examTime = Date.parse(goal.examDate);
      const now = Date.now();
      const diff = Math.max(7, Math.round((examTime - now) / 86400000));
      weeksCount = Math.min(12, Math.max(4, Math.ceil(diff / 7)));
    }

    const today = new Date();
    const weeks: PlanWeek[] = [];

    const pickMini = () => {
      if (goal.exam === Exam.SAT) return TestType.SAT_RW_MOCK;
      if (goal.exam === Exam.ACT) return TestType.ACT_READING_MOCK;
      if (goal.exam === Exam.AP) return TestType.AP_USH_MOCK;
      return result.testType as TestType;
    };

    const miniType = pickMini();

    for (let i = 0; i < weeksCount; i++) {
      const start = new Date(today);
      start.setDate(start.getDate() + i * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);

      const topic = weakest[i % weakest.length] || "General";

      const steps: PlanStep[] = [
        {
          _id: uuidv4(),
          title: "Learn core concepts",
          description: `Study key ideas for ${topic}.`,
          type: "concept" as const,
          topic,
          completed: false,
          estimatedTime: "~30 mins",
        },
        {
          _id: uuidv4(),
          title: "Practice questions",
          description: `Solve focused questions on ${topic}.`,
          type: "review" as const,
          topic,
          completed: false,
          estimatedTime: "~25 mins",
        },
        {
          _id: uuidv4(),
          title: "Mini test",
          description: "Take a short timed quiz.",
          type: "test" as const,
          relatedTestType: miniType,
          completed: false,
          estimatedTime: "~20 mins",
        },
      ];

      weeks.push({
        week: i + 1,
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        summary: `Focus on ${topic} and timed practice.`,
        steps,
      });
    }

    return {
      _id: uuidv4(),
      generatedOn: new Date().toISOString(),
      goal,
      weeks,
    };
  },

  // ---------- 4. Streaming Chat ----------
  async getAiceyResponseStream(chatHistory: ChatMessage[], context?: string) {
    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.0-flash",
        systemInstruction: `You are Aicey, a friendly AI tutor. ${context ? `User context: ${context}` : ""}`,
      });

      return await model.generateContentStream({
        contents: chatHistory.map((m) => ({
          role: (m.role as string) === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      });
    } catch (error) {
      throw mapGeminiError(error, "chatting with Aicey");
    }
  },

  // ---------- 5. Admin Insights ----------
  async getAdminInsights(stats: AdminInsightStats) {
    const prompt = `
Analyze platform data (under 150 words):
- Total Users: ${stats.totalUsers}
- User Stats: ${JSON.stringify(stats.userStats)}
- Weakest Topics: ${JSON.stringify(stats.weakestTopics)}
`;

    try {
      const model = ai.getGenerativeModel({
        model: "gemini-2.0-flash",
      });

      const response = await model.generateContent(prompt);
      return response.response.text();
    } catch (error) {
      throw mapGeminiError(error, "generating admin insights");
    }
  },
};
