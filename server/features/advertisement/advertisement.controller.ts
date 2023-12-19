import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from "../../errors";
import { RequestHandler } from "express";
import { CustomAuthRequest } from "../../middlewares/authentication";
import createCampaignValidator from "./validators/createCampaignValidator";
import { Profile } from "../profile";
import advertisementModels, { AdType, AdTypeWithoutRefs, CampaignType, PerformanceType, Tracker } from "./advertisement.model";
import { serviceModel as Service } from "../service";
import mongoose, { isValidObjectId } from "mongoose";
import { isInvalidBudgetType, isInvalidEmail } from "./validators/inputValidations";
import getValidUpdatedCampaignInputs from "./helpers/getValidUpdatedCampaignInputs";
import createAdValidator from "./validators/createAdValidator";
import calcBudgetAllocation from "./utils/calcBudgetAllocation";
import getValidUpdatedAdInputs from "./helpers/getValidUpdatedAdInputs";
import getDisplayPeriods, { createCampaignAdDisplayPeriods } from "./display_periods/getDisplayPeriods";
import "./display_periods/generates";
import getValidAdKeywordInput from "./helpers/getValidAdKeywordInput";
import calculateCtr from "./utils/calculateCtr";
import calculateCr from "./utils/calculateCr";
import { Order } from "../service/service.model";
import calculateCpc from "./utils/calculateCpc";
import createCustomer from "../../stripe/createCustomer";
import { User } from "../auth";
import createCustomerValidator from "./validators/createCustomerValidator";
import stripe from "../../stripe/stripeConntect";
import { createPaymentMethodAndAttachToCustomer } from "../../stripe/createPaymentMethod";
import "./payments/invoicesSchedule";



//@desc set payment methods info for advertisements
//@route POST /api/v1/advertisements/payment-methods
//@access authentication (freelancers only)
const createPaymentMethods: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { cardToken, name, email } = req.body;

  // find user
  const user = await User.findById(req.user!.userId);
  const profile = await Profile.findOne({ user: user?._id });
  if (!user || !profile) {
    throw new UnauthenticatedError("Found no user");
  }


  // check if the user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to create payment methods. Freelancers only");
  }

  // check if valid values
  createCustomerValidator({ cardToken, name, email });

  const customerDetails = {
    userId: user._id.toString(),
    cardToken,
    email,
    name
  }

  // if the freelancer already is a customer then create another payment method for the same customer
  if (user.stripe.customer_id) {
    const paymentMethod = await createPaymentMethodAndAttachToCustomer({ ...customerDetails, customerId: user.stripe.customer_id });

    // make the new payment method as default payment
    await stripe.customers.update(user.stripe.customer_id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    // check if there is unpaid invoices
    if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
      // pay all invoices
      for (const unpaidInvoice of profile.roles.freelancer!.advertisement.unpaidInvoices) {
        try {
          const invoice = await stripe.invoices.pay(unpaidInvoice);

          // if the invoice has been paid successful then remove the unpaid invoice id from the unpaid invoices array
          if (invoice.status === "paid") {
            profile.roles.freelancer!.advertisement.unpaidInvoices = profile.roles.freelancer!.advertisement.unpaidInvoices.filter(unpaidInvoice => unpaidInvoice !== invoice.id);
            profile.save();
          }
        } catch (error: any) {
          // check if the freelancer tried until the invoice is no longer payable
          if (error.message.startsWith("This invoice can no longer be paid")) {
            // create a new invoice based on the unpayable invoice
            const clonedInvoice = await stripe.invoices.create({
              from_invoice: {
                action: "revision",
                invoice: unpaidInvoice
              }
            });

            // push the new invoice as unpaid invoice
            profile.roles.freelancer!.advertisement.unpaidInvoices.push(clonedInvoice.id);

            // remove the unpayable invoice from freelancer's unpaid invoices to avoid the duplication
            profile.roles.freelancer!.advertisement.unpaidInvoices = profile.roles.freelancer!.advertisement.unpaidInvoices.filter(freelancerUnpaidInvoice => freelancerUnpaidInvoice !== unpaidInvoice);
            await profile.save();

            try {
              await stripe.invoices.pay(clonedInvoice.id);
              return res.status(StatusCodes.CREATED).json({ msg: "New payment method has been added successfully" });
            } catch (error: any) {
              console.log(`Invoice pay error when attaching new payment method after making a new invoice clone: ${error.message}`);
              throw new BadRequestError(`Unable to pay unpaid invoices after setting the new payment method`);
            }
          }

          console.log(`Invoice pay error when attaching new payment method: ${error.message}`);
          throw new BadRequestError(`Unable to pay unpaid invoices after setting the new payment method`);
        }
      }
    }

    return res.status(StatusCodes.CREATED).json({ msg: "New payment method has been added successfully" });
  }

  // create new customer
  const customer = await createCustomer(customerDetails);

  // set customer ID to the user
  user.stripe.customer_id = customer.id;
  await user.save();

  res.status(StatusCodes.CREATED).json({ msg: "Payment method has been added successfully" });
}


//@desc get payment methods info
//@route GET /api/v1/advertisements/payment-methods
//@access authentication (freelancers only)
const getPaymentMethods: RequestHandler = async (req: CustomAuthRequest, res) => {
  // find user
  const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
  if (!user) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the user is a freelancer
  if (user.profile!.userAs !== "freelancer") {
    throw new BadRequestError("You dont have access to payment methods. Freelancers only");
  }

  // if the freelancer didnt set a payment method then return an empty array
  if (!user.stripe.customer_id) {
    return res.status(StatusCodes.OK).json([]);
  }

  // get freelancer's payment methods
  const paymentMethods = await stripe.paymentMethods.list({ customer: user.stripe.customer_id });

  const cards = paymentMethods.data.map(data => {
    const cardDetails = {
      id: data.id,
      brand: data.card!.brand,
      exp_month: data.card!.exp_month,
      exp_year: data.card!.exp_year,
      last4: data.card!.last4,
      createdAt: data.created
    };

    return cardDetails;
  });

  // make the default payment method be first
  cards.sort((a, b) => b.createdAt - a.createdAt);

  res.status(StatusCodes.OK).json(cards);
}


//@desc delete payment method
//@route DELETE /api/v1/advertisements/payment-methods/:paymentMethodId
//@access authentication (freelancers only)
const deletePaymentMethod: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { paymentMethodId } = req.params;
  // check if paymentMethodId is exist
  if (!paymentMethodId || paymentMethodId.toString().trim() === "") {
    throw new BadRequestError("Payment method ID is missing");
  }

  // find user
  const user = await User.findById(req.user!.userId).populate({ path: "profile", select: "_id userAs" });
  if (!user) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if user is a freelancer
  if (user.profile!.userAs !== "freelancer") {
    throw new BadRequestError("You dont have access to delete payment methods. Freelancers only");
  }

  // check if the freelancer is already a customer
  if (!user.stripe.customer_id) {
    throw new BadRequestError("You haven't set a payment method yet");
  }

  // get the stripe customer
  const paymentMethods = await stripe.paymentMethods.list({ customer: user.stripe.customer_id });
  // sort by newest
  paymentMethods.data.sort((a, b) => b.created - a.created);

  const paymentMethod = paymentMethods.data.find(data => data.id === paymentMethodId.toString());
  if (!paymentMethod) {
    throw new NotFoundError(`Found no payment method with ID ${paymentMethodId}`);
  }

  // detach payment method from customer's payment methods
  await stripe.paymentMethods.detach(paymentMethod.id);

  // if default payment method has been detached then make the latest one created to be default
  if ((paymentMethods.data[0].id === paymentMethod.id) && paymentMethods.data.length > 1) {
    const updatedPaymentMethods = paymentMethods.data.filter(data => data.id !== paymentMethod.id);

    const defaultPaymentMethod = updatedPaymentMethods[0];

    await stripe.customers.update(defaultPaymentMethod.customer!.toString(), {
      invoice_settings: {
        default_payment_method: defaultPaymentMethod.id
      }
    });
  }

  res.status(StatusCodes.OK).json({ msg: `The ${paymentMethod.card!.brand} card ending in ${paymentMethod.card!.last4} was removed` });
}


//@desc create campaign
//@route POST api/v1/advertisements/campaigns
//@access authentication (freelancers only)
const createCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
  const input = req.body;

  // check if value inputs
  createCampaignValidator(input);

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId }).populate({ path: "user", select: "_id stripe.customer_id" });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current profile is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to create campaigns. Freelancers only");
  }

  // check if the freelancer is already a customer (at least created payment method once)
  if (!profile.user!.stripe!.customer_id) {
    throw new BadRequestError("You must set a payment method to start creating campaigns");
  }

  // check if the freelancer doesnt have any unpaid invoices
  if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
    throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
  }

  // get IDs of the services
  const idServices: mongoose.Types.ObjectId[] = []; // ID services to check later if these are valid IDs and current freelancer have access to them

  const inputAds: (AdTypeWithoutRefs & { service: string })[] = input.ads; // Input ads that has been provided by the freelancer. It desnt incude user ID 

  const ads: (AdTypeWithoutRefs & { service: string; user: mongoose.Types.ObjectId })[] = []; // ads that used to create AD documents. It includes user ID

  // get total bid amount to calc the daily budget allocation for each ad
  const getTotalbidAmount = inputAds.reduce((num, ad) => {
    return ad.bidAmount + num;
  }, 0);

  inputAds.forEach(ad => {
    // push service IDs to check if exist and auhenticated by the freelancer
    idServices.push(new mongoose.Types.ObjectId(ad.service));

    // calc daily budget allocation and push to ads array
    const budgetAllocation = (ad.bidAmount / getTotalbidAmount) * input.budget;

    const displayPeriods = createCampaignAdDisplayPeriods({
      ad: {
        bidAmount: ad.bidAmount,
        budgetAllocation,
        event: ad.event
      },
      campaign: {
        budgetType: input.budgetType,
        endDate: input.endDate,
        startDate: input.startDate
      }
    });


    const startDate = new Date(input.startDate);
    const nextPeriod = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

    ads.push({
      ...ad, user: profile.user._id, budgetAllocation, displayPeriods, nextPeriodGenerationDates: input.budgetType === "daily" ? [nextPeriod] : []
    });
  });

  // find services by id provided and if belongs to the current user
  const services = await Promise.all(
    idServices.map(id => Service.countDocuments({ _id: id, user: profile.user._id, profile: profile._id }))
  );

  // check if all services exists
  const allServicesExists = services.every(service => service === 1);
  if (!allServicesExists) {
    throw new BadRequestError("Invalid provided services");
  }

  // create ads
  const createdAds = await advertisementModels.Ad.insertMany(ads);

  // create the ads performance
  createdAds.forEach(ad => {
    const performace: PerformanceType = {
      ad,
      trackers: [],
      cpmImpressions: 0,
      displayCount: 0,
      clicks: 0,
      orders: 0,
      ctr: 0,
      cr: 0,
      cpc: 0
    }
    advertisementModels.Performance.create(performace);
  });

  // get all campaign details
  const campaignDetails = {
    user: profile.user._id,
    name: input.name,
    budget: input.budget,
    budgetType: input.budgetType,
    startDate: input.startDate,
    endDate: input.endDate,
    ads: createdAds,
    payments: []
  }

  // create campaign
  const campaign = await advertisementModels.Campaign.create(campaignDetails);

  res.status(StatusCodes.CREATED).json({ msg: `New campaign '${campaign.name}' has been created` });
}


//@desc display freelancer's campaigns
//@route GET api/v1/advertisements/campaigns
//@access authentication (freelancers only)
const getCampaigns: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { search, budget_type, budget_range, ads } = req.query;

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current profile is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
  }

  // pick only freelancer's campaigns
  const match: mongoose.PipelineStage.Match["$match"] = {
    $and: [
      {
        user: profile.user._id
      }
    ]
  }

  // check if freelancer want to search by title
  if (search && search.toString() !== "") {
    match.$and!.push({
      name: { $regex: search, $options: "i" }
    });
  }

  // search by budget type
  const isValidBudgetType = budget_type && !isInvalidBudgetType(budget_type);
  if (isValidBudgetType) {
    match.$and!.push({
      budgetType: budget_type
    });
  }

  // search by budget range (e.g. 5,10)
  const isValidBudgetRage = budget_range && budget_range.toString().trim() !== "" && /^\d+,\d+$/.test(budget_range.toString());
  if (isValidBudgetRage) {
    const [minBudget, maxBudget] = budget_range.toString().split(",");
    if (Number(minBudget) <= Number(maxBudget)) {
      match.$and!.push({
        $and: [
          { budget: { $gte: Number(minBudget) } },
          { budget: { $lte: Number(maxBudget) } }
        ]
      });
    }
  }

  const isAllAds = ads && ads.toString() === "all"; // to display campaign metrics for active and inactive ads or just active ads

  // campaign aggregation
  const campaignsAggregation = await advertisementModels.Campaign.aggregate([
    {
      $match: match // get only campaigns based on title, budgetType and budgetRange
    },
    {
      // populate ads documents
      $lookup: {
        from: "ads",
        localField: "ads",
        foreignField: "_id",
        as: "ads"
      }
    },
    {
      // get the campaign's total ads 
      $addFields: {
        totalAds: {
          $size: "$ads"
        }
      }
    },
    {
      // filter only active ads
      $addFields: {
        activeAds: {
          $filter: {
            input: "$ads",
            as: "ad",
            cond: {
              $eq: ["$$ad.status", "active"]
            }
          }
        }
      }
    },
    {
      $addFields: {
        ads: isAllAds ? "$ads" : "$activeAds" // depends on the ads query, if its all then select active and inactive ads, otherwise select only active ads
      }
    },
    {
      // populate ads performances
      $lookup: {
        from: "performances",
        localField: "ads._id",
        foreignField: "ad",
        as: "performances"
      }
    },
    {
      // add clicks field, where it sum campaign's ads clicks
      $addFields: {
        clicks: {
          $reduce: {
            input: "$performances",
            initialValue: 0,
            in: {
              $add: ["$$this.clicks", "$$value"]
            }
          }
        }
      }
    },
    {
      // add impressions field, where it sum campaign's ads impressions
      $addFields: {
        impressions: {
          $reduce: {
            input: "$performances",
            initialValue: 0,
            in: {
              $add: ["$$this.displayCount", "$$value"]
            }
          }
        }
      }
    },
    {
      // add orders field, where it sum campaign's ads orders
      $addFields: {
        orders: {
          $reduce: {
            input: "$performances",
            initialValue: 0,
            in: {
              $add: ["$$this.orders", "$$value"]
            }
          }
        }
      }
    },
    {
      // add ctr field, where it gets the average of campaign's ads ctr
      $addFields: {
        ctr: {
          // using $cond to check if displayCount result doesnt equal to 0 to avoid dividing by 0
          $cond: [
            {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.displayCount", 0]
                      }
                    }
                  }
                },
                0
              ]
            },
            0, // if its true, then set 0 as a return
            {
              $divide: [
                {
                  $reduce: {
                    input: "$performances",
                    initialValue: 0,
                    in: {
                      $add: ["$$this.ctr", "$$value"]
                    }
                  }
                },
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.displayCount", 0]
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    },
    {
      // add cr field, where it gets the average of campaign's ads cr
      $addFields: {
        cr: {
          $cond: [
            // using $cond to check if clicks result doesnt equal to 0 to avoid dividing by 0
            {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.clicks", 0]
                      }
                    }
                  }
                },
                0
              ]
            },
            0, // if its true, then set 0 as a return
            {
              $divide: [
                {
                  $reduce: {
                    input: "$performances",
                    initialValue: 0,
                    in: {
                      $add: ["$$this.cr", "$$value"]
                    }
                  }
                },
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.clicks", 0]
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    },
    {
      // add cpc field, where it gets the average of campaign's ads cpc
      $addFields: {
        cpc: {
          // using $cond to check if cpc result doesnt equal to 0 to avoid dividing by 0
          $cond: [
            {
              $eq: [
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.cpc", 0]
                      }
                    }
                  }
                },
                0
              ]
            },
            0, // if its true, then set 0 as a return
            {
              $divide: [
                {
                  $reduce: {
                    input: "$performances",
                    initialValue: 0,
                    in: {
                      $add: ["$$this.cpc", "$$value"]
                    }
                  }
                },
                {
                  $size: {
                    $filter: {
                      input: "$performances",
                      as: "performance",
                      cond: {
                        $ne: ["$$performance.cpc", 0]
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    },
    {
      // add amounts array field, where it has campaigns ads amounts object
      $addFields: {
        amounts: {
          $reduce: {
            input: "$ads",
            initialValue: [],
            in: {
              $concatArrays: ["$$this.amounts", "$$value"]
            }
          }
        }
      }
    },
    {
      // add spend field, where it has the total spend amount on the campaign
      $addFields: {
        spend: {
          $reduce: {
            input: "$amounts",
            initialValue: 0,
            in: {
              $add: ["$$this.amount", "$$value"]
            }
          }
        }
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        budget: 1,
        budgetType: 1,
        status: 1,
        startDate: 1,
        endDate: 1,
        createdAt: 1,
        isPaused: 1,
        clicks: 1,
        impressions: 1,
        orders: 1,
        ctr: 1,
        cr: 1,
        cpc: 1,
        spend: 1,
        totalAds: 1,
        activeAds: {
          $size: "$activeAds"
        },
      }
    },
    {
      $sort: {
        createdAt: -1
      }
    }
  ]);

  res.status(StatusCodes.OK).json(campaignsAggregation);
}


//@desc get freelancer's campaign details
//@route GET api/v1/advertisements/campaigns/campaignId
//@access authentication (freelancers only)
const getCampaignDetails: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { campaignId } = req.params;

  // check if valid mongodb id
  const isValidMongodbId = isValidObjectId(campaignId);
  if (!isValidMongodbId) {
    throw new BadRequestError("Invalid campaign ID");
  }

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current profile is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
  }

  // get campaign
  const [campaign] = await advertisementModels.Campaign.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(campaignId),
        user: profile.user // get only the campaign that belongs to the freelancer
      }
    },
    {
      // populate ads documents thats related to this campaign
      $lookup: {
        from: "ads",
        localField: "ads",
        foreignField: "_id",
        as: "ads"
      }
    },
    {
      // populate performances documents thats related to campaign's ads
      $lookup: {
        from: "performances",
        localField: "ads._id",
        foreignField: "ad",
        as: "performances"
      }
    },
    {
      // add ads field, where it merge both ads and performances that are related to each other (ad ID)
      $addFields: {
        ads: {
          $map: {
            input: "$ads",
            as: "ad",
            in: {
              $mergeObjects: [
                "$$ad",
                {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$performances",
                        as: "performance",
                        cond: {
                          $eq: ["$$performance.ad", "$$ad._id"]
                        }
                      }
                    },
                    0
                  ]
                }
              ]
            }
          }
        }
      }
    },
    {
      // add new field, where it calculate the total spend per ad
      $addFields: {
        ads: {
          $map: {
            input: "$ads",
            as: "ad",
            in: {
              $mergeObjects: [
                "$$ad",
                {
                  spend: {
                    $sum: "$$ad.amounts.amount"
                  }
                }
              ]
            }
          }
        }
      }
    },
    {
      // add new field, where it calculate the campaign's total clicks
      $addFields: {
        totalClicks: {
          $sum: "$ads.clicks"
        }
      }
    },
    {
      // add new field, where it calculate the campaign's total impressions
      $addFields: {
        totalImpressions: {
          $sum: "$ads.displayCount"
        }
      }
    },
    {
      // add new field, where it calculate the campaign's total orders
      $addFields: {
        totalOrders: {
          $sum: "$ads.orders"
        }
      }
    },
    {
      // add new field, where it calculate the campaign's total spend
      $addFields: {
        totalSpend: {
          $sum: "$ads.spend"
        }
      }
    },
    {
      // add new field, where it calculate the campaign's ctr
      $addFields: {
        ctr: {
          // add $cond to check if totalImpressions is not 0, otherwise dont divide by 0
          $cond: [
            { $eq: ["$totalImpressions", 0] },
            0, // if true then set 0 as a return ctr value
            {
              $multiply: [
                {
                  $divide: [
                    "$totalClicks",
                    "$totalImpressions"
                  ]
                }
                ,
                100
              ]
            }
          ]
        }
      }
    },
    {
      // add new field, where it calculate the campaign's cr
      $addFields: {
        cr: {
          // add $cond to check if totalClicks is not 0, otherwise dont divide by 0
          $cond: [
            { $eq: ["$totalClicks", 0] },
            0, // if true then set 0 as a return cr value
            {
              $multiply: [
                {
                  $divide: [
                    "$totalOrders",
                    "$totalClicks"
                  ]
                }
                ,
                100
              ]
            }
          ]
        }
      }
    },
    {
      // add new field, where it calculate the campaign's cpc
      $addFields: {
        cpc: {
          // add $cond to check if totalOrders is not 0, otherwise dont divide by 0
          $cond: [
            { $eq: ["$totalOrders", 0] },
            0, // if true then set 0 as a return cpc value
            {
              $divide: [
                "$totalSpend"
                ,
                "$totalOrders"
              ]
            }
          ]
        }
      }
    },
    {
      $project: {
        _id: 1,
        status: 1,
        name: 1,
        "ads.service": 1,
        "ads.ad": 1,
        "ads.status": 1,
        "ads.bidAmount": 1,
        "ads.event": 1,
        "ads.category": 1,
        "ads.keywords": 1,
        "ads.country": 1,
        "ads.displayCount": 1,
        "ads.clicks": 1,
        "ads.ctr": 1,
        "ads.cr": 1,
        "ads.cpc": 1,
        "ads.orders": 1,
        "ads.spend": 1,
        "totalClicks": 1,
        "totalImpressions": 1,
        "totalOrders": 1,
        "totalSpend": 1,
        "ctr": 1,
        "cr": 1,
        "cpc": 1
      }
    }
  ]);

  if (!campaign) {
    throw new NotFoundError(`Found no campaign with ID ${campaignId}`);
  }

  res.status(StatusCodes.OK).json(campaign);
}


//@desc update freelancer's campaign
//@route PATCH api/v1/advertisements/campaigns/:campaignId
//@access authentication (freelancers only)
const updateCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
  const input = req.body;

  const { campaignId } = req.params;

  // check if valid mongodb id
  const isValidCampaignId = isValidObjectId(campaignId);
  if (!isValidCampaignId) {
    throw new BadRequestError("Invalid campaign ID");
  }

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to these ressources. Freelancers only");
  }

  // find campaign
  const campaign = await advertisementModels.Campaign.findById(campaignId).populate({ path: "ads" });
  if (!campaign) {
    throw new BadRequestError(`Found no campaign with ID ${campaignId}`);
  }

  // check if the current freelancer have access to this campaign
  if (campaign.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to this campaign");
  }

  // get only the valid inputs
  const validUpdatedCampaignDetails = getValidUpdatedCampaignInputs(input);

  const updatedAds = calcBudgetAllocation({
    ads: campaign.ads.filter(ad => ad.status === "active"),
    campaignBudget: validUpdatedCampaignDetails.budget || campaign.budget
  });

  const update = updatedAds.map(ad => {
    let newDisplayPeriods = ad.displayPeriods!;

    const budgetTypeChanged = validUpdatedCampaignDetails.budgetType && (validUpdatedCampaignDetails.budgetType !== campaign.budgetType);
    const campaignBudgetChanged = validUpdatedCampaignDetails.budget && (validUpdatedCampaignDetails.budget !== campaign.budget);
    const endDateChanged = validUpdatedCampaignDetails.endDate && (validUpdatedCampaignDetails.endDate !== campaign.endDate);

    if (budgetTypeChanged || campaignBudgetChanged || endDateChanged) {
      const displayPeriods = getDisplayPeriods({
        campaignAd: {
          bidAmount: ad.bidAmount!,
          budgetAllocation: ad.budgetAllocation!,
          event: ad.event!,
          displayPeriods: ad.displayPeriods!
        },
        campaign: {
          budgetType: validUpdatedCampaignDetails.budgetType || campaign.budgetType,
          startDate: campaign.startDate,
          endDate: campaign.endDate
        }
      });

      newDisplayPeriods = displayPeriods
    }

    const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
      updateOne: {
        filter: {
          _id: ad._id
        },
        update: {
          $set: {
            budgetAllocation: ad.budgetAllocation,
            displayPeriods: newDisplayPeriods
          }
        }
      }
    }
    return bulkWrite;
  });

  advertisementModels.Ad.bulkWrite(update);

  // update campaign
  await campaign.updateOne(validUpdatedCampaignDetails);

  res.status(StatusCodes.OK).json({ msg: `Campaign '${campaign.name}' has been updated` });
}


//@desc delete freelancer's campaign
//@route DELETE api/v1/advertisements/campaigns/:campaignId
//@access authentication (freelancers only)
const deleteCampaign: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { campaignId } = req.params;

  // check if valid mongodb id
  const isValidCampaignId = isValidObjectId(campaignId);
  if (!isValidCampaignId) {
    throw new BadRequestError("Invalid campaign ID");
  }

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if current user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to delete campaigns. Freelancers only");
  }

  // check if the freelancer doesnt have any unpaid invoices
  if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
    throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
  }

  // find campaign
  const campaign = await advertisementModels.Campaign.findById(campaignId);
  if (!campaign) {
    throw new BadRequestError(`Found no campaign with ID ${campaignId}`);
  }

  // check if the campaign belongs to the freelancer
  if (campaign.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to delete this campaign");
  }

  // delete the campaign
  await campaign.deleteOne();

  res.status(StatusCodes.OK).json({ msg: `Campaign '${campaign.name}' has been deleted` });
}


//@desc add an ad to an existing campaign
//@route POST api/v1/advertisements/ads
//@access authentication (freelancers only)
const createAd: RequestHandler = async (req: CustomAuthRequest, res) => {
  const input = req.body;
  const { campaign_id } = req.query;

  // check if campaign id exists
  if (!campaign_id) {
    throw new BadRequestError("Campaign ID is missing");
  }

  // check if valid mongodb id
  const isValidCampaignId = isValidObjectId(campaign_id);
  if (!isValidCampaignId) {
    throw new BadRequestError("Invalid campaign ID");
  }

  // check if valid ad values
  createAdValidator(input);

  // find profile
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to create Ads. Freelancers only");
  }

  // check if the freelancer doesnt have any unpaid invoices
  if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
    throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
  }

  // find the campaign
  const campaign = await advertisementModels.Campaign.findById(campaign_id.toString()).populate({ path: "ads" });
  if (!campaign) {
    throw new BadRequestError(`Found no campaign with ID ${campaign_id.toString()}`);
  }

  // check if the current user have access to this campaign
  if (campaign.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to this campaign");
  }

  // check if the service provided belongs to the current freelancer
  const isExistService = await Service.countDocuments({ _id: input.service, user: profile.user._id });
  if (!isExistService) {
    throw new BadRequestError(`You dont have any service with ID ${input.service}`);
  }

  // check if the campaign ads are not 10 (max ads per campaign is 10)
  if (campaign.ads.length === 10) {
    throw new BadRequestError("You cannot add more than 10 ads");
  }

  const newAd: AdType = {
    service: input.service,
    user: profile.user._id,
    bidAmount: input.bidAmount,
    event: input.event,
    category: input.category,
    keywords: input.keywords,
    displayPeriods: [],
    nextPeriodGenerationDates: [new Date(Date.now() + 24 * 60 * 60 * 1000)], // next 24h
    country: input.country,
    status: "active",
    budgetAllocation: input.bidAmount, // initial budget allocation value
    budgetAllocationCompleted: false,
    amounts: [],
    orders: []
  }

  // create ad
  const ad = await advertisementModels.Ad.create(newAd);

  // push the ad to the campaign
  campaign.ads.push(ad);
  await campaign.save();

  // create the ad performance
  const performace: PerformanceType = {
    ad,
    trackers: [],
    cpmImpressions: 0,
    displayCount: 0,
    clicks: 0,
    orders: 0,
    ctr: 0,
    cr: 0,
    cpc: 0
  }
  advertisementModels.Performance.create(performace);

  // get the calculated daily budget allocation for each ad
  const ads = calcBudgetAllocation({
    ads: campaign.ads.filter(ad => ad.status === "active"),
    campaignBudget: campaign.budget
  });

  // loop through ads to update their daily budget allocation
  const updates = ads.map(ad => {

    const displayPeriods = getDisplayPeriods({
      campaignAd: {
        bidAmount: ad.bidAmount!,
        budgetAllocation: ad.budgetAllocation!,
        event: ad.event!,
        displayPeriods: ad.displayPeriods!
      },
      campaign: {
        budgetType: campaign.budgetType,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
      }
    });

    const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
      updateOne: {
        filter: {
          _id: ad._id
        },
        update: {
          $set: {
            budgetAllocation: ad.budgetAllocation,
            displayPeriods
          }
        }
      }
    }
    return bulkWrite;
  });

  // update daily budget allocation to campaign's ads
  advertisementModels.Ad.bulkWrite(updates);

  res.status(StatusCodes.CREATED).json({ msg: `New ad has been added to '${campaign.name}' campaign` });
}


//@desc update an existing ad
//@route PATCH api/v1/advertisements/ads/adId
//@access authentication (freelancers only)
const updateAd: RequestHandler = async (req: CustomAuthRequest, res) => {
  const input = req.body;
  const { adId } = req.params;

  // check if valid mongodb ID
  const isValidAdId = isValidObjectId(adId);
  if (!isValidAdId) {
    throw new BadRequestError("Invalid ad ID");
  }

  // get valid ad inputs
  const updatedAdDetails = getValidUpdatedAdInputs(input);

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to update ads. Freelancers only");
  }

  // find ad
  const ad = await advertisementModels.Ad.findById(adId);
  if (!ad) {
    throw new BadRequestError(`Found no ad with ID ${adId}`);
  }

  // check if the freelancer have access to this ad
  if (ad.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to this ad");
  }

  // check if the updated service belongs to the freelancer if its provided
  if (updatedAdDetails.service && updatedAdDetails.service !== ad.service._id.toString()) {
    const isExists = await Service.findOne({ _id: updatedAdDetails.service, user: profile.user._id });
    if (!isExists) {
      throw new BadRequestError(`You dont have any service with ID ${updatedAdDetails.service}`);
    }
  }

  // update ad
  await ad.updateOne({ $set: updatedAdDetails });

  // update ads display periods and budget allocation
  if ((updatedAdDetails.bidAmount && updatedAdDetails.bidAmount !== ad.bidAmount) || (updatedAdDetails.status && updatedAdDetails.status !== ad.status) || (updatedAdDetails.event && updatedAdDetails.event !== ad.event)) {
    const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } }).populate({ path: "ads" });
    if (!campaign) {
      throw new BadRequestError(`Found no campaign for this ad`);
    }

    // get the calculated daily budget allocation for each ad
    const updatedAds = calcBudgetAllocation({
      ads: campaign.ads.filter(ad => ad.status === "active"),
      campaignBudget: campaign.budget
    });

    // loop through ads to update their daily budget allocation and display periods
    const updates = updatedAds.map(campaignAd => {

      const displayPeriods = getDisplayPeriods({
        campaignAd: {
          bidAmount: campaignAd.bidAmount!,
          budgetAllocation: campaignAd.budgetAllocation!,
          displayPeriods: campaignAd.displayPeriods!,
          event: campaignAd._id.toString() === ad._id.toString() ? updatedAdDetails.event || campaignAd.event! : campaignAd.event!
        },
        campaign: {
          budgetType: campaign.budgetType,
          startDate: campaign.startDate,
          endDate: campaign.endDate
        }
      });

      const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
        updateOne: {
          filter: {
            _id: campaignAd._id
          },
          update: {
            $set: {
              budgetAllocation: campaignAd.budgetAllocation,
              displayPeriods
            }
          }
        }
      }

      return bulkWrite;
    });

    // update daily budget allocation to campaign's ads
    advertisementModels.Ad.bulkWrite(updates)
  }

  res.status(StatusCodes.OK).json(updatedAdDetails);
}


//@desc delete ad
//@route DELETE api/v1/advertisements/ads/adId
//@access authentication (freelancers only)
const deleteAd: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { adId } = req.params;

  // check if valid mongodb id 
  const isValidAdId = isValidObjectId(adId);
  if (!isValidAdId) {
    throw new BadRequestError("Invalid ad ID");
  }

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the current user is a freelancer
  if (profile.userAs !== "freelancer") {
    throw new UnauthorizedError("You dont have access to delete ads. Freelancers only");
  }

  // check if the freelancer doesnt have any unpaid invoices
  if (profile.roles.freelancer!.advertisement.unpaidInvoices.length) {
    throw new UnauthorizedError("You have unpaid advertisement invoices, please update your payment method");
  }

  // find ad
  const ad = await advertisementModels.Ad.findById(adId);
  if (!ad) {
    throw new BadRequestError(`Found no ad with ID ${adId}`);
  }

  // check if the ad belongs to the freelancer
  if (ad.user._id.toString() !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to delete this ad");
  }

  // find campaign
  const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id.toString() } }).populate({ path: "ads" });
  if (!campaign) {
    throw new BadRequestError("Found no campaign for this ad");
  }

  // do not delete the last ad of the campaign
  if (campaign.ads.length === 1) {
    throw new BadRequestError("You cant delete the last ad of the campaign");
  }

  // delete the ad ID from campaign ads collection
  campaign.ads = campaign.ads.filter(campaignAd => campaignAd._id.toString() !== ad._id.toString());

  // get the calculated daily budget allocation for each ad
  const updatedAds = calcBudgetAllocation({
    ads: campaign.ads.filter(campaignAd => campaignAd.status === "active"),
    campaignBudget: campaign.budget
  });

  // loop through ads to update their daily budget allocation
  const update = updatedAds.map(campaignAd => {

    const displayPeriods = getDisplayPeriods({
      campaignAd: {
        bidAmount: campaignAd.bidAmount!,
        budgetAllocation: campaignAd.budgetAllocation!,
        displayPeriods: campaignAd.displayPeriods!,
        event: campaignAd.event!
      },
      campaign: {
        budgetType: campaign.budgetType,
        startDate: campaign.startDate,
        endDate: campaign.endDate
      }
    });

    const bulkWrite: mongoose.mongo.AnyBulkWriteOperation<AdType> = {
      updateOne: {
        filter: {
          _id: campaignAd._id
        },
        update: {
          $set: {
            budgetAllocation: campaignAd.budgetAllocation,
            displayPeriods
          }
        }
      }
    }
    return bulkWrite;
  });

  // delete ad
  await ad.deleteOne();

  // update daily budget allocation to campaign's ads
  advertisementModels.Ad.bulkWrite(update);

  campaign.save();

  res.status(StatusCodes.OK).json({ msg: `Ad ID '${adId}' has been deleted` });
}


//@desc display ads
//@route GET api/v1/advertisements/ads
//@access public
const displayAds: RequestHandler = async (req, res) => {
  const query = req.query;

  // get valid keyword input
  const keyword = getValidAdKeywordInput(query.keyword?.toString());
  const getKeywords = keyword.split(" ");

  // seach by category
  const categories = ["digital-marketing", "design-creative", "programming-tech", "writing-translation", "video-animation", "finance-accounting", "music-audio"];
  let category = "";
  if (query.category && categories.includes(query.category.toString())) {
    category = query.category === "digital-marketing" ? query.category.toString().split("-").join(" ") : query.category.toString().split("-").join(" & ");
  }

  // search by pages
  const page = query.page && /^\d+$/.test(query.page.toString()) ? Number(query.page) : 1;

  // get current time to check for compaign range time and ads display period times
  const currentTime = new Date();

  const ads = await advertisementModels.Campaign.aggregate([
    {
      $match: {
        status: "active", // find only active campaigns

        // get only campaigns that are still in current day range 
        $and: [
          { startDate: { $lte: currentTime } },
          { endDate: { $gte: currentTime } }
        ]
      }
    },
    {
      // populate ads documents
      $lookup: {
        from: "ads",
        localField: "ads",
        foreignField: "_id",
        as: "ad"
      }
    },
    {
      $unwind: {
        path: "$ad"
      }
    },
    {
      $match: category ? {
        "ad.status": "active", // find only active ads
        "ad.budgetAllocationCompleted": false, // find only uncompleted budget allocations ads
        "ad.category": category // find ads with a specific category
      } : {
        "ad.status": "active", // find only active ads
        "ad.budgetAllocationCompleted": false // find only uncompleted budget allocations ads
      }
    },
    {
      // create an ads array that match current time display
      $addFields: {
        currentDisplayedAds: {
          $size: {
            $filter: {
              input: "$ad.displayPeriods",
              as: "displayPeriod",
              cond: {
                $and: [
                  { $lte: ["$$displayPeriod.startTime", currentTime] },
                  { $gte: ["$$displayPeriod.endTime", currentTime] }
                ]
              }
            }
          }
        }
      }
    },
    {
      // get only ads that are visible at the moment
      $match: {
        currentDisplayedAds: { $ne: 0 }
      }
    },
    {
      // create a commonKeywords array where it shows search keywords that match ads keywords 
      $addFields: {
        commonKeywords: {
          $setIntersection: ["$ad.keywords", getKeywords]
        }
      }
    },
    {
      // create score field where it multiply by 2 each time a search keyword match ad keywords
      $addFields: {
        score: {
          $multiply: [
            { $size: "$commonKeywords" },
            2
          ]
        }
      }
    },
    {
      // get only ads that has score is not equal to 0
      $match: {
        score: { $ne: 0 }
      }
    },
    {
      // multiply bid amount by 10 and add it to the score
      $addFields: {
        score: {
          $add: [
            "$score",
            {
              $multiply: [
                "$ad.bidAmount",
                10
              ]
            }
          ]
        }
      }
    },
    {
      // populate the ad service document
      $lookup: {
        from: "services",
        localField: "ad.service",
        foreignField: "_id",
        as: "service"
      }
    },
    {
      $addFields: {
        service: {
          $arrayElemAt: ["$service", 0]
        }
      }
    },
    {
      // populate the service profile document
      $lookup: {
        from: "profiles",
        localField: "service.profile",
        foreignField: "_id",
        as: "profile"
      }
    },
    {
      $addFields: {
        "service.profile": {
          $arrayElemAt: ["$profile", 0]
        }
      }
    },
    {
      // get only campaigns where their freelancers doesn't have any unpaid invoices
      $match: {
        "service.profile.roles.freelancer.advertisement.unpaidInvoices": { $eq: [] }
      }
    },
    {
      $sort: {
        score: -1, // make ads with higher score shows first
        "ad.bidAmount": -1, // if multiple ads scores match, then sort by bid amount
        "ad.budgetAllocation": -1, // if multiple ads scores match and bid amount match, then sort by budgetAllocation,
        "ad.createdAt": -1 // if all match then display old ads first
      }
    },
    {
      $limit: page * 2 // display only 2 ads per page
    },
    {
      $skip: (page - 1) * 2 // display the rest of ads based on the search page
    },
    {
      // set service as sponsored
      $set: {
        "service.sponsored": true
      }
    },
    {
      // response with only ad ID, and the service info
      $project: {
        "score": 1,
        "ad.bidAmount": 1,
        "ad.budgetAllocation": 1,
        "_id": 1,
        "ad._id": 1,
        "service._id": 1,
        "service.sponsored": 1,
        "service.title": 1,
        "service.featuredImage": 1,
        "service.category": 1,
        "service.tier.starter.price": 1,
        "service.profile._id": 1,
        "service.profile.name": 1,
        "service.profile.avatar": 1,
        "service.profile.country": 1,
        "service.profile.userAs": 1,
        "service.profile.rating": 1,
        "service.profile.roles.freelancer.englishLevel": 1,
        "service.profile.roles.freelancer.badge": 1,
      }
    }
  ]);

  res.status(StatusCodes.OK).json(ads);
}


//@desc track ad engagement based on the ad performance
//@route PATCH api/v1/advertisements/performace/engagement
//@access public
const trackAdEngagement: RequestHandler = async (req, res) => {
  const { ad: adId } = req.body;

  // check if valid mongodb id
  const isValidMongodbId = isValidObjectId(adId);
  if (!isValidMongodbId) {
    throw new BadRequestError("Invalid ad ID");
  }

  // find the ad
  const ad = await advertisementModels.Ad.findById(adId);
  if (!ad) {
    throw new BadRequestError(`Found no ad with ID ${adId}`);
  }

  // check if ad is still active
  if (ad.status !== "active") {
    throw new BadRequestError("Inactive ad");
  }

  // find ad freelancer to check if he doesnt have any unpaid invoices
  const profile = await Profile.findOne({ user: ad.user, userAs: "freelancer" });
  if (!profile) {
    throw new BadRequestError("Couldn't find ad freelancer");
  }

  // check if the freelancer doesnt have any unpaid invoices
  if (profile.roles.freelancer?.advertisement.unpaidInvoices.length) {
    throw new BadRequestError("Ad has been stopped due to unpaid invoices");
  }

  // find ad's performance
  const performace = await advertisementModels.Performance.findOne({ ad: ad._id });
  if (!performace) {
    throw new BadRequestError(`Found no ad's performances`);
  }

  // if ad event is cpm then increase cpm impression and push 
  if (ad.event === "cpm") {
    performace.cpmImpressions += 1;

    // set ad amount to be paid if cpm impression become 1000
    if (performace.cpmImpressions === 1000) {
      const currentTime = new Date().toLocaleDateString();

      const adAmount = ad.amounts.find(adAmount => {
        const timeToPayCpmImpressions = new Date(adAmount.date).toLocaleDateString();
        if (currentTime === timeToPayCpmImpressions) {
          return true;
        }
        return false;
      });

      // check if already have amounts for the same day
      if (adAmount) {
        adAmount.amount += ad.bidAmount;
      } else {
        // push new day amount if its the first one today 
        ad.amounts.push({
          amount: ad.bidAmount,
          date: new Date()
        });
      }

      await ad.save();

      // set new campaign payment
      const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } });
      const payment = campaign!.payments[campaign!.payments.length - 1];
      if (!campaign!.payments.length || payment.status !== "unpaid") {
        campaign!.payments.push({
          amount: ad.bidAmount,
          status: "unpaid",
          invoiceId: ""
        });
      } else {
        payment.amount += ad.bidAmount;
      }

      await campaign!.save();

      // get total spent
      const totalSpent = ad.amounts.reduce((num, ad) => {
        return num + ad.amount;
      }, 0);

      // set new cost per click value because of the change of total spent
      performace.cpc = calculateCpc({
        orders: performace.orders,
        totalSpent
      });

      // reset cpm impressions to 0
      performace.cpmImpressions = 0;
    }
  }

  const newTracker: Tracker = {
    ip: req.ip,
    date: new Date(),
    isClick: false,
    isOrder: false,
    userAgent: req.headers["user-agent"] || "unknown"
  }

  performace.trackers.push(newTracker); // push new tracker data
  performace.displayCount += 1; // increase display count by 1

  const ctr = calculateCtr({
    clicks: performace.clicks,
    impressions: performace.displayCount
  });
  performace.ctr = ctr; // calc new ctr based on the new display count

  const tracker = performace.trackers[performace.trackers.length - 1] as Tracker & { _id: mongoose.Types.ObjectId }; // tracker ID is necessary to mark ads as click or order

  performace.save();

  res.status(StatusCodes.OK).json({ track_id: tracker._id, ad_id: ad._id });
}


//@desc track ad click actions
//@route PATCH api/v1/advertisements/performace/actions/click
//@access public
const trackAdClickAction: RequestHandler = async (req, res) => {
  const { ad: adId, track: trackId } = req.body;

  // check if valid ad mongodb id
  const isValidAdMongodbId = isValidObjectId(adId);
  if (!isValidAdMongodbId) {
    throw new BadRequestError("Invalid ad ID");
  }

  // check if valid track mongodb id
  const isValidTrackMongodbId = isValidObjectId(trackId);
  if (!isValidTrackMongodbId) {
    throw new BadRequestError("Invalid track ID");
  }

  // find the ad
  const ad = await advertisementModels.Ad.findById(adId);
  if (!ad) {
    throw new BadRequestError(`Found no ad with ID ${adId}`);
  }

  // check if ad is still active
  if (ad.status !== "active") {
    throw new BadRequestError("Inactive ad");
  }

  // find ad's performance
  const performace = await advertisementModels.Performance.findOne({ ad: ad._id });
  if (!performace) {
    throw new BadRequestError(`Found no ad's performances`);
  }

  // find tracker
  const tracker = (performace.trackers as (Tracker & { _id: mongoose.Types.ObjectId })[]).find(tracker => tracker._id.toString() === trackId.toString());
  if (!tracker) {
    throw new BadRequestError(`Found no tracker with ID ${trackId}`);
  }

  // return if the user has already clicked on the ad
  if (tracker.isClick) {
    return res.status(StatusCodes.OK).json({ msg: "Ad has already been clicked on" });
  }

  // set new tracker values
  tracker.isClick = true;
  performace.clicks += 1;
  performace.ctr = calculateCtr({
    clicks: performace.clicks,
    impressions: performace.displayCount
  });
  performace.cr = calculateCr({
    clicks: performace.clicks,
    orders: performace.orders
  });

  // save new trackers
  performace.save();


  // push a new amount if the ad event is cpc
  if (ad.event === "cpc") {
    const currentDate = new Date().toLocaleDateString();

    const adAmount = ad.amounts.find(adAmount => {
      const timeToPayCpc = new Date(adAmount.date).toLocaleDateString();
      if (currentDate === timeToPayCpc) {
        return true
      }
      return false;
    });

    // if there is already an amount in the same day then increase it with the new amount
    if (adAmount) {
      adAmount.amount += ad.bidAmount;
    } else {
      // otherwise create a new amount with a new day
      ad.amounts.push({
        amount: ad.bidAmount,
        date: new Date()
      });
    }
    await ad.save();

    // set new campaign payment
    const campaign = await advertisementModels.Campaign.findOne({ ads: { $in: ad._id } });
    const payment = campaign!.payments[campaign!.payments.length - 1];
    if (!campaign!.payments.length || payment.status !== "unpaid") {
      campaign!.payments.push({
        amount: ad.bidAmount,
        status: "unpaid",
        invoiceId: ""
      });
    } else {
      payment.amount += ad.bidAmount;
    }

    await campaign!.save();
  }


  res.status(StatusCodes.OK).json({ track_id: tracker._id, ad_id: ad._id });
}


//@desc track ad order actions
//@route PATCH api/v1/advertisements/performace/actions/order
//@access authentication (employers only)
const trackAdOrderAction: RequestHandler = async (req: CustomAuthRequest, res) => {
  const { track: trackId, order: orderId } = req.body;

  // check if valid mongodb IDs
  const isValidTrackId = isValidObjectId(trackId);
  const isValidOrderId = isValidObjectId(orderId);
  if (!isValidTrackId || !isValidOrderId) {
    throw new BadRequestError("Invalid IDs");
  }

  // find user
  const profile = await Profile.findOne({ user: req.user!.userId });
  if (!profile) {
    throw new UnauthenticatedError("Found no user");
  }

  // check if the user is an employer
  if (profile.userAs !== "employer") {
    throw new UnauthorizedError("You dont have access. Employers only");
  }

  // find performace
  const performace = await advertisementModels.Performance.findOne({ trackers: { $elemMatch: { _id: trackId } } });
  if (!performace) {
    throw new BadRequestError(`Found no performance has a track ID ${trackId}`);
  }

  // check if already has been clicked on this tracker
  const tracker = (performace.trackers as (Tracker & { _id: mongoose.Types.ObjectId })[]).find(tracker => tracker._id.toString() === trackId.toString());
  if (!tracker!.isClick) {
    throw new BadRequestError("Invalid ad request");
  }

  // find ad
  const ad = await advertisementModels.Ad.findById(performace.ad).populate({ path: "service", select: "orders" });
  if (!ad) {
    throw new BadRequestError("Found no ad related to the performance's tracker ID");
  }

  // check if this order has not been tracked before
  const alreadyTrackedOrder = ad.orders.find(order => order._id.toString() === orderId.toString());
  if (alreadyTrackedOrder) {
    throw new BadRequestError("This order has already been tracked");
  }

  // find order
  const order = (ad.service.orders as (Order & { _id: mongoose.Types.ObjectId })[])!.find(order => order._id.toString() === orderId.toString());
  if (!order) {
    throw new BadRequestError(`Found no order with ID ${orderId}`);
  }

  // check if the order has been made by the current employer
  if (order.employerId !== profile.user._id.toString()) {
    throw new UnauthorizedError("You dont have access to this order");
  }

  // push new order to ad orders
  ad.orders.push(order._id);

  // set new reconds
  tracker!.isOrder = true;
  performace.orders += 1;

  // calculate cost per conversion
  const totalSpent = ad.amounts.reduce((num, ad) => {
    return num + ad.amount;
  }, 0)
  performace.cpc = calculateCpc({
    orders: performace.orders,
    totalSpent
  });

  // calculate conversion Rate
  performace.cr = calculateCr({
    clicks: performace.clicks,
    orders: performace.orders
  });

  await ad.save();
  performace.save();

  res.status(StatusCodes.OK).json({ msg: "Tracked new ad order successfully" });
}

export {
  createPaymentMethods,
  getPaymentMethods,
  deletePaymentMethod,
  createCampaign,
  getCampaigns,
  getCampaignDetails,
  updateCampaign,
  deleteCampaign,
  createAd,
  updateAd,
  deleteAd,
  displayAds,
  trackAdEngagement,
  trackAdClickAction,
  trackAdOrderAction
}