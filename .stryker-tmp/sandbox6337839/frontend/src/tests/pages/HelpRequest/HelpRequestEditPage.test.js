import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import HelpRequestEditPage from "main/pages/HelpRequest/HelpRequestEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

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
        useParams: () => ({
            id: 3
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("HelpRequestEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 3 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Help Request");
            expect(screen.queryByTestId("HelpRequest-requesterEmail")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/helprequests", { params: { id: 3 } }).reply(200, {
                id: 3,
                requesterEmail: "john@email.com",
                teamId: "Team 15",
                tableOrBreakoutRoom: "1",
                requestTime: "2024-01-01T00:00",
                explanation: "no",
                solved: false
            });
            axiosMock.onPut('/api/helprequests').reply(200, {
                id: "3",
                requesterEmail: "james@email.com",
                teamId: "Team 5",
                tableOrBreakoutRoom: "home",
                requestTime: "2020-01-01T00:00",
                explanation: "done",
                solved: true
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");
            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomEmailField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solveButton = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");
    
            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toBeInTheDocument();
            expect(requesterEmailField).toHaveValue("john@email.com");
            expect(teamIdField).toBeInTheDocument();
            expect(teamIdField).toHaveValue("Team 15");
            expect(tableOrBreakoutRoomEmailField).toBeInTheDocument();
            expect(tableOrBreakoutRoomEmailField).toHaveValue("1");
            expect(requestTimeField).toBeInTheDocument();
            expect(requestTimeField).toHaveValue("2024-01-01T00:00");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("no");
            expect(solveButton).toBeInTheDocument();
            expect(solveButton).not.toBeChecked();

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(requesterEmailField, { target: { value: "john@email.com" } });
            fireEvent.change(teamIdField, { target: { value: 'Team 5' } });
            fireEvent.change(tableOrBreakoutRoomEmailField, { target: { value: '1' } });
            fireEvent.change(requestTimeField, { target: { value: "2024-01-01T00:00" } });
            fireEvent.change(explanationField, { target: { value: "no" } });
            fireEvent.click(solveButton);
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 3 requesterEmail: james@email.com");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 3 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                requesterEmail: "john@email.com",
                teamId: "Team 5",
                tableOrBreakoutRoom: "1",
                requestTime: "2024-01-01T00:00",
                explanation: "no",
                solved: true
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <HelpRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("HelpRequestForm-id");

            const idField = screen.getByTestId("HelpRequestForm-id");
            const requesterEmailField = screen.getByTestId("HelpRequestForm-requesterEmail");
            const teamIdField = screen.getByTestId("HelpRequestForm-teamId");
            const tableOrBreakoutRoomEmailField = screen.getByTestId("HelpRequestForm-tableOrBreakoutRoom");
            const requestTimeField = screen.getByTestId("HelpRequestForm-requestTime");
            const explanationField = screen.getByTestId("HelpRequestForm-explanation");
            const solveButton = screen.getByTestId("HelpRequestForm-solved");
            const submitButton = screen.getByTestId("HelpRequestForm-submit");
    
            expect(idField).toHaveValue("3");
            expect(requesterEmailField).toHaveValue("john@email.com");
            expect(teamIdField).toHaveValue("Team 15");
            expect(tableOrBreakoutRoomEmailField).toHaveValue("1");
            expect(requestTimeField).toHaveValue("2024-01-01T00:00");
            expect(explanationField).toHaveValue("no");
            expect(solveButton).not.toBeChecked();

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(requesterEmailField, { target: { value: 'james@email.com' } })
            fireEvent.change(teamIdField, { target: { value: 'Team 5' } })
            fireEvent.change(tableOrBreakoutRoomEmailField, { target: { value: 'home' } })
            fireEvent.change(requestTimeField, { target: { value: "2020-01-01T00:00" } })
            fireEvent.change(explanationField, { target: { value: "done" } })
            fireEvent.click(solveButton);
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Help Request Updated - id: 3 requesterEmail: james@email.com");
            expect(mockNavigate).toBeCalledWith({ "to": "/helprequest" });
        });

       
    });
});
