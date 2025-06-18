import { useQuery } from "@tanstack/react-query";
import {
  fetchPromptDetails,
  fetchPrompts,
  IPrompt,
} from "../../api/promptsApi";
import { useAuth } from "../../context/authContext";

interface IPromptsResponse {
  total: number;
  prompts: IPrompt[];
}

export const usePromptsQuery = () => {
  const { selectedCompanyId } = useAuth();

  return useQuery<IPromptsResponse>({
    queryKey: ["prompts", selectedCompanyId],
    queryFn: () => fetchPrompts(selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};

export const usePromptDetailsQuery = (prompt_id: string) => {
  const { selectedCompanyId } = useAuth();

  return useQuery({
    queryKey: ["promptDetails", prompt_id, selectedCompanyId],
    queryFn: () => fetchPromptDetails(prompt_id, selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false, // Отключает повторные попытки
  });
};
