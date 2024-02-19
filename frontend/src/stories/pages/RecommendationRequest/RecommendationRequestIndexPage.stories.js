import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { RecommendationRequestFixtures } from "fixtures/recommendationRequestFixtures";
import { rest } from "msw";

import RecommendationRequestIndexPage from "main/pages/RecommendationRequest/RecommendationRequestIndexPage";

export default {
    title: 'pages/RecommendationRequest/RecommendationRequestIndexPage',
    component: RecommendationRequestIndexPage
};

const Template = () => <RecommendationRequestIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationrequest/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationrequest/all', (_req, res, ctx) => {
            return res(ctx.json(RecommendationRequestFixtures.threeReviews));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/recommendationrequest/all', (_req, res, ctx) => {
            return res(ctx.json(RecommendationRequestFixtures.threeReviews));
        }),
        rest.delete('/api/recommendationrequest', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}