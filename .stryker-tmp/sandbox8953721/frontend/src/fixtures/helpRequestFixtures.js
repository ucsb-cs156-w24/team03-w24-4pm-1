const helpRequestFixtures = {
    oneHelpRequest: {
        "id": 1,
        "requesterEmail": "john@email.com",
        "teamID": "Team 1",
        "tableOrBreakoutRoom": "1",
        "localDateTime": "2024-01-01T00:00:00",
        "explanation": "none",
        "solved": false
    },
    threeHelpRequests: [
        {
            "id": 2,
            "requesterEmail": "jane@email.com",
            "teamID": "Team 2",
            "tableOrBreakoutRoom": "2",
            "localDateTime": "2024-01-02T00:00:00",
            "explanation": "some",
            "solved": false
        },
        {
            "id": 3,
            "requesterEmail": "jack@email.com",
            "teamID": "Team 3",
            "tableOrBreakoutRoom": "3",
            "localDateTime": "2024-01-03T00:00:00",
            "explanation": "all of it",
            "solved": true
        },
        {
            "id": 4,
            "requesterEmail": "james@email.com",
            "teamID": "Team 4",
            "tableOrBreakoutRoom": "4",
            "localDateTime": "2024-01-05T00:00:00",
            "explanation": "maybe",
            "solved": false
        }
    ]
};


export { helpRequestFixtures };