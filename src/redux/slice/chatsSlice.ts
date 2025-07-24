// store/slice/chatsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatsState {
  nameFilter: string;
  idFilter: string;
  page: number;
  sortField: "chat_name" | "chat_id" | "created_at";
  sortDirection: "asc" | "desc";
}

const initialState: ChatsState = {
  nameFilter: "",
  idFilter: "",
  page: 1,
  sortField: "created_at",
  sortDirection: "desc",
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setNameFilter: (state, action: PayloadAction<string>) => {
      state.nameFilter = action.payload;
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
      action: PayloadAction<"chat_name" | "chat_id" | "created_at">
    ) => {
      state.sortField = action.payload;
    },
    setSortDirection: (state, action: PayloadAction<"asc" | "desc">) => {
      state.sortDirection = action.payload;
    },
    resetFilters: (state) => {
      state.nameFilter = "";
      state.idFilter = "";
      state.page = 1;
      state.sortField = "created_at";
      state.sortDirection = "desc";
    },
  },
});

export const {
  setNameFilter,
  setIdFilter,
  setPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = chatsSlice.actions;

export default chatsSlice.reducer;
