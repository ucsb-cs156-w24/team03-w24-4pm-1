import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import RecommendationRequestForm from "main/components/RecommendationRequest/RecommendationRequestForm";
import { RecommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));


describe("RecommendationRequestForm tests", () => {

    test("renders correctly", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByText(/Professor Email/);
        await screen.findByText(/Create/);
    });


    test("renders correctly when passing in a RecommendationRequest", async () => {

        render(
            <Router  >
                <RecommendationRequestForm initialContents={RecommendationRequestFixtures.oneRecommendationRequest} />
            </Router>
        );
        await screen.findByTestId(/RecommendationRequestForm-id/);
        expect(screen.getByText(/Id/)).toBeInTheDocument();
        expect(screen.getByTestId(/RecommendationRequestForm-id/)).toHaveValue("1");
    });


    test("Correct Error messsages on bad input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-professorEmail");
        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const DateRequestedField = screen.getByTestId("RecommendationRequestForm-DateRequested");
        const DateNeededField = screen.getByTestId("RecommendationRequestForm-DateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(professorEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(requesterEmailField, { target: { value: 'bad-input' } });
        fireEvent.change(explanationField, { target: { value: '' } });
        fireEvent.change(DateRequestedField, { target: { value: 'bad-input' } });
        fireEvent.change(DateNeededField, { target: { value: 'bad-input' } });
        fireEvent.change(doneField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/ProfessorEmail must be in the format email@example.com/);
        await screen.findByText(/RequesterEmail must be in the format email@example.com/);
        await screen.findByText(/Explanation is required./);
        await screen.findByText(/DateRequested must be in ISO format/);
        await screen.findByText(/DateNeeded must be in ISO format/);
        await screen.findByText(/done must be a boolean./);
    });

    test("Correct Error messsages on missing input", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-submit");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/ProfessorEmail is required./);
        await screen.findByText(/RequesterEmail is required./);
        expect(screen.getByText(/Explanation is required./)).toBeInTheDocument();
        expect(screen.getByText(/dateRequested is required./)).toBeInTheDocument();
        expect(screen.getByText(/dateNeeded is required./)).toBeInTheDocument();
        expect(screen.getByText(/done is required./)).toBeInTheDocument();

    });

    test("No Error messsages on good input", async () => {

        const mockSubmitAction = jest.fn();


        render(
            <Router  >
                <RecommendationRequestForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-professorEmail");

        const professorEmailField = screen.getByTestId("RecommendationRequestForm-professorEmail");
        const requesterEmailField = screen.getByTestId("RecommendationRequestForm-requesterEmail");
        const explanationField = screen.getByTestId("RecommendationRequestForm-explanation");
        const DateRequestedField = screen.getByTestId("RecommendationRequestForm-DateRequested");
        const DateNeededField = screen.getByTestId("RecommendationRequestForm-DateNeeded");
        const doneField = screen.getByTestId("RecommendationRequestForm-done");
        const submitButton = screen.getByTestId("RecommendationRequestForm-submit");

        fireEvent.change(professorEmailField, { target: { value: 'email@example.com' } });
        fireEvent.change(requesterEmailField, { target: { value: 'email@example.com' } });
        fireEvent.change(explanationField, { target: { value: 'Explanation' } });
        fireEvent.change(DateRequestedField, { target: { value: '2022-01-01T12:00' } });
        fireEvent.change(DateNeededField, { target: { value: '2022-01-01T12:00' } });
        fireEvent.change(doneField, { target: { value: 'false' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/ProfessorEmail must be in the format email@example.com/)).not.toBeInTheDocument();
        expect(screen.queryByText(/RequesterEmail must be in the format email@example.com/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Explanation is required./)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateRequested must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/dateNeeded must be in ISO format/)).not.toBeInTheDocument();
        expect(screen.queryByText(/done must be a boolean./)).not.toBeInTheDocument();

    });


    test("that navigate(-1) is called when Cancel is clicked", async () => {

        render(
            <Router  >
                <RecommendationRequestForm />
            </Router>
        );
        await screen.findByTestId("RecommendationRequestForm-cancel");
        const cancelButton = screen.getByTestId("RecommendationRequestForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));

    });

});


