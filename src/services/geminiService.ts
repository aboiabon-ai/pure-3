/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI } from "@google/genai";
import { ExerciseSet } from "../types";

// Initialize with the API key from environment
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

const SYSTEM_PROMPT = `Act as a Pure Mathematics tutor for A-Level students. 
You are generating exercise sets strictly based on the content, exercises, and syllabus of the "Cambridge International AS & A Level Mathematics: Pure Mathematics 2 & 3 Coursebook".

STRICT RULES:
1. STRICT SYLLABUS ADHERENCE: Only include concepts covered in the specific chapter of this book.
2. NESTED PROBLEMS: Questions often have parts (i), (ii), etc., where earlier results help solve later ones. This is encouraged.
3. MATHEMATICAL ACCURACY: Ensure all numerical values and calculations are precise.
4. DIFFICULTY PROFILE (10 questions total):
   - 6 Standard: Mid-chapter multi-step problems.
   - 4 Challenge: End-of-chapter review or cross-topic review questions with higher marks.

FORMATTING:
- Use LaTeX for ALL math (e.g., $x^2$, \\int f(x) dx). Double mask backslashes in JSON strings.
- Provide a detailed "solutionSteps" array showing the pedagogical breakdown.
- Include a "finalAnswer" for quick checking.

CHAPTER LIST:
1. Algebra (Modulus, Graphs of |f(x)|, Modulus inequalities, Division of polynomials, Factor/Remainder theorem)
2. Logarithmic and Exponential Functions (Laws of logs, Solving equations/inequalities, Transforming to linear form)
3. Trigonometry (Cosec, sec, cot, Compound/Double angle formulae, Rsin(theta+alpha))
4. Differentiation (Product/Quotient rule, Derivatives of exp/log/trig functions, Implicit/Parametric differentiation)
5. Integration (Integration of exp, 1/(ax+b), sin/cos/sec^2, Trapezium rule)
6. Numerical Solutions of Equations (Root location via sign change, Iterative processes x_{n+1} = f(x_n), Staircase/Cobweb diagrams. NOTE: Newton-Raphson is NOT in the syllabus for this book.)
7. Further Algebra (Partial fractions, Binomial expansion)
8. Further Calculus (Derivative of tan^-1, Integration of 1/(x^2+a^2), Integration by parts/substitution)
9. Vectors (Position vectors, Vector equation of a line, Scalar product)
10. Differential Equations (Separating variables, Forming DE from problem)
11. Complex Numbers (Cartesian/Polar/Exponential forms, Argand diagrams, Square roots of complex numbers, Loci including perpendicular bisectors and circles, solving equations with complex roots.)

SPECIFIC CHAPTER NOTES:
- Chapter 3: Raise difficulty for questions 1-3. Do not include simple evaluations. Focus on "Prove Identity then Solve Equation" multi-part questions (e.g., provepart, hence solve equation for 4-6 marks).
- Chapter 6: Do NOT use Newton-Raphson. Always use x_{n+1} = F(x_n) iterative formulas.
- Chapter 11: Focus on the geometry of Argand diagrams. For locus questions, do NOT require finding the Cartesian equation. Instead, ask students to sketch the locus (or loci, combine 1 or 2 loci for higher difficulty) and determine the GREATEST or LEAST modulus $|z|$ or argument $\arg z$ using geometric properties (e.g., distance from origin to circle, tangent from origin to circle). Include square roots of complex numbers and roots of polynomials as well.
`;

export async function generateExercise(chapterId: number, chapterTitle: string): Promise<ExerciseSet> {
  const prompt = `Generate a 10-question exercise set for Chapter ${chapterId}: ${chapterTitle}.
Ensure strict adherence to the Cambridge syllabus and book context. 
Multi-part questions (e.g., part a for 2 marks, part b for 3 marks) are highly requested.

Format the response as JSON with this structure:
{
  "chapter": ${chapterId},
  "chapterTitle": "${chapterTitle}",
  "questions": [
    {
      "id": 1,
      "text": "Question text with parts (i), (ii) if applicable.",
      "marks": number,
      "difficulty": "medium" | "hard",
      "type": "Standard" | "Challenge" | "Proof" | "Modelling",
      "solutionSteps": [
        { "stepNumber": 1, "explanation": "Detailed textual explanation", "mathContent": "Step result in $LaTeX$" }
      ],
      "finalAnswer": "Concise final result"
    }
  ],
  "tip": "Tip for hardest question"
}`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\n" + prompt }] }],
      config: { responseMimeType: "application/json" }
    });

    // The new SDK returns response.candidates[0].content.parts[0].text or similar
    // Based on the example in types:
    // @ts-ignore
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || "";
    return JSON.parse(text) as ExerciseSet;
  } catch (error) {
    console.error("Error generating exercise:", error);
    throw error;
  }
}
