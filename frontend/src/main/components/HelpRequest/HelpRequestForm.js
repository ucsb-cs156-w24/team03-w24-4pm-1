import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function HelpRequestForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
        watch,
        setValue,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();
    const testIdPrefix = "HelpRequestForm-";
    const handleSolvedChange = (e) => {
        setValue("solved", e.target.checked); // Update the value of "solved"
    };
    
    // Stryker disable all
    // function just ensures that solved is set to false by default, so that it is generated even if the user doesn't interact w the switch.
    useEffect(() => {
        if (!initialContents?.hasOwnProperty("solved")) {
            setValue("solved", false);
        }
    }, [initialContents, setValue]);
    // Stryker restore all

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requesterEmail">RequesterEmail</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "requesterEmail"}
                    id="requesterEmail"
                    type="text"
                    isInvalid={Boolean(errors.requesterEmail)}
                    {...register("requesterEmail", {
                        required: "RequesterEmail is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requesterEmail?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="teamId">TeamId</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "teamId"}
                    id="teamId"
                    type="text"
                    isInvalid={Boolean(errors.teamId)}
                    {...register("teamId", {
                        required: "TeamId is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.teamId?.message}
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="tableOrBreakoutRoom">TableOrBreakoutRoom</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "tableOrBreakoutRoom"}
                    id="tableOrBreakoutRoom"
                    type="text"
                    isInvalid={Boolean(errors.tableOrBreakoutRoom)}
                    {...register("tableOrBreakoutRoom", {
                        required: "TableOrBreakoutRoom is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.tableOrBreakoutRoom?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="requestTime">RequestTime (iso format)</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "requestTime"}
                    id="requestTime"
                    type="datetime-local"
                    isInvalid={Boolean(errors.requestTime)}
                    {...register("requestTime", { 
                        required: "RequestTime is required." 
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.requestTime?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="explanation">Explanation</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "explanation"}
                    id="explanation"
                    type="text"
                    isInvalid={Boolean(errors.explanation)}
                    {...register("explanation", {
                        required: "Explanation is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.explanation?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Form.Group className="mb-3" >
                <Form.Check
                    type="switch"
                    id="solved"
                    data-testid={testIdPrefix + "solved"}
                    label="Solved"
                    checked={watch("solved")}
                    isInvalid={Boolean(errors.solved)}
                    onChange={handleSolvedChange}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.solved?.message}
                </Form.Control.Feedback>
            </Form.Group>


            <Button
                type="submit"
                data-testid={testIdPrefix + "submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default HelpRequestForm;