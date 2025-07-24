// store/companiesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../api/companiesApi";

interface CompaniesState {
  nameFilter: string;
  page: number;
  sortField: "company_name" | "description";
  sortDirection: "asc" | "desc";
}

const initialState: CompaniesState = {
  nameFilter: "",
  page: 1,
  sortField: "company_name",
  sortDirection: "desc",
};

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortField: (
      state,
      action: PayloadAction<"company_name" | "description">
    ) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.nameFilter = "";
      state.page = 1;
      state.sortField = "company_name";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setNameFilter,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = companiesSlice.actions;

export default companiesSlice.reducer;
