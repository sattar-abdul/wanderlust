# Documentation

## To initilize this project with some data, Run:
1. /init/index.js
2. /init/initReview.js (needs to update)

To run the app locally, use command: `app.js`

## Description:

### For Server side data validation I used: `joi`
It's a npm library used for data validation in JS. 

### For authentication: 
`passport`, `passport-local` libraries are used using local strategy.

### Framework used:
we have used MVC (Model-View-Controller) Framework

### For rating and its animation:
we used open source code: LunarLogic starability

### For img upload and handling
We used npm package "multer" and form of type "multipart/form-data"

### For img storage
used cloud service: cloudinary along with its packages
.env to store credentials.

### For maps
MapLibre is used
maptiler used for map tiles (detailed varsion of map including lables, roads)

Geocoding is the process of converting a human-readable address (new delhi) into geographic coordinates [28.6139, 77.2088], usually latitude and longitude.

This process can also be done in reverse, where geographic coordinates are converted into a human-readable address, This is called reverse geocoding. 

We have used `maptiler's api` for geocoding the locations and showing it on map.
