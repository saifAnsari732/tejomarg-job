import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, resumeText, jobDescription, userDetails, action, jobTitle, skills, question, userAnswer, count, existingQuestions } = body;
    const questionCount = typeof count === "number" && count > 0 ? count : 10;
    // Normalize existing question texts to a Set for fast dedup lookup
    const existingSet: Set<string> = new Set(
      Array.isArray(existingQuestions) ? existingQuestions.map((q: string) => q.trim().toLowerCase()) : []
    );
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey.startsWith("AQ.MockKey")) {
      // Mock Response Mode if API Key is not set or placeholder
      if (type === "cover-letter") {
        return NextResponse.json({
          result: `[Mock Cover Letter - Set a valid GEMINI_API_KEY in .env.local to use Live AI]

Dear Hiring Team,

I am writing to express my strong interest in the open position at your company. Based on my experience in building responsive web applications and clean UI designs, I am confident I would be a great fit.

I have worked with Next.js, React, and modern CSS/Tailwind technologies. I am excited to apply my skills to help your team achieve its goals.

Thank you for your time and consideration.

Best regards,
${userDetails?.name || "Applicant"}`
        });
      } else if (type === "job-prep") {
        const mockPool = [
          {
            question: "What is the primary difference between Next.js Server Components and Client Components?",
            options: [
              "Server Components render on the browser; Client Components render on the server.",
              "Server Components render exclusively on the server and send zero JS to the client; Client Components are hydrated on the browser for interactivity.",
              "Server Components cannot fetch data from databases; Client Components can.",
              "Server Components support React hooks like useState, while Client Components do not."
            ],
            correctAnswerIdx: 1,
            explanation: "Server Components run on the server and do not ship runtime JS to the client. Client Components ('use client') run on both server and client, allowing browser hooks and interaction."
          },
          {
            question: "Which hook memoizes the computed value of an expensive calculation in React?",
            options: ["useCallback", "useEffect", "useMemo", "useRef"],
            correctAnswerIdx: 2,
            explanation: "useMemo caches the result of a function calculation between renders, whereas useCallback memoizes the callback function itself."
          },
          {
            question: "How does the 'key' prop help React in handling list items?",
            options: [
              "It applies styling attributes dynamically.",
              "It helps React identify which items have changed, been added, or been removed in a list.",
              "It links list items to global context parameters.",
              "It forces list items to render synchronously."
            ],
            correctAnswerIdx: 1,
            explanation: "Keys provide stable identities to elements in a list, enabling React's reconciliation algorithm to efficiently update elements."
          },
          {
            question: "In Next.js, which folder convention represents dynamic routing for an ID parameter?",
            options: ["app/posts/[id]/page.tsx", "app/posts/id/page.tsx", "app/posts/(id)/page.tsx", "app/posts/_id/page.tsx"],
            correctAnswerIdx: 0,
            explanation: "Next.js uses square brackets `[parameter]` for dynamic routes. Thus, `[id]` maps variables dynamically to params."
          },
          {
            question: "What does the MongoDB 'explain()' method accomplish?",
            options: [
              "It auto-generates documentation for the collection.",
              "It provides query execution statistics, listing whether it utilized index scans (IXSCAN) or collection scans (COLLSCAN).",
              "It automatically indexes all fields in the collection.",
              "It prints out schema validation errors."
            ],
            correctAnswerIdx: 1,
            explanation: "explain() returns details about query execution plans, which helps identify slow operations and check if appropriate indexing is being utilized."
          },
          {
            question: "What is the purpose of React.memo()?",
            options: [
              "It memorizes the return value of async API calls.",
              "It prevents a functional component from re-rendering if its props have not changed.",
              "It stores a mutable value without triggering a re-render.",
              "It creates a memoized selector for Redux state."
            ],
            correctAnswerIdx: 1,
            explanation: "React.memo is a higher-order component that wraps a functional component. If the props haven't changed, React skips re-rendering and reuses the previous render output."
          },
          {
            question: "Which CSS property enables a flex container to wrap its children to new lines?",
            options: ["flex-direction: column", "align-items: wrap", "flex-wrap: wrap", "overflow: hidden"],
            correctAnswerIdx: 2,
            explanation: "flex-wrap: wrap tells the flex container to wrap children onto multiple lines when they exceed the container width, instead of shrinking them."
          },
          {
            question: "In TypeScript, what is the difference between 'interface' and 'type'?",
            options: [
              "Interfaces can only describe objects; types can only describe primitives.",
              "Types support declaration merging; interfaces do not.",
              "Interfaces support declaration merging and can be extended; types use intersection (&) to extend and cannot be re-opened.",
              "There is no practical difference between interface and type in modern TypeScript."
            ],
            correctAnswerIdx: 2,
            explanation: "Interfaces can be merged and extended with 'extends'. Types use intersection types (&) and cannot be re-declared to add new fields once defined."
          },
          {
            question: "What does the 'useRef' hook primarily solve in React?",
            options: [
              "It subscribes to context changes without causing re-renders.",
              "It persists a mutable value across renders without triggering a re-render, and can reference DOM elements directly.",
              "It debounces expensive state updates.",
              "It replaces useState for complex state objects."
            ],
            correctAnswerIdx: 1,
            explanation: "useRef returns a mutable ref object whose .current property persists for the full lifetime of the component. Mutating .current does NOT cause a re-render."
          },
          {
            question: "Which HTTP status code indicates that a resource was successfully created?",
            options: ["200 OK", "204 No Content", "201 Created", "301 Moved Permanently"],
            correctAnswerIdx: 2,
            explanation: "HTTP 201 Created is the correct status code returned when a POST request successfully creates a new resource on the server."
          },
          {
            question: "What is the role of the 'useContext' hook in React?",
            options: [
              "It creates a new global Redux store.",
              "It subscribes a component to a React Context, providing access to shared values without prop drilling.",
              "It persists a value to localStorage automatically.",
              "It manages server-side rendered props."
            ],
            correctAnswerIdx: 1,
            explanation: "useContext accepts a context object created by React.createContext and returns the current context value, enabling components deep in the tree to access shared state."
          },
          {
            question: "What is a race condition in asynchronous JavaScript?",
            options: [
              "When two functions return the same value simultaneously.",
              "When two or more async operations complete in an unpredictable order, causing inconsistent behavior.",
              "When a Promise is rejected before it resolves.",
              "When setTimeout runs before a synchronous function finishes."
            ],
            correctAnswerIdx: 1,
            explanation: "A race condition occurs when the outcome of multiple async operations depends on the order they complete, which can be non-deterministic and lead to bugs."
          },
          {
            question: "In Next.js App Router, what is the purpose of 'loading.tsx'?",
            options: [
              "It defines error boundary fallbacks for an entire route segment.",
              "It wraps the route segment children in a Suspense boundary, showing a loading UI while the segment is fetching data.",
              "It provides SEO metadata for each route.",
              "It pre-renders the route at build time."
            ],
            correctAnswerIdx: 1,
            explanation: "loading.tsx automatically wraps page.tsx and its children in a React Suspense boundary. The component exported from loading.tsx is rendered while the route segment's data is loading."
          },
          {
            question: "What is event bubbling in the browser DOM?",
            options: [
              "An event that fires only on the document root element.",
              "A mechanism where an event on a child element propagates up through its ancestor elements in the DOM tree.",
              "An event that is canceled before it reaches its target.",
              "A pattern where child components emit events that bubble into parent React components."
            ],
            correctAnswerIdx: 1,
            explanation: "Event bubbling means that after an event fires on the target element, it propagates upward through all its ancestors. Use event.stopPropagation() to prevent this."
          },
          {
            question: "Which git command resets the current HEAD to a specified commit, discarding all changes?",
            options: ["git revert HEAD", "git stash", "git reset --hard <commit>", "git checkout -b <branch>"],
            correctAnswerIdx: 2,
            explanation: "git reset --hard moves HEAD to the target commit and discards all changes in the working directory and staging area. It is destructive and cannot be undone easily."
          }
        ];
        // Filter out any questions that have already been shown
        const freshPool = mockPool.filter(q => !existingSet.has(q.question.trim().toLowerCase()));
        // Shuffle freshPool for variety
        for (let i = freshPool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [freshPool[i], freshPool[j]] = [freshPool[j], freshPool[i]];
        }
        // Return up to questionCount unique questions
        const result = freshPool.slice(0, questionCount);
        return NextResponse.json(result);
      } else {
        return NextResponse.json({
          score: 78,
          strengths: [
            "Good match for frontend technologies (React, Next.js)",
            "Clear timeline and experience structure",
            "Modern technical layout"
          ],
          weaknesses: [
            "Missing specific database experience details",
            "Could describe past projects with quantitative metrics (e.g. % performance increase)",
            "Lacks explicit mention of state management tools"
          ],
          recommendations: "Add measurable achievements to your work experiences. Highlight state management libraries (like Redux or Zustand) and database skills to better match the target job description."
        });
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Helper to attempt generation with fallback models
    const generateWithFallback = async (promptText: string) => {
      const modelsToTry = ["gemini-1.5-flash", "gemini-pro", "gemini-1.5-pro", "gemini-1.0-pro"];
      let lastError = null;

      for (const modelName of modelsToTry) {
        try {
          console.log(`Attempting content generation with model: ${modelName}`);
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(promptText);
          if (result && result.response) {
            const text = result.response.text();
            if (text) return text;
          }
        } catch (err: any) {
          console.warn(`Model ${modelName} failed:`, err.message || err);
          lastError = err;
          // Continue to next model if it's a 404 or model not found error
        }
      }
      throw lastError || new Error("All generative models failed to respond");
    };

    try {
      if (type === "cover-letter") {
        const prompt = `Write a professional, personalized cover letter for a job.
Candidate Details:
- Name: ${userDetails?.name || "Applicant"}
- Key Experience: ${userDetails?.experience || "Developer"}
- Key Skills: ${userDetails?.skills || "React, Next.js"}

Job Description:
${jobDescription || "Software developer position"}

Write the cover letter in a clean, modern, professional tone. Ensure it has a standard cover letter structure with appropriate greetings, intro, body highlighting match of candidate's skills, and a formal closing.`;
        
        const textResponse = await generateWithFallback(prompt);
        return NextResponse.json({ result: textResponse });
      } else if (type === "resume-checker") {
        const prompt = `Analyze the candidate's resume text against the target job description. Output your response STRICTLY as a valid JSON object containing:
1. "score" (a number between 0 and 100 representing how well the resume matches the job description)
2. "strengths" (an array of 2 to 4 key matches/strengths)
3. "weaknesses" (an array of 2 to 4 key gaps/areas of improvement)
4. "recommendations" (a short paragraph of actionable advice)

Resume Text:
${resumeText}

Job Description:
${jobDescription}

Ensure you output ONLY the raw JSON object, without any markdown formatting tags like \`\`\`json. Valid JSON output template:
{
  "score": 80,
  "strengths": ["...", "..."],
  "weaknesses": ["...", "..."],
  "recommendations": "..."
}`;
        
        const textResponse = await generateWithFallback(prompt);
        const text = textResponse.trim();
        
        // Attempt to parse text, strip markdown block formatting if present
        let cleanedText = text;
        if (text.startsWith("```")) {
          const jsonStart = text.indexOf("{");
          const jsonEnd = text.lastIndexOf("}") + 1;
          cleanedText = text.substring(jsonStart, jsonEnd);
        }
        
        const data = JSON.parse(cleanedText);
        return NextResponse.json(data);
      } else if (type === "job-prep") {
        const avoidSection = existingSet.size > 0
          ? `\n\nIMPORTANT: Do NOT repeat or rephrase any of these already-asked questions:\n${[...existingSet].map((q, i) => `${i + 1}. ${q}`).join("\n")}`
          : "";
        const prompt = `Generate exactly ${questionCount} highly relevant and specific Multiple Choice Questions (MCQs) for a ${jobTitle} role. Key skills expected: ${skills || "general software engineering"}.${avoidSection}
Output your response STRICTLY as a valid JSON array containing exactly ${questionCount} question objects. Each object MUST contain:
1. "question" (string: the question text)
2. "options" (array of exactly 4 strings representing options A, B, C, and D)
3. "correctAnswerIdx" (number: index of the correct option, 0 to 3)
4. "explanation" (string: a concise but thorough explanation of why the correct option is right)

Ensure all ${questionCount} questions are brand new, unique, cover different sub-topics, and are deeply relevant to the role. Output ONLY the raw JSON array, without any markdown formatting tags like \`\`\`json.`;
        const textResponse = await generateWithFallback(prompt);
        const text = textResponse.trim();
        let cleanedText = text;
        if (text.startsWith("```")) {
          const jsonStart = text.indexOf("[");
          const jsonEnd = text.lastIndexOf("]") + 1;
          cleanedText = text.substring(jsonStart, jsonEnd);
        }
        const data = JSON.parse(cleanedText);
        return NextResponse.json(data);
      }
    } catch (aiError: any) {
      console.warn("Gemini API call failed. Falling back to Mock Demo response. Error details:", aiError.message || aiError);
      
      // Fallback Mock Responses when API key fails with support/authentication errors
      if (type === "cover-letter") {
        return NextResponse.json({
          result: `[Gemini API Key Offline - Running in Resilient Mock Mode]

Dear Hiring Team,

I am writing to express my strong interest in the open position at your company. Based on my experience in building responsive web applications and clean UI designs, I am confident I would be a great fit.

I have worked with Next.js, React, and modern CSS/Tailwind technologies. I am excited to apply my skills to help your team achieve its goals.

Thank you for your time and consideration.

Best regards,
${userDetails?.name || "Applicant"}`
        });
      } else if (type === "job-prep") {
        // Reuse same mock pool from above (API key offline fallback)
        const fallbackPool = [
          { question: "What is the primary difference between Next.js Server Components and Client Components?", options: ["Server Components render on the browser; Client Components render on the server.", "Server Components render exclusively on the server and send zero JS to the client; Client Components are hydrated on the browser for interactivity.", "Server Components cannot fetch data from databases; Client Components can.", "Server Components support React hooks like useState, while Client Components do not."], correctAnswerIdx: 1, explanation: "Server Components run on the server and do not ship runtime JS to the client. Client Components ('use client') run on both server and client, allowing browser hooks and interaction." },
          { question: "Which hook memoizes the computed value of an expensive calculation in React?", options: ["useCallback", "useEffect", "useMemo", "useRef"], correctAnswerIdx: 2, explanation: "useMemo caches the result of a function calculation between renders, whereas useCallback memoizes the callback function itself." },
          { question: "How does the 'key' prop help React in handling list items?", options: ["It applies styling attributes dynamically.", "It helps React identify which items have changed, been added, or been removed in a list.", "It links list items to global context parameters.", "It forces list items to render synchronously."], correctAnswerIdx: 1, explanation: "Keys provide stable identities to elements in a list, enabling React's reconciliation algorithm to efficiently update elements." },
          { question: "In Next.js, which folder convention represents dynamic routing for an ID parameter?", options: ["app/posts/[id]/page.tsx", "app/posts/id/page.tsx", "app/posts/(id)/page.tsx", "app/posts/_id/page.tsx"], correctAnswerIdx: 0, explanation: "Next.js uses square brackets `[parameter]` for dynamic routes." },
          { question: "What does the MongoDB 'explain()' method accomplish?", options: ["It auto-generates documentation for the collection.", "It provides query execution statistics, listing whether it utilized index scans (IXSCAN) or collection scans (COLLSCAN).", "It automatically indexes all fields in the collection.", "It prints out schema validation errors."], correctAnswerIdx: 1, explanation: "explain() returns details about query execution plans, which helps identify slow operations." },
          { question: "What is the purpose of React.memo()?", options: ["It memorizes the return value of async API calls.", "It prevents a functional component from re-rendering if its props have not changed.", "It stores a mutable value without triggering a re-render.", "It creates a memoized selector for Redux state."], correctAnswerIdx: 1, explanation: "React.memo wraps a functional component and skips re-rendering if props haven't changed." },
          { question: "Which CSS property enables a flex container to wrap its children to new lines?", options: ["flex-direction: column", "align-items: wrap", "flex-wrap: wrap", "overflow: hidden"], correctAnswerIdx: 2, explanation: "flex-wrap: wrap tells the flex container to wrap children onto multiple lines when they exceed the container width." },
          { question: "In TypeScript, what is the difference between 'interface' and 'type'?", options: ["Interfaces can only describe objects; types can only describe primitives.", "Types support declaration merging; interfaces do not.", "Interfaces support declaration merging and can be extended; types use intersection (&) to extend and cannot be re-opened.", "There is no practical difference between interface and type in modern TypeScript."], correctAnswerIdx: 2, explanation: "Interfaces can be merged and extended with 'extends'. Types use intersection types (&) and cannot be re-declared." },
          { question: "What does the 'useRef' hook primarily solve in React?", options: ["It subscribes to context changes without causing re-renders.", "It persists a mutable value across renders without triggering a re-render, and can reference DOM elements directly.", "It debounces expensive state updates.", "It replaces useState for complex state objects."], correctAnswerIdx: 1, explanation: "useRef returns a mutable ref object whose .current property persists for the full lifetime of the component without causing re-renders." },
          { question: "Which HTTP status code indicates that a resource was successfully created?", options: ["200 OK", "204 No Content", "201 Created", "301 Moved Permanently"], correctAnswerIdx: 2, explanation: "HTTP 201 Created is the correct status code returned when a POST request successfully creates a new resource." },
          { question: "What is the role of the 'useContext' hook in React?", options: ["It creates a new global Redux store.", "It subscribes a component to a React Context, providing access to shared values without prop drilling.", "It persists a value to localStorage automatically.", "It manages server-side rendered props."], correctAnswerIdx: 1, explanation: "useContext accepts a context object and returns the current context value, enabling components deep in the tree to access shared state." },
          { question: "What is event bubbling in the browser DOM?", options: ["An event that fires only on the document root element.", "A mechanism where an event on a child element propagates up through its ancestor elements in the DOM tree.", "An event that is canceled before it reaches its target.", "A pattern where child components emit events that bubble into parent React components."], correctAnswerIdx: 1, explanation: "Event bubbling means that after an event fires on the target element, it propagates upward through all its ancestors." },
          { question: "Which git command resets the current HEAD to a specified commit, discarding all changes?", options: ["git revert HEAD", "git stash", "git reset --hard <commit>", "git checkout -b <branch>"], correctAnswerIdx: 2, explanation: "git reset --hard moves HEAD to the target commit and discards all changes in the working directory and staging area." },
          { question: "In Next.js App Router, what is the purpose of 'loading.tsx'?", options: ["It defines error boundary fallbacks for an entire route segment.", "It wraps the route segment children in a Suspense boundary, showing a loading UI while the segment is fetching data.", "It provides SEO metadata for each route.", "It pre-renders the route at build time."], correctAnswerIdx: 1, explanation: "loading.tsx automatically wraps page.tsx in a React Suspense boundary. The component is rendered while the route segment's data is loading." },
          { question: "What is a race condition in asynchronous JavaScript?", options: ["When two functions return the same value simultaneously.", "When two or more async operations complete in an unpredictable order, causing inconsistent behavior.", "When a Promise is rejected before it resolves.", "When setTimeout runs before a synchronous function finishes."], correctAnswerIdx: 1, explanation: "A race condition occurs when the outcome of multiple async operations depends on the order they complete, which can be non-deterministic." }
        ];
        const freshFallback = fallbackPool.filter(q => !existingSet.has(q.question.trim().toLowerCase()));
        for (let i = freshFallback.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [freshFallback[i], freshFallback[j]] = [freshFallback[j], freshFallback[i]];
        }
        const fallbackResult = freshFallback.slice(0, questionCount);
        return NextResponse.json(fallbackResult);
      } else {
        return NextResponse.json({
          score: 82,
          strengths: [
            "Good match for frontend technologies (React, Next.js)",
            "Clear timeline and experience structure",
            "Modern technical layout"
          ],
          weaknesses: [
            "Missing specific database experience details",
            "Could describe past projects with quantitative metrics (e.g. % performance increase)",
            "Lacks explicit mention of state management tools"
          ],
          recommendations: "Add measurable achievements to your work experiences. Highlight state management libraries (like Redux or Zustand) and database skills to better match the target job description."
        });
      }
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse AI output" }, { status: 500 });
  }
}
