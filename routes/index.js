const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const axios = require("axios")
// const request = require("request");
const mongoose = require("mongoose");

const addressesSchema = {
    fruit: String,
    street: String,
    zip: Number,
    city: String,
    latitude: Number,
    longitude: Number
};

const Address = mongoose.model("Address", addressesSchema);

mongoose.modelNames.exports = Address;

router
    .route("")
    .get((req, res) => {
        console.log("received first get request");
        // executes, passing results to callback
        Address.find({}, function (err, foundItems) {
            var myArray = foundItems;
            console.log(myArray);
            console.log(myArray.length);

            res.render('map', {
                ejsarray: myArray
            });
            console.log(err);
        })
    })
    .post((req, res) => {
        console.log("received first post request");

        let url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?";
        let fruit = req.body.fruit;
        let street = req.body.street;
        let city = req.body.city;
        let state = req.body.state;
        let zip = req.body.zip;
        let yourAddress = "Address=" + street.replace(" ", "+") + "&City=" + city.replace(" ", "+") + "&Zip=" + zip;
        let parameters = "&category=&outFields=*&forStorage=false&f=json";
        //http request to an external server
        axios.post(url + yourAddress + parameters)
            .then(function (response) {
                let data = response.data;
                console.log(data);

                const longitude = data.candidates[0].location.x;
                const latitude = data.candidates[0].location.y;
                console.log(longitude);
                console.log(latitude);

                const address = new Address({
                    fruit: fruit,
                    street: street,
                    zip: zip,
                    city: city,
                    latitude: latitude,
                    longitude: longitude
                });

                console.log(address);

                address.save();

                res.redirect("/");
            })
            .catch(function (error) {
                if (error.response) {
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    console.log(error.request);
                } else {
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    });


module.exports = router;