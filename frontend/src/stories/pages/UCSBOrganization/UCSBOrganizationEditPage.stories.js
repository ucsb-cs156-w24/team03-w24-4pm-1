<<<<<<< HEAD

=======
>>>>>>> 595e3db71fa88225abd2ed9e376653cdeb9a906d
import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { orgFixtures } from "fixtures/ucsbOrganizationFixtures";
import { rest } from "msw";

import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

export default {
    title: 'pages/UCSBOrganization/UCSBOrganizationEditPage',
    component: UCSBOrganizationEditPage
};

const Template = () => <UCSBOrganizationEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsborganization', (_req, res, ctx) => {
            return res(ctx.json(orgFixtures.threeOrgs[0]));
        }),
        rest.put('/api/ucsborganization', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
<<<<<<< HEAD
}


=======
}
>>>>>>> 595e3db71fa88225abd2ed9e376653cdeb9a906d
