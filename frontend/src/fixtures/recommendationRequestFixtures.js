const RecommendationRequestFixtures = {
    oneRecommendationRequest: {
        "id": 1,
        "professorEmail": "Email",
        "requesterEmail": "Email",
        "explanation": "Explanation",
        "dateRequested": "2022-01-01T12:00:00",
        "dateNeeded": "2022-01-01T12:00:00",
        "done": false
    },
    threeRecommendationRequests: [
        {
            "id": 1,
            "professorEmail": "Email",
            "requesterEmail": "Email",
            "explanation": "Explanation",
            "dateRequested": "2022-01-01T12:00:00",
            "dateNeeded": "2022-01-01T12:00:00",
            "done": false
        },
        {
            "id": 2,
            "professorEmail": "Email",
            "requesterEmail": "Email",
            "explanation": "Explanation",
            "dateRequested": "2022-02-01T12:00:00",
            "dateNeeded": "2022-02-01T12:00:00",
            "done": false
        },
        {
            "id": 3,
            "professorEmail": "Email",
            "requesterEmail": "Email",
            "explanation": "Explanation",
            "dateRequested": "2022-03-01T12:00:00",
            "dateNeeded": "2022-03-01T12:00:00",
            "done": false
        }
    ]
};


export { RecommendationRequestFixtures };