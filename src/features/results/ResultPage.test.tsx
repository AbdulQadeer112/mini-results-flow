import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { FormProvider } from "../../context/form/FormProvider";
import ResultsPage from "./ResultsPage";

const renderResultsPage = () =>
  render(
    <MemoryRouter>
      <FormProvider>
        <ResultsPage />
      </FormProvider>
    </MemoryRouter>
  );

describe("ResultsPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders the 'Your Results' header", () => {
    renderResultsPage();
    expect(screen.getByText(/your results/i)).toBeInTheDocument();
  });

  it("renders progress dots", () => {
    renderResultsPage();
    const dots = document.querySelectorAll("span.inline-block.rounded-full");
    expect(dots.length).toBeGreaterThan(0);
  });

  it("renders the body fat percentage heading on step 1", () => {
    renderResultsPage();
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: (content) =>
          /your body fat/i.test(content) && /percentage is/i.test(content),
      })
    ).toBeInTheDocument();
  });

  it("renders 'Here’s Why That Matters' subheading on step 1", () => {
    renderResultsPage();
    expect(screen.getByText(/here.s why that matters/i)).toBeInTheDocument();
  });

  it("renders the Next button", () => {
    renderResultsPage();
    expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
  });

  it("renders the logo image", () => {
    renderResultsPage();
    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
  });

  it("renders the muscle mass image on step 1", () => {
    renderResultsPage();
    expect(screen.getByAltText(/muscle mass/i)).toBeInTheDocument();
  });

  it("renders the explanation paragraph on step 1", () => {
    renderResultsPage();
    expect(
      screen.getByText(/your body fat percentage gives a clearer picture/i)
    ).toBeInTheDocument();
  });

  it("first progress dot is active and the rest are inactive", () => {
    renderResultsPage();
    const dots = document.querySelectorAll("span.inline-block.rounded-full");
    expect(dots[0]).toHaveStyle("background-color: rgb(54, 188, 159)");
    for (let i = 1; i < dots.length; i++) {
      expect(dots[i]).toHaveStyle("background-color: rgb(209, 213, 219)");
    }
  });

  it("clicking Next advances to step 2 and shows BMI content", async () => {
    renderResultsPage();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /your bmi is/i })
      ).toBeInTheDocument();
    });
  });

  it("clicking Next reveals a Back button labeled with the previous step name", async () => {
    renderResultsPage();
    expect(screen.queryByRole("button", { name: /body fat/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: /body fat/i })).toBeInTheDocument();
    });
  });

  it("clicking Back from step 2 returns to step 1 content", async () => {
    renderResultsPage();

    // Advance to step 2
    fireEvent.click(screen.getByRole("button", { name: /next/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { level: 1, name: /your bmi is/i })
      ).toBeInTheDocument();
    });

    // Return to step 1
    fireEvent.click(screen.getByRole("button", { name: /body fat/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          level: 1,
          name: (content) =>
            /your body fat/i.test(content) && /percentage is/i.test(content),
        })
      ).toBeInTheDocument();
    });
  });
});
