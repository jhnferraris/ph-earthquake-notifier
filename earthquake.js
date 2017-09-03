#!/usr/bin/env node
require('dotenv').config();

var Nexmo = require('nexmo');


var nexmo = new Nexmo({
    apiKey: process.env.NEXMO_KEY,
    apiSecret: process.env.NEXMO_SECRET,
  });

var cli = require('cli');
var Xray = require('x-ray');
var x = Xray();
var moment = require('moment');
var magnitudeThreshold = process.env.MAGNITUDE_THRESHOLD;

cli.main(function() {
    console.log('Scanning earthquake bulletin..');
    x('http://www.phivolcs.dost.gov.ph/html/update_SOEPD/EQLatest.html', 'table:nth-of-type(3) tr', [{
        col1: 'td:nth-of-type(1)',
        col2: 'td:nth-of-type(2)',
        col3: 'td:nth-of-type(3)',
        col4: 'td:nth-of-type(4)',
        col5: 'td:nth-of-type(5)',
        col6: 'td:nth-of-type(6)',
    }])(function(error, data){
        data.shift();
        data.shift();
        var returnItems = [];

        for(let i=0; i < 5; i++) {
            let magnitude = parseFloat(data[i].col5.replace(/[\n\t\r]/g,""));
            let currentDate = moment().utcOffset(8).format('YYYY-MM-DD');
            let dateOfIncident = moment(data[i].col1.replace(/[\n\t\r\s]/g,"").trim().split('-')[0], 'DDMMMYYYY').format('YYYY-MM-DD');

            if (magnitude >= magnitudeThreshold && (currentDate === dateOfIncident)) {
                var textMessage = "A " + magnitudeThreshold + " or higher magnitude earthquake has struck!";
                textMessage += '\n';
                textMessage += "Date and time: " + data[i].col1.replace(/[\n\t\r]/g,"") + '\n';
                textMessage += "Location: " + data[i].col6.replace(/[\n\t\r]/g,"") + '\n';
                textMessage += "Magnitude: " + magnitude + '\n';
                textMessage += "Latitude: " + data[i].col2.replace(/[\n\t\r]/g,"") + '\n';
                textMessage += "Longitude: " + data[i].col3.replace(/[\n\t\r]/g,"") + '\n';
                nexmo.message.sendSms("NEXMO", process.env.SEND_ALERT_TO, textMessage);
                // Return the first "magnitude_threshold" magnitude earthquake of the day
                break;
            }
        }
        
        console.log('Done!');
    });
});