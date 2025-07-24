// slice/accountsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountsState {
  nameFilter: string;
  usernameFilter: string;
  idFilter: string;
  page: number;
  sortField: "account_id" | "account_name" | "username" | "created_at";
  sortDirection: "asc" | "desc";
}

const initialState: AccountsState = {
  nameFilter: "",
  usernameFilter: "",
  idFilter: "",
  page: 1,
  sortField: "created_at",
  sortDirection: "desc",
};

const accountsSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
      state.page = 1; // Сбрасываем страницу при изменении фильтра
    },
    setUsernameFilter: (state, action: PayloadAction<string>) => {
      state.usernameFilter = action.payload;
      state.page = 1;
    },
    setIdFilter: (state, action: PayloadAction<string>) => {
      state.idFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setSortField: (
      state,
      action: PayloadAction<
        "account_id" | "account_name" | "username" | "created_at"
      >
    ) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.nameFilter = "";
      state.usernameFilter = "";
      state.idFilter = "";
      state.page = 1;
      state.sortField = "created_at";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setNameFilter,
  setUsernameFilter,
  setIdFilter,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = accountsSlice.actions;

export default accountsSlice.reducer;
