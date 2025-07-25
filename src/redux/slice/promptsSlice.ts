// store/promptsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPrompt } from "../../api/promptsApi";

interface PromptsState {
  nameFilter: string;
  nameSelectFilter: string;
  textFilter: string;
  companyFilter: string;
  companySelectFilter: string;
  page: number;
  rowsPerPage: number;
  sortField: "prompt_name" | "company_id" | "created_at";
  sortDirection: "asc" | "desc";
}

const initialState: PromptsState = {
  nameFilter: "",
  nameSelectFilter: "",
  textFilter: "",
  companyFilter: "",
  companySelectFilter: "",
  page: 1,
  rowsPerPage: 10,
  sortField: "created_at",
  sortDirection: "desc",
};

const promptsSlice = createSlice({
  name: "prompts",
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
      state.nameSelectFilter = "";
      state.page = 1;
    },
    setNameSelectFilter: (state, action: PayloadAction<string>) => {
      state.nameSelectFilter = action.payload;
      state.nameFilter = "";
      state.page = 1;
    },
    setTextFilter: (state, action: PayloadAction<string>) => {
      state.textFilter = action.payload;
      state.page = 1;
    },
    setCompanyFilter: (state, action: PayloadAction<string>) => {
      state.companyFilter = action.payload;
      state.companySelectFilter = "";
      state.page = 1;
    },
    setCompanySelectFilter: (state, action: PayloadAction<string>) => {
      state.companySelectFilter = action.payload;
      state.companyFilter = "";
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setSortField: (
      state,
      action: PayloadAction<"prompt_name" | "company_id" | "created_at">
    ) => {
      state.sortField = action.payload;
      state.page = 1;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.nameFilter = "";
      state.nameSelectFilter = "";
      state.textFilter = "";
      state.companyFilter = "";
      state.companySelectFilter = "";
      state.page = 1;
      state.sortField = "created_at";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setNameFilter,
  setNameSelectFilter,
  setTextFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = promptsSlice.actions;

export default promptsSlice.reducer;
