import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import App from "./App";
import { expect, it, describe, beforeAll, vi } from "vitest";
import { MantineProvider } from "@mantine/core";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { mockVacancies } from "./mocks/mockData";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

vi.mock("ky", () => ({
  default: {
    get: vi.fn(() => ({
      json: vi.fn(() =>
        Promise.resolve({
          items: mockVacancies,
          found: mockVacancies.length,
          pages: 1,
          page: 0,
          per_page: 10,
        }),
      ),
    })),
  },
}));

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
});

const mockStore = configureStore({
  reducer: {
    fetch: (
      state = {
        vacancies: mockVacancies,
        loading: false,
        error: null,
        total: mockVacancies.length,
        totalPages: 0,
        search: "",
        area: "",
        skills: [],
        page: 0,
      },
    ) => state,
  },
});

const mockVacanciesMoscow = [mockVacancies[0]];

const mockStoreMoscow = configureStore({
  reducer: {
    fetch: (
      state = {
        vacancies: mockVacanciesMoscow,
        loading: false,
        error: null,
        total: mockVacanciesMoscow.length,
        totalPages: 0,
        search: "",
        area: "1",
        skills: [],
        page: 0,
      },
    ) => state,
  },
});

describe("App component", function () {
  it("должен рендерить app", async () => {
    render(
      <Provider store={mockStore}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </Provider>,
    );

    await waitFor(() => {
      expect(screen.getByText(/Список вакансий/i)).toBeInTheDocument();
      expect(screen.getByText(/вакансия 1/i)).toBeInTheDocument();
      expect(screen.getByText(/вакансия 2/i)).toBeInTheDocument();
    });
  });
  it("присутсвует только вакансия 1 из Москвы", () => {
    render(
      <Provider store={mockStoreMoscow}>
        <MantineProvider>
          <App />
        </MantineProvider>
      </Provider>,
    );
    expect(screen.getByText(/вакансия 1/i)).toBeInTheDocument();
    expect(screen.queryByText(/вакансия 2/i)).not.toBeInTheDocument();
  });
});
