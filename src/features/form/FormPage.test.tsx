import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { FormProvider } from "../../context/form/FormProvider";
import FormPage from "./FormPage";

const renderFormPage = () =>
  render(
    <MemoryRouter>
      <FormProvider>
        <FormPage />
      </FormProvider>
    </MemoryRouter>
  );

describe("FormPage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("disables submit button when the form is empty", () => {
    renderFormPage();
    expect(screen.getByRole("button", { name: /see my results/i })).toBeDisabled();
  });

  it("enables submit button only when all required fields are filled", async () => {
    const user = userEvent.setup();
    renderFormPage();

    // Select gender (exact match to avoid "female" matching /male/i)
    await user.click(screen.getByRole("radio", { name: "Male" }));

    // Set body fat slider to a valid non-zero value
    fireEvent.change(screen.getByRole("slider", { name: /body fat/i }), {
      target: { value: "25" },
    });

    // Set BMI slider to a valid non-zero value
    fireEvent.change(screen.getByRole("slider", { name: /bmi/i }), {
      target: { value: "25" },
    });

    // Type daily calorie target
    await user.type(
      screen.getByRole("spinbutton", { name: /daily calorie target/i }),
      "2000"
    );

    // Select water intake from dropdown
    await user.selectOptions(
      screen.getByRole("combobox", { name: /cups of water/i }),
      "2"
    );

    // Type weekly weight loss goal
    await user.type(
      screen.getByRole("spinbutton", { name: /weekly weight loss/i }),
      "1"
    );

    // Type days to see results
    await user.type(
      screen.getByRole("spinbutton", { name: /days to see results/i }),
      "30"
    );

    expect(screen.getByRole("button", { name: /see my results/i })).toBeEnabled();
  });

  it("shows a validation error message when the form is submitted incomplete", () => {
    renderFormPage();
    const form = screen.getByRole("form", { name: /results input form/i });
    fireEvent.submit(form);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
