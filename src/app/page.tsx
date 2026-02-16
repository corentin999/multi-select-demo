"use client";
import { MultiSelect } from "./components/MultiSelect";
import { useEffect, useState } from "react";

// languages.ts (ou directement dans ton composant)
export const languageOptions: { label: string; value: string }[] = [
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Python", value: "python" },
    { label: "Java", value: "java" },
    { label: "C", value: "c" },
    { label: "C++", value: "cpp" },
    { label: "C#", value: "csharp" },
    { label: "Go", value: "go" },
    { label: "Rust", value: "rust" },
    { label: "PHP", value: "php" },
    { label: "Ruby", value: "ruby" },
    { label: "Kotlin", value: "kotlin" },
    { label: "Swift", value: "swift" },
    { label: "Dart", value: "dart" },
    { label: "Scala", value: "scala" },
    { label: "R", value: "r" },
    { label: "SQL", value: "sql" },
    { label: "Bash", value: "bash" },
];


export default function Home() {

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {console.log("Selected values:", selectedValues); }, [selectedValues]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-row justify-center p-4">
      <div className="w-80">
        <MultiSelect label="Langages maîtrisés" placeholder="Cherchez vos langages" options={languageOptions} selectedValues={selectedValues} onChange={setSelectedValues}/>
      </div>
    </div>
  );
}
