import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Reports } from "../components/Reports"; 
import { generateBudgetSummary, generateSavingsGoalsProgressReport, generateTotalIncomeAndExpenses } from "../services/user";

jest.mock('../services/user', () => ({
    generateTotalIncomeAndExpenses: jest.fn(),
    generateBudgetSummary: jest.fn(),
    generateSavingsGoalsProgressReport: jest.fn()
}));

describe("Reports Component", () => {

    beforeEach(() => {
        render(<Reports />);
    });

    test("Should render the report header and input fields", () => {
        const headerText = screen.getByText(/generate reports/i);
        expect(headerText).toBeInTheDocument();

        const selectElement = screen.getByRole('combobox');
        expect(selectElement).toBeInTheDocument();

        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        expect(fromDateInput).toBeInTheDocument();
        expect(toDateInput).toBeInTheDocument();

        const generateButton = screen.getByText("Generate");
        expect(generateButton).toBeInTheDocument();
    });

    test("Should show alert if fields are empty", () => {
        window.alert = jest.fn();
        const generateButton = screen.getByText("Generate");
        fireEvent.click(generateButton);
        expect(window.alert).toHaveBeenCalledWith("Please fill in all fields.");
    });

    test("Should show alert for invalid dates", async () => {

        window.alert = jest.fn();
        const selectElement = screen.getByRole('combobox');
        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        
        fireEvent.change(selectElement, {target:{value:"Total expenses and income"}})
        fireEvent.change(fromDateInput, { target: { value: "0000-30-10" } });
        fireEvent.change(toDateInput, { target: { value: "2024-01-31" } });

        const generateButton = screen.getByText("Generate");

        fireEvent.click(generateButton);

        expect(window.alert).toHaveBeenCalledWith("Please enter valid dates.");
    });

    test("Should show alert for incorrect date range", () => {
        
        window.alert = jest.fn();

        const selectElement = screen.getByRole('combobox');
        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);

        fireEvent.change(selectElement, {target:{value:"Total expenses and income"}})
        fireEvent.change(fromDateInput, { target: { value: "2024-01-31" } });
        fireEvent.change(toDateInput, { target: { value: "2024-01-01" } });

        const generateButton = screen.getByText("Generate");
        fireEvent.click(generateButton);
        expect(window.alert).toHaveBeenCalledWith("From date must be earlier than To date.");
    });

    test("Should call generateTotalIncomeAndExpenses and display the report", async () => {
        const incomeExpensesReport = { totalIncome: 5000, totalExpenses: 2000 };
       ( generateTotalIncomeAndExpenses as jest.Mock).mockResolvedValueOnce(incomeExpensesReport);

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: "Total expenses and income" } });

        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        fireEvent.change(fromDateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(toDateInput, { target: { value: "2024-01-31" } });

        const generateButton = screen.getByText("Generate");
        fireEvent.click(generateButton);

        const incomeText = await screen.findByText("Total Income");
        expect(incomeText).toBeInTheDocument();
        const incomeAmount =  await screen.findByText("5000");
        expect(incomeAmount).toBeInTheDocument();

        const expensesText = await screen.findByText("Total Expenses");
        expect(expensesText).toBeInTheDocument();
        const expensesAmount = await screen.findByText("2000");
        expect(expensesAmount).toBeInTheDocument();
    });

    test("Should call generateBudgetSummary and display the report", async () => {
        const mockReport = [{ category: "Food", amount: 1000, amountSpent: 500 }];
        (generateBudgetSummary as jest.Mock).mockResolvedValueOnce(mockReport);

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: "Budget Summary" } });

        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        fireEvent.change(fromDateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(toDateInput, { target: { value: "2024-01-31" } });

        const generateButton = screen.getByText("Generate");
        fireEvent.click(generateButton);

        const budgetText = await screen.findByText(/budget summary over given specific period/i);
        expect(budgetText).toBeInTheDocument();
        const categoryText = await screen.findByText("Food");
        expect(categoryText).toBeInTheDocument();
        const amountText = await screen.findByText("1000");
        expect(amountText).toBeInTheDocument();
        const amountSpentText = await screen.findByText("500");
        expect(amountSpentText).toBeInTheDocument();
    });

    test("Should call generateSavingsGoalsProgressReport and display the report", async () => {
        const mockReport = [{ title: "Emergency Fund", progress: "75.0%" }];
        (generateSavingsGoalsProgressReport as jest.Mock).mockResolvedValueOnce(mockReport);

        const selectElement = screen.getByRole('combobox');
        fireEvent.change(selectElement, { target: { value: "Savings goals progress" } });

        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        fireEvent.change(fromDateInput, { target: { value: "2024-01-01" } });
        fireEvent.change(toDateInput, { target: { value: "2024-01-31" } });

        const generateButton = screen.getByText("Generate");
        fireEvent.click(generateButton);

        const goalsText = await screen.findByText(/savings goals progress over given specific period/i);
        expect(goalsText).toBeInTheDocument();
        const goalTitle = await screen.findByText("Emergency Fund");
        expect(goalTitle).toBeInTheDocument();
        const goalProgress = await screen.findByText("75.0%");
        expect(goalProgress).toBeInTheDocument();
    });

    test("Should show alert when report generation fails", async () => {

        window.alert = jest.fn();
        (generateTotalIncomeAndExpenses as jest.Mock).mockImplementationOnce(() => {
            throw new Error("Failed to generate report");
        });

        const dropdown = screen.getByRole('combobox');
        const fromDateInput = screen.getByPlaceholderText(/from date yyyy-mm-dd/i);
        const toDateInput = screen.getByPlaceholderText(/to date yyyy-mm-dd/i);
        const generateButton = screen.getByText("Generate");

        fireEvent.change(dropdown, { target: { value: "Total expenses and income" } });
        fireEvent.change(fromDateInput, { target: { value: '2024-10-01' } });
        fireEvent.change(toDateInput, { target: { value: '2024-10-10' } });
        
        fireEvent.click(generateButton);

        expect(window.alert).toHaveBeenCalledWith("Failed to generate report");
    });

});
