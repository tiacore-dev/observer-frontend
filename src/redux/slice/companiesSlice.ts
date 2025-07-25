// store/companiesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ICompany } from "../../api/companiesApi";

interface CompaniesState {
  nameFilter: string;
  page: number;
  rowsPerPage: number; // Добавляем новое поле
  sortField: "company_name" | "description";
  sortDirection: "asc" | "desc";
}

const initialState: CompaniesState = {
  nameFilter: "",
  page: 1,
  rowsPerPage: 10, // Значение по умолчанию
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
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      // Новый action
      state.rowsPerPage = action.payload;
      state.page = 1; // Сбрасываем страницу при изменении количества элементов
    },
    setSortField: (
      state,
      action: PayloadAction<"company_name" | "description">
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
      state.sortField = "company_name";
      state.sortDirection = "desc";
      state.page = 1;
    },
  },
});

export const {
  setNameFilter,
  setPage,
  setRowsPerPage, // Экспортируем новый action
  setSortField,
  setSortDirection,
  resetFilters,
} = companiesSlice.actions;

export default companiesSlice.reducer;
