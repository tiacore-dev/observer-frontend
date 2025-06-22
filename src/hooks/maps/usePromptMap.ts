// src/hooks/maps/usePromptMap.ts
import { usePromptsQuery } from "../prompts/usePromptsQuery";
import { useMemo } from "react";

export const usePromptMap = (company_id?: string) => {
  const { data: promptsData, isLoading: isLoadingPromptMap } = usePromptsQuery(
    company_id !== undefined ? company_id : undefined
  );

  const promptMap = useMemo(() => {
    const map = new Map<string, string>();
    promptsData?.prompts?.forEach((prompt) => {
      map.set(prompt.prompt_id, prompt.prompt_name);
    });
    return map;
  }, [promptsData]);
  return { promptMap, isLoadingPromptMap };
};
