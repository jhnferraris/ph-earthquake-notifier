# PH Earthquake Notifier

# Concept

As of this development Philippines is preparing for "The Big One". Earthquakes with magnitude ranging from 2.8 to 3.8 are being experienced in the past months of the 2 years, no quick information is being sent to its citizens. 

This simple node applications aims to solve this problem. This parses the [earthquake bulletin](http://www.phivolcs.dost.gov.ph/html/update_SOEPD/EQLatest.html) of PHILVOCS and notifies registered phone numbers that an earthquake has struck from a specific area. Magnitude thresholds can be set in your application's environment variables.

# Install

1. Clone this repository
2. Setup .env
3. `$ yarn install`
4. Execute `$ ./earthquake.js`
5. Extension: Run this command as a cron job in your server.

# Caveats

This application uses Nexmo as its SMS messaging tool. If you have your own tool simply fork this repository and change the settings. For now it can only send alerts to a single mobile number.

Developer does not know the "real-time" behavior of the earthquake bulletin of PHILVOCS, hence, this is still subject for observation. Alerts are sent once we detect an earthquake based on the threshold that was set.

# Known bugs

* It may be possible to send the same alert for the given day if conditions are met since we do not implement "caching" yet to stop dupe alerts