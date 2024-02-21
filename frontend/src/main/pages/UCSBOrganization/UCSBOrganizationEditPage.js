import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import UCSBOrganizationForm from "main/components/UCSBOrganization/UCSBOrganizationForm";
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function UCSBOrganizationEditPage({storybook=false}) {
  let { orgCode } = useParams();

  const { data: ucsbOrg, _error, _status } =
    useBackend(
      // Stryker disable next-line all : don't test internal caching of React Query
      [`/api/ucsborganization?orgCode=${orgCode}`],
      {  // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
        method: "GET",
        url: `/api/ucsborganization`,
        params: {
          orgCode
        }
      }
    );


  const objectToAxiosPutParams = (ucsbOrg) => ({
    url: "/api/ucsborganization",
    method: "PUT",
    params: {
      orgCode: ucsbOrg.orgCode,
    },
    data: {
      orgCode: ucsbOrg.orgCode,
      orgTranslationShort: ucsbOrg.orgTranslationShort,
      orgTranslation: ucsbOrg.orgTranslation,
      inactive: ucsbOrg.inactive
    }
  });

  const onSuccess = (ucsbOrg) => {
    toast(`UCSBOrganization Updated - orgCode: ${ucsbOrg.orgCode} orgTranslation: ${ucsbOrg.orgTranslation}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/ucsborganization?orgCode=${orgCode}`]
  );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/ucsborganization" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit UCSBOrganization</h1>
        {
          ucsbOrg && <UCSBOrganizationForm initialContents={ucsbOrg} submitAction={onSubmit} buttonLabel="Update" />
        }
      </div>
    </BasicLayout>
  )
}