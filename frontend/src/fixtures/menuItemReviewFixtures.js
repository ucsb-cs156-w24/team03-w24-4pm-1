const menuItemReviewFixtures = {
    oneReview: {
        "id": 1,
        "itemId": 1,
        "reviewerEmail": "test@ucsb.edu",
        "stars": 5,
        "dateReviewed": "2022-01-02T12:00:00",
        "comments": "pretty good"
    },
    threeReviews: [
        {
            "id": 1,
            "itemId": 1,
            "reviewerEmail": "test1@ucsb.edu",
            "stars": 5,
            "dateReviewed": "2022-01-02T12:00:00",
            "comments": "pretty good"
        },
        {
            "id": 2,
            "itemId": 1,
            "reviewerEmail": "test2@ucsb.edu",
            "stars": 3,
            "dateReviewed": "2023-01-02T12:00:00",
            "comments": "its ok"
        },
        {
            "id": 3,
            "itemId": 1,
            "reviewerEmail": "test3@ucsb.edu",
            "stars": 1,
            "dateReviewed": "2023-04-02T12:00:00",
            "comments": "not very good"
        },
    ]
};


export { menuItemReviewFixtures };
