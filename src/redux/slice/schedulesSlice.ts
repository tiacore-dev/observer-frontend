// store/slice/schedulesSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type SortField =
  | "bot_id"
  | "enabled"
  | "company_id"
  | "created_at"
  | "last_run_at"
  | "schedule_strategy"
  | "schedule_type";

interface SchedulesState {
  botFilter: string;
  companyFilter: string;
  enabledFilter: boolean | "all";
  strategyFilter: string;
  typeFilter: string;
  chatFilter: string;
  nameFilter: string;
  targetChatFilter: string;
  page: number;
  rowsPerPage: number;
  sortField: SortField;
  sortDirection: "asc" | "desc";
}

const initialState: SchedulesState = {
  botFilter: "",
  companyFilter: "",
  enabledFilter: "all",
  strategyFilter: "",
  typeFilter: "",
  chatFilter: "",
  nameFilter: "",
  targetChatFilter: "",
  page: 1,
  rowsPerPage: 10,
  sortField: "created_at",
  sortDirection: "desc",
};

const schedulesSlice = createSlice({
  name: "schedules",
  initialState,
  reducers: {
    setBotFilter: (state, action: PayloadAction<string>) => {
      state.botFilter = action.payload;
      state.page = 1;
    },
    setCompanyFilter: (state, action: PayloadAction<string>) => {
      state.companyFilter = action.payload;
      state.page = 1;
    },
    setEnabledFilter: (state, action: PayloadAction<boolean | "all">) => {
      state.enabledFilter = action.payload;
      state.page = 1;
    },
    setStrategyFilter: (state, action: PayloadAction<string>) => {
      state.strategyFilter = action.payload;
      state.page = 1;
    },
    setTypeFilter: (state, action: PayloadAction<string>) => {
      state.typeFilter = action.payload;
      state.page = 1;
    },
    setChatFilter: (state, action: PayloadAction<string>) => {
      state.chatFilter = action.payload;
      state.page = 1;
    },
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
      state.page = 1;
    },
    setTargetChatFilter: (state, action: PayloadAction<string>) => {
      state.targetChatFilter = action.payload;
      state.page = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setSortField: (state, action: PayloadAction<SortField>) => {
      state.sortField = action.payload;
      state.page = 1;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
      state.page = 1;
    },
    resetFilters: (state) => {
      state.botFilter = "";
      state.companyFilter = "";
      state.enabledFilter = "all";
      state.strategyFilter = "";
      state.typeFilter = "";
      state.chatFilter = "";
      state.nameFilter = "";
      state.targetChatFilter = "";
      state.sortField = "created_at";
      state.sortDirection = "desc";
      state.page = 1;
    },
  },
});

export const {
  setBotFilter,
  setCompanyFilter,
  setEnabledFilter,
  setStrategyFilter,
  setTypeFilter,
  setChatFilter,
  setNameFilter,
  setTargetChatFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = schedulesSlice.actions;

export default schedulesSlice.reducer;
