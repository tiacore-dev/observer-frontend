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

export const usePromptsQuery = (company_id?: string) => {
  const { selectedCompanyId } = useAuth();
  const user_id = localStorage.getItem("user_id");

  return useQuery<IPromptsResponse>({
    queryKey: ["prompts", company_id || selectedCompanyId, user_id],
    queryFn: () => fetchPrompts(company_id || selectedCompanyId),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

export const usePromptDetailsQuery = (prompt_id: string) => {
  const { selectedCompanyId, isSuperadmin } = useAuth();

  return useQuery({
    queryKey: ["promptDetails", prompt_id, selectedCompanyId],
    queryFn: () =>
      fetchPromptDetails(prompt_id, selectedCompanyId, isSuperadmin),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};
