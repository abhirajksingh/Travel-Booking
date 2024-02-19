const axios = require("axios");
const qs = require("qs");
const dotenv = require("dotenv").config();
const client_id = process.env.client_id;
const client_secret = process.env.client_secret;

class AmadeusApi {
  async getAccessToken() {
    const accessToken = {
      status: false,
      data: "",
    };

    let data = qs.stringify({
      client_id: client_id,
      client_secret: client_secret,
      grant_type: "client_credentials",
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://test.api.amadeus.com/v1/security/oauth2/token",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      if (response.status == 200) {
        if (response.data) {
          if (response.data.access_token) {
            accessToken.data = response.data.access_token;
            accessToken.status = true;
          }
        }
      }
    } catch (error) {
      // Handle the error
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error message:", error.message);
      }
    }

    return accessToken;
  }

  async getSearchResult(searchData = {}) {
    const travalers = searchData.travalers;
    const travelersArray = [];
    let currentId = 1;
    travalers.forEach((travaler) => {
      const travelerType = travaler.name.toUpperCase();
      const fareOptions = ["STANDARD"];

      for (let i = 0; i < parseInt(travaler.value, 10); i++) {
        travelersArray.push({
          id: currentId.toString(),
          travelerType,
          fareOptions,
        });
        currentId++;
      }
    });

    const searchResult = {
      status: false,
      data: {},
    };

    const accessToken = await this.getAccessToken();
    if (accessToken.status === true) {
      let data = JSON.stringify({
        currencyCode: "INR",
        originDestinations: [
          {
            id: "1",
            originLocationCode: searchData.originLocationCode,
            destinationLocationCode: searchData.destinationLocationCode,
            departureDateTimeRange: {
              date: searchData.date,
              time: "10:00:00",
            },
          },
        ],
        travelers: travelersArray,
        sources: ["GDS"],
        searchCriteria: {},
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://test.api.amadeus.com/v2/shopping/flight-offers",
        headers: {
          "Content-Type": "application/json",
          "X-HTTP-Method-Override": "GET",
          Authorization: "Bearer " + accessToken.data,
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          if (response.data) {
            if (response.data.data) {
              searchResult.data = this.formatSearchResponse(response.data.data);
              searchResult.status = true;
            }
          }
        }
        // console.log("Data:", response.data);
      } catch (error) {
        // Handle the error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      }
      // const response = await axios.request(config);
    }
    return searchResult;
  }

  formatSearchResponse(responseData) {
    const searchResults = [];
    responseData.forEach((searchResult) => {
      const temp = {
        numberOfBookableSeats: searchResult.numberOfBookableSeats,
        itinerariesAreCombined: true,
      };

      const searchResultPrice = {
        currency: searchResult.price.currency,
        baseFare: searchResult.price.base,
        totalFare: searchResult.price.total,
      };
      const tempItineraries = [];
      searchResult.itineraries.forEach((itinerary) => {
        const tempItinerary = {};
        const tempSegments = [];

        itinerary.segments.forEach((segment) => {
          const tempSegment = {
            operatorCode: segment.carrierCode,
            operatorName: "",
            flightNumber: segment.number,
            originCode: segment.departure.iataCode,
            originName: "",
            originTerminal: segment.departure.terminal,
            originTime: segment.departure.at,
            destinationCode: segment.arrival.iataCode,
            destinationName: "",
            destinationTerminal: segment.arrival.terminal,
            destinationTime: segment.arrival.at,
            duration: segment.duration.replace(
              /PT(\d+)H(?:([0-9]+)M)?/,
              function (match, hours, minutes) {
                return hours + "h" + (minutes ? " " + minutes + "m" : "");
              }
            ),
            seatsAvalilable: "",
            allowedBaggage: "",
            allowedCabinBaggege: "",
          };
          tempSegments.push(tempSegment);
        });

        tempItinerary.summary = {
          stops: itinerary.segments.length,
          operatorCode: itinerary.segments[0].carrierCode,
          operatorName: "",
          flightNumber: itinerary.segments[0].number,
          originCode: itinerary.segments[0].departure.iataCode,
          originName: "",
          originTerminal: itinerary.segments[0].departure.terminal,
          originTime: itinerary.segments[0].departure.at,
          destinationCode: itinerary.segments.slice(-1)[0].arrival.iataCode,
          destinationName: "",
          destinationTerminal: itinerary.segments.slice(-1)[0].arrival.terminal,
          destinationTime: itinerary.segments.slice(-1)[0].arrival.at,
          duration: itinerary.duration.replace(
            /PT(\d+)H(?:([0-9]+)M)?/,
            function (match, hours, minutes) {
              return hours + "h" + (minutes ? " " + minutes + "m" : "");
            }
          ),
          seatsAvalilable: "",
          allowedBaggage: "",
          allowedCabinBaggege: "",
        };

        tempItinerary.segments = tempSegments;

        tempItinerary.price = searchResultPrice;
        tempItinerary.duration = itinerary.duration;
        tempItinerary.uniqueKey = searchResult.id;
        tempItinerary.resultToken = JSON.stringify(searchResult);
        tempItineraries.push(tempItinerary);
      });
      temp.itineraries = tempItineraries;
      searchResults.push(temp);
    });
    return searchResults;
  }

  async getSearchOffers(searchOffers = {}) {
    // console.log(searchOffers);
    const flightOfferPricing = {
      status: false,
      data: {},
    };

    const accessToken = await this.getAccessToken();
    if (accessToken.status === true) {
      let data = JSON.stringify({
        data: {
          type: "flight-offers-pricing",
          flightOffers: [searchOffers],
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://test.api.amadeus.com/v1/shopping/flight-offers/pricing",
        headers: {
          "Content-Type": "application/json",
          "X-HTTP-Method-Override": "GET",
          Authorization: "Bearer " + accessToken.data,
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          if (response.data) {
            if (response.data.data) {
              flightOfferPricing.data = this.formatFlightOfferPricingResponse(
                response.data.data
              );
              flightOfferPricing.status = true;
            }
          }
        }
      } catch (error) {
        // Handle the error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      }
    }
    return flightOfferPricing;
  }
  formatFlightOfferPricingResponse(responseData) {
    const flightOffers = {
      id: responseData.flightOffers[0].id,
      resultData: responseData,
    };

    const itineraries = [];

    responseData.flightOffers[0].itineraries.forEach((itinerary) => {
      const tempItineraries = {};

      const segments = [];

      itinerary.segments.forEach((segment) => {
        const tempSegment = {
          id: segment.id,
          operatorCode: segment.carrierCode,
          operatorName: segment.operating.carrierCode,
          flightNumber: segment.number,
          originName: "",
          originCode: segment.departure.iataCode,
          originTerminal: segment.departure.terminal,
          originTime: segment.departure.at,
          destinationName: "",
          destinationCode: segment.arrival.iataCode,
          destinationTerminal: segment.arrival.terminal,
          destinationTime: segment.arrival.at,
          duration: segment.duration.replace(
            /PT(\d+)H(?:([0-9]+)M)?/,
            function (match, hours, minutes) {
              return hours + "h" + (minutes ? " " + minutes + "m" : "");
            }
          ),
          class: segment.co2Emissions[0].cabin,
        };
        segments.push(tempSegment);
      });
      tempItineraries.segments = segments;
      itineraries.push(tempItineraries);
    });

    flightOffers.itineraries = itineraries;

    const price = {
      currency: responseData.flightOffers[0].price.currency,
      total: responseData.flightOffers[0].price.total,
      base: responseData.flightOffers[0].price.base,
      grandTotal: responseData.flightOffers[0].price.grandTotal,
    };

    const travelerPricings = [];
    responseData.flightOffers[0].travelerPricings.forEach((travelerPricing) => {
      const tempTravelerPricing = {
        travelerId: travelerPricing.travelerId,
        fareOption: travelerPricing.fareOption,
        travelerType: travelerPricing.travelerType,
      };

      const price = {
        currency: travelerPricing.price.currency,
        total: travelerPricing.price.total,
        base: travelerPricing.price.base,
        refundableTaxe: travelerPricing.price.refundableTaxes,
      };

      const tempTax = [];
      travelerPricing.price.taxes.forEach((tax) => {
        const temp = {
          amount: tax.amount,
          code: tax.code,
        };
        tempTax.push(temp);
      });

      price.taxes = tempTax;
      tempTravelerPricing.price = price;

      travelerPricings.push(tempTravelerPricing);
    });
    flightOffers.price = price;
    flightOffers.travelerPricings = travelerPricings;

    return flightOffers;
  }

  async createOrder(getDetails = {}) {
    const travelerData = getDetails.bookingData.travelerDetail;

    const travelers = [];

    const numberOfTravelers = travelerData["firstName[]"].length;
    for (let i = 0; i < numberOfTravelers; i++) {
      const traveler = {
        id: (i + 1).toString(),
        dateOfBirth: travelerData["dateOfBirth[]"][i],
        name: {
          firstName: travelerData["firstName[]"][i],
          lastName: travelerData["lastName[]"][i],
        },
        gender: travelerData["gender[]"][i].toUpperCase(),
        contact: {
          emailAddress: travelerData.email,
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "91",
              number: travelerData.mobile,
            },
          ],
        },
        documents: [
          {
            documentType: "PASSPORT",
            birthPlace: "Madrid",
            issuanceLocation: "Madrid",
            issuanceDate: "2015-04-14",
            number: "00000000",
            expiryDate: "2025-04-14",
            issuanceCountry: "ES",
            validityCountry: "ES",
            nationality: "ES",
            holder: true,
          },
        ],
      };
      travelers.push(traveler);
    }

    const createOrder = {
      status: false,
      data: {},
    };

    const accessToken = await this.getAccessToken();
    if (accessToken.status === true) {
      let data = JSON.stringify({
        data: {
          type: "flight-order",
          flightOffers: getDetails.bookingData.searchOffersData,
          travelers: travelers,
          remarks: {
            general: [
              {
                subType: "GENERAL_MISCELLANEOUS",
                text: "ONLINE BOOKING FROM INCREIBLE VIAJES",
              },
            ],
          },
          ticketingAgreement: {
            option: "DELAY_TO_CANCEL",
            delay: "6D",
          },
          contacts: [
            {
              addresseeName: {
                firstName: "PABLO",
                lastName: "RODRIGUEZ",
              },
              companyName: "INCREIBLE VIAJES",
              purpose: "STANDARD",
              phones: [
                {
                  deviceType: "LANDLINE",
                  countryCallingCode: "34",
                  number: "480080071",
                },
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "33",
                  number: "480080072",
                },
              ],
              emailAddress: "support@increibleviajes.es",
              address: {
                lines: ["Calle Prado, 16"],
                postalCode: "28014",
                cityName: "Madrid",
                countryCode: "ES",
              },
            },
          ],
        },
      });

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "https://test.api.amadeus.com/v1/booking/flight-orders",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken.data,
        },
        data: data,
      };

      try {
        const response = await axios.request(config);
        if (response.data) {
          if (response.data) {
            createOrder.data = this.formatCreateOrder(response.data.data);
            createOrder.status = true;
          }
        }
      } catch (error) {
        // Handle the error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error(JSON.stringify(error.response.data));
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      }
    }
    return createOrder;
  }

  formatCreateOrder(createOrder) {
    return createOrder;
  }

  async orderManagement(id) {
    const orderManagement = {
      status: false,
      data: {},
    };

    const accessToken = await this.getAccessToken();
    if (accessToken.status === true) {
      let config = {
        method: "GET",
        maxBodyLength: Infinity,
        url: `https://test.api.amadeus.com/v1/booking/flight-orders/${id}`,
        headers: {
          Authorization: `Bearer ${accessToken.data}`,
        },
      };
      try {
        const response = await axios.request(config);
        if (response.status === 200) {
          if (response.data) {
            if (response.data.data) {
              orderManagement.data = this.formatOrderManagement(
                response.data.data
              );
              orderManagement.status = true;
            }
          }
        }
      } catch (error) {
        // Handle the error
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response status:", error.response.status);
          console.error("Response data:", error.response.data);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received");
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      }
    }
    return orderManagement;
  }
  formatOrderManagement(orderManagementData) {
    const ticket = {};
    const general = {
      pnr: orderManagementData.associatedRecords[1].reference,
      bookDate: orderManagementData.associatedRecords[1].creationDate,
      queuingOfficeId: orderManagementData.queuingOfficeId,
    };
    ticket.general = general;

    const itineraries = [];

    orderManagementData.flightOffers[0].itineraries.forEach((itinerary) => {
      const temp = {
        stops: itinerary.segments.length - 1,
        operatorName: "",
        originCode: itinerary.segments[0].departure.iataCode,
        originName: "",
        originTerminal: itinerary.segments[0].departure.terminal,
        originTime: itinerary.segments[0].departure.at,
        destinationCode: itinerary.segments.slice(-1)[0].arrival.iataCode,
        destinationName: "",
        destinationTerminal: itinerary.segments.slice(-1)[0].arrival.terminal,
        destinationTime: itinerary.segments.slice(-1)[0].arrival.at,
        class: itinerary.segments[0].co2Emissions[0].cabin,
        flightNumber: itinerary.segments[0].number,
        aircraftCode: itinerary.segments[0].aircraft.code,
        bookingStatus: itinerary.segments[0].bookingStatus,
      };
      itineraries.push(temp);
    });

    ticket.itineraries = itineraries;

    const price = {
      currency: orderManagementData.flightOffers[0].price.currency,
      total: orderManagementData.flightOffers[0].price.total,
      base: orderManagementData.flightOffers[0].price.base,
      grandTotal: orderManagementData.flightOffers[0].price.grandTotal,
    };
    ticket.price = price;

    const travelers = [];

    orderManagementData.travelers.forEach((traveler) => {
      const temp = {
        id: traveler.id,
        firstName: traveler.name.firstName,
        lastName: traveler.name ? traveler.name.lastName : "NA",
        passportNumber: traveler.documents[0].number,
      };
      travelers.push(temp);
    });
    ticket.travelers = travelers;
    const contacts = {
      emailAddress: orderManagementData.contacts[0].emailAddress,
      landline: orderManagementData.contacts[0].phones[0].number,
      landlineCallingCode:
        orderManagementData.contacts[0].phones[0].countryCallingCode,
      mobile: orderManagementData.contacts[0].phones[1].number,
      mobileCallingCode:
        orderManagementData.contacts[0].phones[1].countryCallingCode,
    };
    ticket.contacts = contacts;
    return ticket;
  }
}

module.exports = { AmadeusApi };
