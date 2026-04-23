import { useState } from "react";
import { CohortAnalytics } from "./components/CohortAnalytics";
import { CohortTable } from "./components/CohortTable";
import { StudentDeepDive } from "./components/StudentDeepDive";

type Screen = "cohort" | "student" | "analytics";

export default function App() {
  const [activeScreen, setActiveScreen] = useState<Screen>("cohort");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  function handleSelectStudent(id: string) {
    setSelectedStudentId(id);
    setActiveScreen("student");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl font-bold text-indigo-700">FLI Scorecard</span>
              <span className="hidden text-sm text-gray-400 sm:block">|</span>
              <span className="hidden text-sm text-gray-500 sm:block">
                Spring 2026 - Brownsville
              </span>
            </div>
            <nav className="flex gap-1">
              {(["cohort", "student", "analytics"] as Screen[]).map((screen) => (
                <button
                  key={screen}
                  type="button"
                  onClick={() => setActiveScreen(screen)}
                  className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    activeScreen === screen
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {screen === "cohort"
                    ? "Cohort"
                    : screen === "student"
                    ? "Student"
                    : "Analytics"}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {activeScreen === "cohort" && (
          <CohortTable onSelectStudent={handleSelectStudent} />
        )}
        {activeScreen === "student" && (
          <StudentDeepDive
            studentId={selectedStudentId}
            onBackToCohort={() => setActiveScreen("cohort")}
          />
        )}
        {activeScreen === "analytics" && (
          <CohortAnalytics />
        )}
      </main>
    </div>
  );
}
