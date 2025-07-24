// store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import accountsReducer from "./slice/accountsSlice";
import analysisReducer from "./slice/analysisSlice";
import botsReducer from "./slice/botsSlice";
import chatsReducer from "./slice/chatsSlice";
import companiesReducer from "./slice/companiesSlice";
import promptsReducer from "./slice/promptsSlice"; // Добавляем импорт

export const store = configureStore({
  reducer: {
    accounts: accountsReducer,
    analysis: analysisReducer,
    bots: botsReducer,
    chats: chatsReducer,
    companies: companiesReducer,
    prompts: promptsReducer, // Добавляем редюсер
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
