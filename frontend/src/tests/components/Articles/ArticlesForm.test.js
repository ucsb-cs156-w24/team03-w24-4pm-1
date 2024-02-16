import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ArticlesForm from "main/components/Articles/ArticlesForm";
import { articlesFixtures } from "fixtures/articlesFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ArticlesForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Title", "Url", "Explanation", "Email", "Date (iso format)"];
    const testId = "ArticlesForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm initialContents={articlesFixtures.oneArticle} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ArticlesForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Title is required./);
        expect(screen.getByText(/URL is required./)).toBeInTheDocument();
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date is required./)).toBeInTheDocument();

        const titleInput = screen.getByTestId(`${testId}-title`);
        expect(screen.getByTestId(`${testId}-url`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-email`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-dateAdded`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
        fireEvent.change(titleInput, { target: { value: "a".repeat(31) } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/Max length 30 characters/)).toBeInTheDocument();
        });
    });

    // test("No Error messsages on good input", async () => {

    //     const mockSubmitAction = jest.fn();


    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <Router>
    //                 <ArticlesForm />
    //             </Router>
    //         </QueryClientProvider>
    //     );

    //     await screen.findByTestId(`${testId}-dateAdded`);
    //     const submitButton = screen.getByTestId(`${testId}-submit`);

    //     const dateAddedField = screen.getByTestId(`${testId}-dateAdded`);
    //     fireEvent.change(dateAddedField, { target: { value: '2022-01-02T12:00' } });
    //     fireEvent.click(submitButton);

    //     await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

    //     expect(screen.queryByText(/dateAdded must be in ISO format/)).not.toBeInTheDocument();

    // });

});