# Lets Freelance, Freelancing & Hiring Platform

"Let's Freelance" is a full-stack web application built using the MERN stack, created as a portfolio project.

## Table of contents
- [About the Platform](#about-the-platform)
    - [Overview](#overview)
        - [Auth](#auth)
        - [Profiles](#profiles)
        - [Services](#services)
        - [Jobs](#jobs)
        - [Contracts](#contracts)
        - [Advertisements](#advertisements)
    - [Unauthenticated User Features](#unauthenticated-user-features)
        - [Auth](#auth-1)
        - [Profiles](#profiles-1)
        - [Services](#services-1)
        - [Jobs](#jobs-1)
        - [Reviews](#reviews)
        - [Advertisement](#advertisement)
    - [Authenticated User Features](#authenticated-user-features)
        - [Auth](#auth-2)
        - [Profiles](#profiles-2)
        - [Services](#services-2)
        - [Jobs](#jobs-2)
        - [Proposals](#proposals)
        - [Reviews](#reviews-1)
        - [Contracts](#contracts-1)
        - [Advertisement](#advertisement-1)
        - [Reports](#reports)
        - [Favorites](#favorites)
        - [Messages](#messages)
    - [Authenticated User Features (Admin)](#authenticated-user-features-admin)
        - [Profiles](#profiles-3)
        - [Services](#services-3)
        - [Jobs](#jobs-3)
        - [Reports](#reports-1)
        - [Proposals](#proposals-1)
        - [Contracts](#contracts-2)
        - [Advertisement](#advertisements-1)
    - [Authenticated User Features (Owner)](#authenticated-user-features-owner)
        - [Revenues](#revenues)
- [Tech Stack](#tech-stack)
    - [Server Side](#server-side)
    - [Client Side](#client-side)
- [What Went Wrong](#what-went-wrong)
- [Nice To Implement](#nice-to-implement)
- [FAQs](#faqs)
- [Socials](#socials)

## About the Platform

### Overview

#### Auth

Users can create a free account using their email, name, and password and choose to be either an employer or a freelancer.

A confirmation email will be sent after creating an account.

Users can change their password by providing their email, a "Forget Password" email with a "Reset Password" link will be sent to their provided email.

Users can reset their password using the "Reset Password" link by providing a new password.

Users can log in using their email and password or through "Quick Access"

User can change their email, a "Reset Email" link will be sent to the original email. By using this link, users can provide a new email.

Users can also delete their account, currently a hard deletion, but it should be a soft deletion to avoid any reference issues. For now, deleting a user will result in a 400 error.

#### Profiles

Both freelancers and employers can change their settings.

Freelancers have bank account section where they can set up their bank accounts, either manually or through "Quick Access" to receive payouts from services and jobs.

##### Freelancer Badges

Freelancers can earn badges on their profiles. To earn a badge, freelancers need to meet certain qualifications. A general Requirement is to complete their profile information (category, country, phone number, etc).

###### Rising Talent

"Rising Talent" is the first badge, Conditions required (in the last 30 days):

 - At least 12 proposals submitted to jobs
 - At least 2 proposals approved **or** 1 proposal submitted and at least 3 proposals in interviewing

Rising Talent upgrades happen automatically for qualified profiles every two week on Mondays at 8:30 AM.

Profiles are upgraded in batches of 100 every 5 seconds.

Freelancers receive **10** free connects upon upgrading to Rising Talent.

###### Top Rated

"Top Rated" is the second powerful badge. Conditions required (in the last 360 days):

 - The first contract must be at least 90 days old
 - At least $2,500.00 earned in the last 360 days

Top Rated upgrades happen automatically for qualified profiles every two week on Mondays at 10:30 AM.

Profiles are upgraded in batches of 100 every 5 seconds.

Freelancers receive **16** free connects upon upgrading to Top Rate.

###### Top Rated Plus

"Top Rated Plus" is the most powerful badge. Conditions required (in the last 360 days):

 - The profile must already be a "Top Rated"
 - Must have a rating of 4.5 and above
 - Must have a single contract that earned at least +$1,000.00 (in the last 360 days)

Top Rated Plus upgrades happen automatically for qualified profiles every 30 days on mondays at 2:15 PM.

Profiles are upgraded in batches of 1000 every 5 seconds.

Freelancers receive **35** free connects upon upgrading to Top Rate Plus.

#### Services

**Important**

Freelancers incur a fixed 15% fee.


Freelancers can create as many services as they want for free but incur a fixed 15% fee upon completing the service. freelancers are required to set up their bank accounts before creating services.

Employers can order the services with no extra cost on their side. The money goes to the platform's Stripe account and is held there until the service is marked as completed by both the freelancer and employer.

By ordering a service, a "Service order" email is sent to both freelancer and employer and a contract get created between the two that holds all the service information

When the service is marked as completed, the money is transferred from the platform stripe to the freelancer's bank account, minus the 15% fee.

Employers have the right to request a refund by providing information on why it should be refunded. An admin will review the refund request and decide whether to refund the service or not. Employers have up to 5 days after the service is completed to request a refund.

Exmaple:

 - Job budget: $500.00
 - Fee: 15%
 - Freelancer receives: $425.00
 - Platform revenue: $75.00

The platform holds the money until the job is marked as completed by both the freelancer and the employer. Then, the money is transferred to the freelancer minus the 15% fee. The freelancer needs to wait for 10 days to receive their money to ensure a 5-day period for the employer to request a refund.


#### Jobs

**Important**

Unlike service fees, job fees work differently using "Tiered Fee Structure".

1. `<$500 = 20% fee`
2. `$500 to $10,000 = 10% fee`
3. `>$10,000 = 5% fee`


Employers can create as many jobs as they want for free. Jobs can either be "Fixed Budget Job" or "Hourly Job". A "Create a New Job" email is sent to the employer when creating the job.

Freelancers can apply to jobs by sending proposals using their connects. Each job generates the connects required to apply based on the job price, job type (hourly or fixed), and job duration. The minimum connects required are 1m and the maximum is 16.

Freelancers can also boost their proposals using connects. Boosting proposals increases their visibility and sorts them at the top above other proposals. If both proposals are boosted with the same amount of connects, the one submitted first is ranked higher.

Employers can set a job as closed, meaning no freelancer can send proposals anymore.

Employers can view all proposals related to a specific job, and can approve, reject or interview them.

When interviewing a proposal, an initial message is sent to the freelancer. Then employer and freelancer can then chat and decide to either approve or reject the proposal.

Upon approving a proposal, a contract is created between the two parties. The contract holds all the information of the job plus the proposal content, and a "Job Proposal Approval" email is sent to both the freelancer and employer.

If the approved proposal was a fixed budget proposal, the employer must pay the budget plus a 3% fee to ensure the freelancer recieves the money upon completing the work. The money is sheld in the platform's Stripe account until the job is marked as completed by both the freelancer and employer. The money is then transferred to the freelancer's bank account minus the job fee.

If the approved proposal is an hourly proposal, then the employer doesn't need to pay any money or fee upfront. The freelancer can submit worked hours, and the employer must pay the worked hours plus a 3% fee. A "Paid Hours Job" email is sent to both the freelancer and employer. The money is transferred instantly to the freelancer's bank account minus the job fee once the employer pays.


##### Fixed Budget Job

 - Fixed budget job require the employer to pay the job budget plus 3% fee when approving a proposal. The money is held in the platform's Stripe account. Once the job is marked as completed by both the freelancer and employer, the money is transferred to the freelancer minus the tiered fee structure.

Exmaple:

 - Job budget: $750.00 (fixed)
 - Empoyer pays: $772.50 (3% fee)
 - Freelancer receives: $625.00 ($500.00 at 20% fee + $250.00 at 10% fee)
 - Platform revenue: $147.50 (3% fee of job budget + 20% fee of $500.00 + 10% fee of $250.00)

##### Hourly Job

 - Hourly jobs do not require any payment or fee when approving proposals by the employer. The freelance can submit worked hours, and the employer can pay for the worked hours plus 3% fee. The platfrom transfers the money directly to the freelancer using `Stripe Connected Account` minus the tiered fee structure.

Exmaple:

 - Hourly rate: $20.00/hour
 - First submitted hours: 18 hours
  - Empoyer pays: $370.80 ($360.00 + $10.80 (3% fee))
  - Freelancer receives: $288.00 ($360.00 at 20% fee)
 - Second submitted hours: 26 hours
  - Empoyer pays: $535.60 ($520.00 + $15.60 (3% fee))
  - Freelancer receives: $454.00 ($140.00 at 20% fee + $380.00 at 10% fee)
 - Platform revenue: $164.40 (3% + 3% job fee of both payments + 20% fee of the first $500.00 + 10% fee of the rest $380.00)


#### Contracts

A contract holds all the information between the freelancer and employer.

A contract is created when the employer:

 - orders a service
 - approves a job proposal

Contracts can be canceled by the employer or freelancer.

To cancel a contract, the user submits a cancellation request, which an admin reviews. The admin can either accept or reject the request.

 - If the request is accepted, the freelancer stops working on the service/job for the employer.
 - If the request is rejected, the contract continues as normal.

In either case, a "Platform Decision" email is sent to both the freelancer and employer.

Contracts can be marked as completed by both the employer and freelancer. When both sides mark the contract as completed, a rating section becomes available.

Both the employer and freelancer can rate the contract and submit a review. These reviews will be visible on their profiles/services/jobs.

Employers can request a refund if they have already paid for the contract.

#### Advertisements

Freelancers can advertise their services, with each advertised service labeled as "Sponsored" to increase visibility. Sponsored services rank higher in search results.

Freelancers need to set up their "Payment Methods" to start advertisements.

Freelancers can create campaigns, with each campaign containing ad sets. The minimum number of ad sets is 1, and the maximum is 10 per campaign.

When creating a campaign, display periods are generated for each ad set (the period during which the ad is visible). If the campaign has a total budget, display periods are split based on the campaign's start and end dates. If the campaign has a daily budget, display periods are split into 24-hour intervals starting from the moment the campaign is created. New 24-hour display periods are generated daily until the campaign ends.

The advertisement system searches for daily campaigns that need to generate new display periods every 15 minutes. Display periods are generated in batches of 500 campaigns every 1.5 seconds.

Freelancers can update the campaign or ad set. If the update affects ad performance (e.g., campaign budget, ad bid amount), a new display period is generated based on the updated information.

Freelancers can set the ad set to either Cost-Per-Click (CPC) or Cost-Per-Thousand-Impressions (CPM):

 - CPC billing: You only pay when someone clicks on your ad. Each click on your service ad deducts from your campaign budget.

 - CPM billing: You pay each time your ad is shown a certain number of times (1,000 impressions).

Freelancers are automatically charged every Monday and Thursday at 12:00 PM. If automatic charges fail due to unpaid invoices (e.g., no funds), all campaigns will be paused, and the freelancer won't be able to create more campaigns or have sponsored services.

Freelancers need to update their payment method to resolve any outstanding invoices. Once all invoices are paid, freelancers can promote their services again.

Using [Stripe Webhooks](https://docs.stripe.com/webhooks) to ensure whether an invoice has been paid successfully or not.

### Unauthenticated User Features

#### Auth

 - Register as a freelancer or employer
 - Log in as a freelancer, employer, admin or owner
 - Verify email
 - Forget password (send a reset password link to the user's email)
 - Reset password

#### Profiles

 - Display single profile information (freelancer or employer)
 - Display high-rated freelancers on the home page (currently up to 8 freelancers)
 - Display all freelancers, sorted by the current user's IP address. This ensures that each user sees different results even with the same search keyword.
 - Search all freelancers with advanced filters on the freelancers page

#### Services

 - Display and search all services with advanced filters on the services page
 - Display trending services on the home page (currently up to 8 services that has been purchased the most in the last 7 days, if there are fewer than 8, fill the rest with trending services from the last 365 days)
 - Display single service information

#### Jobs

 - Display and search all jobs with advanced filters on the jobs page
 - Display single job information

#### Reviews
 
 - Display service reviews (for the current service or for every service and job) 
 - Display profile reviews (freelancers / employers)

#### Advertisement

 - View sponsored services on the services page
 - Track the ad engagement by viewing sponsored services
 - Track click actions by clicking on the service


### Authenticated User Features

#### Auth 

 - Log out
 - Change email (send a change email link to the original email)
 - Reset email

#### Profiles

 - View current user's profile information
 - Update user's profile
 - Delete user's profile (currently a hard deletion, it should be a soft deletion to avoid any reference issues, so for now, deleting a user will throw a 400 error)
 - View profile reports
 - View profile statements and recent payments

##### Freelancer Only

 - Buy connects ($0.34 each)
 - View freelancer's bank accounts
 - Create bank accounts for payouts (10-days delay) using [stripe_accounts_create](https://docs.stripe.com/api/accounts/create)
 - Create external bank accounts to the main bank account
 - Delete the main bank account
 - Remove external bank accounts

#### Services

##### Freelancer Only

 - View current user's services
 - Create services
 - Update services
 - Delete services

##### Employer Only

 - Order services (employers don't pay any extra fees for services, but freelancers incur a fixed 15% fee. The money goes to the platform's Stripe account and is held there until the service is marked as completed by both the freelancer and employer. After completion, the amount, minus the 15% fee, is transferred to the freelancer's bank account)
 - View purchased services

#### Jobs

##### Employer Only

 - View current user's jobs
 - Create jobs
 - Update jobs
 - Delete jobs

#### Proposals

##### Freelancer Only

 - View current user's proposals
 - Create proposals and boost them using connects

##### Employer Only

 - Display freelancer's proposals related to a specific job
 - Interview, reject or approve proposals

#### Reviews

 - Create reviews with rating
 - Update reviews
 - Delete reviews

#### Contracts

 - Display user's contracts
 - View contract details
 - request a contract cancellation
 - complete contract

##### Freelancer Only

 - Submit worked hours (available only for hourly job contracts) 

##### Employer Only

 - Pay worked hours (available only for hourly job contracts)
 - create a refund request (contract must still be in progress and the request must be made within 5 days of the freelancer receiving the money)

#### Advertisement

##### Freelancer Only

**Payment Methods**

 - Create payment methods to start advertisements using [stripe_setupIntents_create](https://docs.stripe.com/api/setup_intents/create) attached with <Elements> component provided by Stripe client-side
 - Display all payment methods
 - Delete payment method
 - Pay unpaid invoices when changing the payment method


**Campaigns**

 - Create campaigns (up to 10 ad sets per campaign)
 - View campaign details (performance)
 - Update campaign
 - Delete campaign

**Ads**

 - Create a new ad related to a campaign
 - View ad details (performance)
 - Update ad
 - Delete ad

**Performances**

 - track ad orders

#### Reports

 - Create reports (report a freelancer, employer, job or service)

#### Favorites

 - Display all favorites (freelancers, employer, services and jobs)
 - Toggle to favorite or unfavorite

#### Messages

 - Display recent messages with user's contacts
 - Display contact messages
 - Real-time chat using WebSocket

##### Employer Only

 - set up an initial message to the freelancer


### Authenticated User Features (Admin)

#### Profiles

 - Get total accounts of all time
 - Get created accounts
 - Get verified accounts
 - Get total number of freelancers and employers
 - Get total number of freelancers with badges
 - Get total number of freelancers who spend on connects
 - Get total number of employers who spend on services

#### Services

 - Get total services of all time
 - Get created services
 - Get rated services

#### Jobs

 - Get total jobs of all time
 - Get created jobs
 - Get total number of job types (hourly and fixed)
 - Get hourly and fixed job budgets

#### Reports

 - Get total reports of all time
 - Get created reports
 - Get total number of report types (profiles, jobs, and services)

#### Proposals

 - Get total proposals of all time
 - Get created proposals
 - Get total number of proposal types (hourly - fixed)
 - Get proposal status (approved, rejected, pending, and interviewing)
 - Get total number of proposal boosters and their types (fixed or hourly)
 - Get the top 3 boosters

#### Contracts

 - View contract cancellation requests
 - Approve or reject the contract cancellation request
 - View refund requests
 - Approve or reject the refund request
 - View event reports (employer, freelancer, services and jobs)
 - Get total contracts of all time
 - Get created contracts
 - Get submitted contract types (service - job)
 - Get contract status (in progress, completed, and canceled)
 - Get cancellation request status (approved, pending, and rejected)

#### Advertisements

**Campaigns**

 - Get total campaigns of all time
 - Get created campaigns
 - Get campaign status (active - inactive)
 - Get total number of campaigns in today's range
 - Get campaign types (daily - total)
 - Get campaign budgets (daily or total campaigns)
 - Get total number of ads per campaign

**Ads**

 - Get total ads of all time
 - Get created ads
 - Get ad status (active - inactive)
 - Get ad events (cpc - cpm)
 - Get ad bid amounts
 - Get ads displaying now
 - Get ads that have made orders

### Authenticated User Features (Owner)

ADMIN FEATURES PLUS:

#### Revenues

**Services**

 - Get processed, pending, and refunded payments (gross and net revenue)

**Jobs**

 - Get hourly job processed and refunded payments (gross and net revenue)
 - Get fixed job processed, pending, and refunded payments (gross and net revenue)

**Connects**

 - Get processed payments (gross and net revenue)

**Advertisements**

 - Get processed, pending, and failed payments (net revenue)

## Tech Stack

### Server Side

 - TypeScript
 - Node.js
 - Express.js
 - MongoDB
 - Mongoose
 - Cloudinary
 - Stripe
 - WebSocket

### Client Side

 - TypeScript
 - React.js
 - TailwindCSS
 - React Router
 - Redux Toolkit
 - React Query
 - Axios
 - Stripe


## What Went Wrong

### Hard Deletion

Currently, all deletions (profiles, services, jobs, etc.) are hard deletions, which has prevented me from creating comprehensive analytics for the admin and owner dashboards. I should have implemented soft deletions or at least kept track of each deletion to retain this data.

### Too Many Features

Initially, everything was small and manageable. However, as I kept adding more features (contracts, Stripe payments, webhooks, etc.), the system became more complex and intertwined. To handle these features properly, I should have used something like [Apache Kafka](https://kafka.apache.org/) for better management and decoupling of services. This will be my next learning focus after Unit testing.

## Nice To Implement

### Unit Testing

I haven't created any unit testing files for this platform yet, as I haven't learned about unit testing. My next learning goal is React testing using Jest to begin incorporating unit tests into my projects.

### Notification System

Besides emails, it is currently difficult to know if you have a new order, proposal, message, etc. A notification system would significantly improve the user experience.

### Admins Can See User Messages

Currently, if a user requests a refund or contract cancellation, admins can review the contract information but cannot review the chat between the two parties. Implementing this feature would be straightforward since messages are stored in the database with references to both the freelancer and employer.

### Image Detection

At the moment, there is no image detection feature, allowing freelancers to create services with any kind of images, which could lead to the submission of inappropriate content. Implementing image detection would help mitigate this issue.

### File Sharing

In addition to chat messages, users should be able to share files and images. This feature would enhance communication and collaboration between users.

## FAQs

### Is the UI design made by me?

Not really. Most of the design is inspired by [Freeio](https://demoapus1.com/freeio/) or [Upwork](https://www.upwork.com/). However, all the code is written by me, using these designs as references since I am not a designer.

### Do all the features on the platform work dynamically?

Yes, all the features on the platform work dynamically, and every piece of data displayed is 100% dynamic, except for the footer links.

## Socials

 - [Github](https://github.com/RedouaneAjgagal)
 - [Twitter](https://twitter.com/redouaneajgagal)