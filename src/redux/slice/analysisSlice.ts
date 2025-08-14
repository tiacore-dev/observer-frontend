// store/analysisSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IAnalys } from "../../api/analysisApi";

interface AnalysisState {
  chatFilter: string;
  chatSelectFilter: number | null;
  promptFilter: string;
  promptSelectFilter: string | null;
  companyFilter: string;
  companySelectFilter: string;
  dateFrom: Date | null;
  dateTo: Date | null;
  page: number;
  rowsPerPage: number;
  sortField: keyof IAnalys;
  sortDirection: "asc" | "desc";
  analysingModel: "yandex-gpt-pro" | "yandex-gpt-mini" | null;
}

const initialState: AnalysisState = {
  chatFilter: "",
  chatSelectFilter: null,
  promptFilter: "",
  promptSelectFilter: null,
  companyFilter: "",
  companySelectFilter: "",
  dateFrom: null,
  dateTo: null,
  page: 1,
  rowsPerPage: 10,
  sortField: "created_at",
  sortDirection: "desc",
  analysingModel: null,
};

const analysisSlice = createSlice({
  name: "analysis",
  initialState,
  reducers: {
    setModelFilter: (
      state,
      action: PayloadAction<"yandex-gpt-pro" | "yandex-gpt-mini" | null>
    ) => {
      state.analysingModel = action.payload;
      state.chatSelectFilter = null;
      state.page = 1;
    },
    setChatFilter: (state, action: PayloadAction<string>) => {
      state.chatFilter = action.payload;
      state.chatSelectFilter = null;
      state.page = 1;
    },
    setChatSelectFilter: (state, action: PayloadAction<number | null>) => {
      state.chatSelectFilter = action.payload;
      state.chatFilter = "";
      state.page = 1;
    },
    setPromptFilter: (state, action: PayloadAction<string>) => {
      state.promptFilter = action.payload;
      state.promptSelectFilter = null;
      state.page = 1;
    },
    setPromptSelectFilter: (state, action: PayloadAction<string | null>) => {
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
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setSortField: (state, action: PayloadAction<keyof IAnalys>) => {
      state.sortField = action.payload;
      state.page = 1;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.chatFilter = "";
      state.chatSelectFilter = null;
      state.promptFilter = "";
      state.promptSelectFilter = null;
      state.companyFilter = "";
      state.companySelectFilter = "";
      state.dateFrom = null;
      state.dateTo = null;
      state.page = 1;
      state.rowsPerPage = 10;
      state.sortField = "created_at";
      state.sortDirection = "desc";
      state.analysingModel = null;
      state.page = 1;
    },
  },
});

export const {
  setModelFilter,
  setChatFilter,
  setChatSelectFilter,
  setPromptFilter,
  setPromptSelectFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setDateFrom,
  setDateTo,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = analysisSlice.actions;

export default analysisSlice.reducer;
