import { useEffect, useRef } from "react";

interface BlockEditorProps {
  generatedText: string;
  onCopy: (getText: () => string) => void;
}

export function BlockEditor({ generatedText, onCopy }: BlockEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    onCopy(() => ref.current?.value ?? "");
  }, [onCopy]);

  return (
    <textarea
      ref={ref}
      defaultValue={generatedText}
      className="h-full w-full resize-none rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-400"
      spellCheck={false}
    />
  );
}
