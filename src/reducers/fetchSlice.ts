import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import ky from "ky";
import type { Vacancy, VacanciesResponse } from "../types/types";
import { useEffect } from "react";

interface VacanciesState {
  vacancies: Vacancy[];
  loading: boolean;
  error: string | null;
  total: number;
  totalPages: number;
  search: string;
  area: string;
  skills: string[];
  page: number;
}

const initialState: VacanciesState = {
  vacancies: [],
  loading: false,
  error: null,
  total: 0,
  totalPages: 0,
  search: "",
  area: "",
  skills: [],
  page: 0,
};

export const fetchVacancies = createAsyncThunk(
  "vacancies/fetchVacancies",
  async function (_, { rejectWithValue, getState }) {
    try {
      const state = getState() as { fetch: VacanciesState };
      const { search, area, skills, page } = state.fetch;
      let URL = `https://api.hh.ru/vacancies?industry=7&professional_role=96&page=${page}&per_page=10`;

      if (search) {
        URL += `&text=${encodeURIComponent(search)}`;
      }
      if (area) {
        URL += `&area=${area}`;
      }
      if (skills) {
        URL += `&skill_set=${skills.join(",")}`;
      }

      const response = await ky.get(URL).json();
      return response as VacanciesResponse;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("Неизвестная ошибка");
    }
  },
);

const vacanciesSlice = createSlice({
  name: "vacanciesSite",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
      state.page = 0;
    },
    setArea: (state, action: PayloadAction<string>) => {
      state.area = action.payload;
      state.page = 0;
    },
    addSkill: (state, action: PayloadAction<string>) => {
      if (!state.skills.includes(action.payload)) {
        state.skills.push(action.payload);
        state.page = 0;
      }
    },
    removeSkill: (state, action: PayloadAction<string>) => {
      state.skills = state.skills.filter((skill) => skill != action.payload);
      state.page = 0;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchVacancies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.loading = false;
        state.vacancies = action.payload.items;
        state.totalPages = action.payload.pages;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "неизвестная ошибка";
      });
  },
});

export const { setSearch, setArea, addSkill, removeSkill, setPage } =
  vacanciesSlice.actions;
export default vacanciesSlice.reducer;
