// Find all the topics and tasks taught in October
db.topics.aggregate([
    {
        $match: {
            "date_taught": { $gte: ISODate("2020-10-01"), $lt: ISODate("2020-11-01") }
        }
    }
]);

// Find all company drives between 15-Oct-2020 and 31-Oct-2020
db.company_drives.find({
    "date": { $gte: ISODate("2020-10-15"), $lte: ISODate("2020-10-31") }
});
