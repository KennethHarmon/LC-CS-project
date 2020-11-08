//////////////////////////////////////Emissions Data Section/////////////////////////////////

//Setting Variables
var emissionsDataTotal = [];
var emissionsDataPC;
var YearEmissisonsData = [];
var yearLocations = [];

//////////////////////////////////////////Firebase/////////////////////////////////

//Getting JSON Data for Emissions
/////////////////Total Emissions////////////
var emissionsDataRequest = firebase.database().ref("/Emissions(Total)/");
emissionsDataRequest.on("child_added", function(data, prevChildkey)
{
    emissionsDataTotal = data.val();
    initialExport(emissionsDataTotal)
});

var emissionsDataRequestPC = firebase.database().ref("/Emissions(pc)/");
emissionsDataRequestPC.on("child_added", function(data, prevChildkey)
{
    emissionsDataPC = data.val();
});


//Setup data to intially dislpay total emissions for year 2014
function initialExport(obj) {
    emissionsDataTotal = obj;
    updateMap(2014,"total");
}

//Sort the data according to the parameters
function updateMap(year,type) {
    year = parseInt(year)
    if (type == "total") {
        console.log(emissionsDataTotal)
        pushData(emissionsDataTotal,year,type)
    }
    else if (type == "pc") {
        pushData(emissionsDataPC,year,type)
    } 
}

//Grab all the data from the specified set for a particular year and push it to the YearEmissionsData list
function pushData(data,year,type) {
    YearEmissisonsData = [];
    yearLocations = [];
    for (var i = 0; i < Object.keys(data).length; i++) {
        if (type == "total") {
            if (data[i][year])  {
                YearEmissisonsData.push(parseFloat(data[i][year]))
                yearLocations.push(data[i]["Country Code"])
            }
        }
        else {
            if (data[i][year])  {
                YearEmissisonsData.push(parseFloat(data[i][year]))
                yearLocations.push(data[i]["CountryCode"])
            }
        }
    }
    loadMap(type);
}

function getMapWidth() {
    currrentwitdh = document.documentElement.clientWidth;
    if (currrentwitdh > 600){
        currrentwitdh - (currrentwitdh * 0.4)
    }
    else {
        return currrentwitdh;
    }
}

////////////////////////////Map Section////////////////////////////////
function loadMap(type) {

if (type == "total") {
    document.getElementById("mapTitle").textContent = "Total Co2 Emissions(kt)"
    var data = [{
        type: "choroplethmapbox", name: "World Map", geojson: "https://kennethharmon.github.io/LC-CS-project/countries.geo.json", locations: yearLocations,
       z: YearEmissisonsData,
       zmin: 0, zmax: 1000000, colorbar: {y: 0, yanchor: "bottom",}}
        ];

}
else {
    document.getElementById("mapTitle").textContent = "Co2 Emissions Per Capita(mt)"
    var data = [{
        type: "choroplethmapbox", name: "World Map", geojson: "https://kennethharmon.github.io/LC-CS-project/countries.geo.json", locations: yearLocations,
       z: YearEmissisonsData,
       zmin: 0, zmax: 10, colorbar: {y: 0, yanchor: "bottom",}}
        ];
}

var layout = {geo: {showframe:false, showcoastlines:false, projection:{type: 'mercator'}} ,mapbox: {style: "light", center: {lon: 0, lat: 0}, zoom: 0}, width: getMapWidth(), height: 500, margin: {t: 0, b: 0}};

var config = {mapboxAccessToken: "pk.eyJ1Ijoia2VubmV0aGhhcm1vbiIsImEiOiJjazVoN2R2a3gwMHNnM3FtbXl2MXl4dGtpIn0.AmIdZ7jx2IVUv80J68XEAA",showlink: false};

Plotly.newPlot('map', data, layout, config);   
}
