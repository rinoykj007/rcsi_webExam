import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StationOverview from "@/pages/station/StationOverview";
import PracticalOverview from "@/pages/practical/PracticalOverview";
import PracticalSteps from "@/pages/practical/PracticalSteps";

// Simulate the current state: no station_overviews table in Supabase
vi.mock("@/lib/data", () => ({
  fetchStationOverview: vi.fn().mockResolvedValue(null),
}));

const renderApp = (initialPath: string) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/station/:topicId" element={<StationOverview />} />
          <Route path="/screens/practical/:topicId" element={<PracticalOverview />} />
          <Route path="/screens/practical/:topicId/steps" element={<PracticalSteps />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("Practical Prep flow", () => {
  it("shows the Practical Prep button on a station page even when DB overview is missing", async () => {
    renderApp("/station/sepsis");
    expect(await screen.findByText("Practical Prep")).toBeTruthy();
    expect(screen.getByText("Station content not found")).toBeTruthy();
  });

  it("clicking Practical Prep navigates to the practical overview with sepsis content", async () => {
    renderApp("/station/sepsis");
    fireEvent.click(await screen.findByText("Practical Prep"));
    expect(await screen.findByText("Sepsis Recognition & the Sepsis Six")).toBeTruthy();
    expect(screen.getByText("10 STEPS")).toBeTruthy();
    expect(screen.getByText("6 CARDS")).toBeTruthy();
    expect(screen.getByText("5 QUESTIONS")).toBeTruthy();
  });

  it("renders the procedure steps for the practical steps tab", async () => {
    renderApp("/screens/practical/sepsis/steps");
    expect(await screen.findByText("Recognise the At-Risk Patient")).toBeTruthy();
    expect(screen.getByText("Give High-Flow Oxygen")).toBeTruthy();
  });
});
