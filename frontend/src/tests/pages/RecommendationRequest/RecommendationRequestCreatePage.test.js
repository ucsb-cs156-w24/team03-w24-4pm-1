import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RecommendationRequestCreatePage tests", () => {

    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach(() => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    test("renders without crashing", () => {
        const queryClient = new QueryClient();
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("when you fill in the form and hit submit, it makes a request to the backend", async () => {

        const queryClient = new QueryClient();
        const recommendationRequest = {
            "id": 17,
            professorEmail: "Email@example.com",
            requesterEmail: "Email@example.com",
            explanation: "Explanation",
            dateRequested: "2022-02-02T00:00",
            dateNeeded: "2022-02-02T00:00",
            done: false
        };

        axiosMock.onPost("/api/recommendationrequest/post").reply( 202, recommendationRequest );

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RecommendationRequestCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("RecommendationRequestForm-professorEmail")).toBeInTheDocument();
        });

        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const dateRequestedField = screen.getByTestId("RecommendationRequestForm-dateRequested");
        const dateNeededField = screen.getByTestId("RecommendationRequestForm-dateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(professorEmailField, { target: { value: 'newEmail@example.com' } });
        fireEvent.change(requesterEmailField, { target: { value: 'newEmail@example.com' } });
        fireEvent.change(explanationField, { target: { value: 'newExplanation' } });
        fireEvent.change(dateRequestedField, { target: { value: '2023-02-02T00:00' } });
        fireEvent.change(dateNeededField, { target: { value: '2023-02-02T00:00' } });
        fireEvent.change(doneField);

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                professorEmail: "newEmail@example.com",
                requesterEmail: "newEmail@example.com",
                explanation: "newExplanation",
                dateRequested: "2023-02-02T00:00",
                dateNeeded: "2023-02-02T00:00",
                done: true
            }
        );

        expect(mockToast).toBeCalledWith("New recommendationRequest Created - id: 17 professorEmail: Email@example.com requesterEmail: Email@example.com");
        expect(mockNavigate).toBeCalledWith({ "to": "/recommendationrequest" });
    });


});