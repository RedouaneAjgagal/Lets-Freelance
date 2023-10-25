const completedProfileAggregateMatch = {
    "profile.category": { $exists: true, $ne: "" },
    "profile.country": { $exists: true, $ne: "" },
    "profile.phoneNumber": { $exists: true, $ne: 0 },
    "profile.description": { $exists: true, $ne: "" },
    "profile.roles.freelancer.dateOfBirth": { $exists: true, $ne: "" },
    "profile.roles.freelancer.jobTitle": { $exists: true, $ne: "" },
    "profile.roles.freelancer.skills": { $exists: true, $ne: [] },
    "user.stripe.bankAccounts": { $exists: true, $ne: [] },
}

export default completedProfileAggregateMatch;