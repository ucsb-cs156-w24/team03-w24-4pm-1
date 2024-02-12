const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "john@email.com",
        "teamID": "Team 5",
        "tableOrBreakoutRoom": "1",
        "requestTime": "2024-01-01T00:50:00",
        "explanation": "no",
        "solved": true
    },
    threeHelpRequests: [
        {
            "id": 2,
            "requesterEmail": "jane@email.com",
            "teamID": "Team 2",
            "tableOrBreakoutRoom": "2",
            "requestTime": "2024-01-02T00:00:00",
            "explanation": "some",
            "solved": false
        },
        {
            "id": 3,
            "requesterEmail": "jack@email.com",
            "teamID": "Team 3",
            "tableOrBreakoutRoom": "3",
            "requestTime": "2024-01-03T00:00:00",
            "explanation": "all of it",
            "solved": true
        },
        {
            "id": 4,
            "requesterEmail": "james@email.com",
            "teamID": "Team 4",
            "tableOrBreakoutRoom": "4",
            "requestTime": "2024-01-05T00:00:00",
            "explanation": "maybe",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };