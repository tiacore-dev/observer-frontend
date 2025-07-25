// store/slice/chatsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatsState {
  nameFilter: string;
  idFilter: string;
  page: number;
  rowsPerPage: number; // Добавляем новое поле
  sortField: "chat_name" | "chat_id" | "created_at";
  sortDirection: "asc" | "desc";
}

const initialState: ChatsState = {
  nameFilter: "",
  idFilter: "",
  page: 1,
  rowsPerPage: 10, // Значение по умолчанию
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
    setRowsPerPage: (state, action: PayloadAction<number>) => {
      // Новый reducer
      state.rowsPerPage = action.payload;
      state.page = 1;
    },
    setSortField: (
      state,
      action: PayloadAction<"chat_name" | "chat_id" | "created_at">
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
      state.idFilter = "";
      state.sortField = "created_at";
      state.sortDirection = "desc";
      state.page = 1;
      state.rowsPerPage = 10; // Сбрасываем до значения по умолчанию
    },
  },
});

// Экспортируем новый action
export const {
  setNameFilter,
  setIdFilter,
  setPage,
  setRowsPerPage,
  setSortField,
  setSortDirection,
  resetFilters,
} = chatsSlice.actions;

export default chatsSlice.reducer;
