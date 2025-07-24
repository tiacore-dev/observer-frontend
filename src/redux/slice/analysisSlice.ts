// store/analysisSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAnalys } from "../../api/analysisApi";

interface AnalysisState {
  chatFilter: string;
  chatSelectFilter: string;
  promptFilter: string;
  promptSelectFilter: string;
  companyFilter: string;
  companySelectFilter: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  page: number;
  sortField: keyof IAnalys;
  sortDirection: "asc" | "desc";
}

const initialState: AnalysisState = {
  chatFilter: "",
  chatSelectFilter: "",
  promptFilter: "",
  promptSelectFilter: "",
  companyFilter: "",
  companySelectFilter: "",
  dateFrom: null,
  dateTo: null,
  page: 1,
  sortField: "created_at",
  sortDirection: "desc",
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setChatFilter: (state, action: PayloadAction<string>) => {
      state.chatFilter = action.payload;
      state.chatSelectFilter = "";
      state.page = 1;
    },
    setChatSelectFilter: (state, action: PayloadAction<string>) => {
      state.chatSelectFilter = action.payload;
      state.chatFilter = "";
      state.page = 1;
    },
    setPromptFilter: (state, action: PayloadAction<string>) => {
      state.promptFilter = action.payload;
      state.promptSelectFilter = "";
      state.page = 1;
    },
    setPromptSelectFilter: (state, action: PayloadAction<string>) => {
      state.promptSelectFilter = action.payload;
      state.promptFilter = "";
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
    setDateFrom: (state, action: PayloadAction<Date | null>) => {
      state.dateFrom = action.payload;
      state.page = 1;
    },
    setDateTo: (state, action: PayloadAction<Date | null>) => {
      state.dateTo = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortField: (state, action: PayloadAction<keyof IAnalys>) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.chatFilter = "";
      state.chatSelectFilter = "";
      state.promptFilter = "";
      state.promptSelectFilter = "";
      state.companyFilter = "";
      state.companySelectFilter = "";
      state.dateFrom = null;
      state.dateTo = null;
      state.page = 1;
      state.sortField = "created_at";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setChatFilter,
  setChatSelectFilter,
  setPromptFilter,
  setPromptSelectFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setDateFrom,
  setDateTo,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = analysisSlice.actions;

export default analysisSlice.reducer;
