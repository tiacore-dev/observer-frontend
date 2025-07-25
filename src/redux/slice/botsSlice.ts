// store/slice/botsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IBot } from "../../api/botsApi";

interface BotsState {
  botIdFilter: string;
  botNameFilter: string;
  botNameSelectFilter: string;
  companyFilter: string;
  companySelectFilter: string;
  statusFilter: boolean | "all";
  page: number;
  rowsPerPage: number;
  sortField: keyof IBot;
  sortDirection: "asc" | "desc";
}

const initialState: BotsState = {
  botIdFilter: "",
  botNameFilter: "",
  botNameSelectFilter: "",
  companyFilter: "",
  companySelectFilter: "",
  statusFilter: "all",
  page: 1,
  rowsPerPage: 10,
  sortField: "created_at",
  sortDirection: "desc",
};

const botsSlice = createSlice({
  name: "bots",
  initialState,
  reducers: {
    setBotIdFilter: (state, action: PayloadAction<string>) => {
      state.botIdFilter = action.payload;
      state.page = 1;
    },
    setBotNameFilter: (state, action: PayloadAction<string>) => {
      state.botNameFilter = action.payload;
      state.botNameSelectFilter = "";
      state.page = 1;
    },
    setBotNameSelectFilter: (state, action: PayloadAction<string>) => {
      state.botNameSelectFilter = action.payload;
      state.botNameFilter = "";
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
    setStatusFilter: (state, action: PayloadAction<boolean | "all">) => {
      state.statusFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setSortField: (state, action: PayloadAction<keyof IBot>) => {
      state.sortField = action.payload;
      state.page = 1;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.botIdFilter = "";
      state.botNameFilter = "";
      state.botNameSelectFilter = "";
      state.companyFilter = "";
      state.companySelectFilter = "";
      state.statusFilter = "all";
      state.sortField = "created_at";
      state.sortDirection = "desc";
      state.page = 1;
    },
  },
});

export const {
  setBotIdFilter,
  setBotNameFilter,
  setBotNameSelectFilter,
  setCompanyFilter,
  setCompanySelectFilter,
  setStatusFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = botsSlice.actions;

export default botsSlice.reducer;
