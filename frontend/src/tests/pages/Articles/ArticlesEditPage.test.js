import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ArticlesEditPage from "main/pages/Articles/ArticlesEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ArticlesEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbarticles", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Articles");
            expect(screen.queryByTestId("Articles-title")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsbarticles", { params: { id: 17 } }).reply(200, {
                id: 17,
                title: "Trump calls Florence 'one of the wettest we've ever seen from the standpoint of water",
                url: "https://abcnews.go.com/Politics/trump-calls-florence-wettest-standpoint-water/story?id=57930056",
                explanation: "From the standpoint of water.",
                email: "ahanjabi@ucsb.edu",
                dateAdded: "2022-07-04T12:00:01"
            });
            axiosMock.onPut('/api/ucsbarticles').reply(200, {
                id: "17",
                title: "Trump calls Ron Desantis 'Meatball Ron'",
                url: "https://www.politico.com/news/2023/02/18/trump-desantis-meatball-ron-00083560",
                explanation: "Meatball Ron",
                email: "ahanjab@ucsb.edu",
                dateAdded: "2024-07-04T12:00:01"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(titleField).toBeInTheDocument();
            expect(titleField).toHaveValue("Trump calls Florence 'one of the wettest we've ever seen from the standpoint of water");
            expect(urlField).toBeInTheDocument();
            expect(urlField).toHaveValue("https://abcnews.go.com/Politics/trump-calls-florence-wettest-standpoint-water/story?id=57930056");
            expect(explanationField).toBeInTheDocument();
            expect(explanationField).toHaveValue("From the standpoint of water.");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("ahanjabi@ucsb.edu");
            expect(dateAddedField).toBeInTheDocument();
            expect(dateAddedField).toHaveValue("2022-07-04T12:00:01.000");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(titleField, { target: { value: "Trump calls Ron Desantis 'Meatball Ron'" } });
            fireEvent.change(urlField, { target: { value: 'https://www.politico.com/news/2023/02/18/trump-desantis-meatball-ron-00083560' } });
            fireEvent.change(explanationField, { target: { value: 'Meatball Ron' } });
            fireEvent.change(emailField, { target: { value: 'ahanjab@ucsb.edu' } });
            fireEvent.change(dateAddedField, { target: { value: '2024-07-04T12:00:01' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Articles Updated - id: 17 title: Trump calls Ron Desantis 'Meatball Ron'");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                title: "Trump calls Ron Desantis 'Meatball Ron'",
                url: "https://www.politico.com/news/2023/02/18/trump-desantis-meatball-ron-00083560",
                explanation: "Meatball Ron",
                email: "ahanjab@ucsb.edu",
                dateAdded: "2024-07-04T12:00:01.000"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ArticlesEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ArticlesForm-id");

            const idField = screen.getByTestId("ArticlesForm-id");
            const titleField = screen.getByTestId("ArticlesForm-title");
            const urlField = screen.getByTestId("ArticlesForm-url");
            const explanationField = screen.getByTestId("ArticlesForm-explanation");
            const emailField = screen.getByTestId("ArticlesForm-email");
            const dateAddedField = screen.getByTestId("ArticlesForm-dateAdded");
            const submitButton = screen.getByTestId("ArticlesForm-submit");

            expect(idField).toHaveValue("17");
            expect(titleField).toHaveValue("Trump calls Florence 'one of the wettest we've ever seen from the standpoint of water");
            expect(urlField).toHaveValue("https://abcnews.go.com/Politics/trump-calls-florence-wettest-standpoint-water/story?id=57930056");
            expect(explanationField).toHaveValue("From the standpoint of water.");
            expect(emailField).toHaveValue("ahanjabi@ucsb.edu");
            expect(dateAddedField).toHaveValue("2022-07-04T12:00:01.000");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(titleField, { target: { value: "Trump calls Ron Desantis 'Meatball Ron'" } })
            fireEvent.change(urlField, { target: { value: 'https://www.politico.com/news/2023/02/18/trump-desantis-meatball-ron-00083560' } })
            fireEvent.change(explanationField, { target: { value: 'Meatball Ron' } })
            fireEvent.change(emailField, { target: { value: 'ahanjab@ucsb.edu' } })
            fireEvent.change(dateAddedField, { target: { value: '2024-07-04T12:00:01' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Articles Updated - id: 17 title: Trump calls Ron Desantis 'Meatball Ron'");
            expect(mockNavigate).toBeCalledWith({ "to": "/articles" });
        });

       
    });
});

