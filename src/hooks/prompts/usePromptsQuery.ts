import { useQuery } from "@tanstack/react-query";
import {
  fetchPromptDetails,
  fetchPrompts,
  IPrompt,
} from "../../api/promptsApi";

interface IPromptsResponse {
  total: number;
  prompts: IPrompt[];
}

export const usePromptsQuery = () => {
  return useQuery<IPromptsResponse>({
    queryKey: ["prompts"],
    queryFn: () => fetchPrompts(),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePromptDetailsQuery = (prompt_id: string) => {
  return useQuery({
    queryKey: ["promptDetails", prompt_id],
    queryFn: () => fetchPromptDetails(prompt_id),
    staleTime: 5 * 60 * 1000,
    // retry: false,
  });
};
