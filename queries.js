// 1 Find all the topics and tasks which are taught in the month of October
db.topics.aggregate([
    {
        $match: {
            "date_taught": { $gte: ISODate("2020-10-01"), $lt: ISODate("2020-11-01") }
        }
    },
    {
        $lookup: {
            from: "tasks",
            localField: "_id",
            foreignField: "topic_id",
            as: "related_tasks"
        }
    }
]);

// 2 Find all the company drives between 15-Oct-2020 and 31-Oct-2020
db.company_drives.find({
    "date": { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") }
});

// 3 Find all the company drives and students who appeared for placement
db.company_drives.aggregate([
    {
        $lookup: {
            from: "users",
            localField: "students_appeared",
            foreignField: "_id",
            as: "students"
        }
    },
    {
        $project: {
            "company_name": 1,
            "date": 1,
            "students.name": 1,
            "students.email": 1
        }
    }
]);

// 4 Find the number of problems solved by each user in Codekata
db.users.aggregate([
    {
        $lookup: {
            from: "codekata",
            localField: "_id",
            foreignField: "user_id",
            as: "codekata_data"
        }
    },
    {
        $unwind: "$codekata_data"
    },
    {
        $project: {
            "name": 1,
            "email": 1,
            "codekata_score": "$codekata_data.problems_solved"
        }
    }
]);

// 5 Find all the mentors who have mentee count more than 15
db.mentors.find({
    $expr: { $gt: [{ $size: "$mentees" }, 15] }
});

// 6 Find users who are absent and task is not submitted between 15-Oct-2020 and 31-Oct-2020
db.users.aggregate([
    {
        $match: {
            "attendance": {
                $elemMatch: {
                    "date": { $gte: "2020-10-15", $lte: "2020-10-31" },
                    "status": "absent"
                }
            },
            "tasks_submitted": {
                $not: {
                    $elemMatch: {
                        "date": { $gte: "2020-10-15", $lte: "2020-10-31" },
                        "status": "submitted"
                    }
                }
            }
        }
    },
    {
        $count: "absent_users"
    }
]);
