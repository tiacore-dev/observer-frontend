// src/hooks/maps/usePromptMap.ts
import { usePromptsQuery } from "../prompts/usePromptsQuery";
import { useMemo } from "react";

export const usePromptMap = () => {
  const { data: promptsData } = usePromptsQuery();

  const promptMap = useMemo(() => {
    const map = new Map<string, string>();
    promptsData?.prompts?.forEach((prompt) => {
      map.set(prompt.prompt_id, prompt.prompt_name);
    });
    return map;
  }, [promptsData]);

  return promptMap;
};
