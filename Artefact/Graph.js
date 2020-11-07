//////////////////////////////////////Declare Variables/////////////////////////////////
var worldTemperatures = [];
var years = [];
var worldEmissions = [];
var tempsLoaded = false;
var emissionsLoaded = false;

//Getting JSON Data for Emissions
var emissionsDataRequest = firebase.database().ref("/Emissions(Total)/");
emissionsDataRequest.on("child_added", function(data, prevChildkey)
{
    let emissionsDataTotal = data.val()[170];
    getWorldEmissions(emissionsDataTotal)
});


//Grab the global emissions from the World entry in the emissions object and the corresponding years
function getWorldEmissions(data) {
    for (var i = 0; i < Object.keys(data).length; i++) {
        tempKey = parseInt(Object.keys(data)[i]);
        if (Number.isInteger(tempKey)) {
            years.push(tempKey);
            worldEmissions.push(data[tempKey]/10000000);
        }
     }
     getWorldTemp()
}

//Get the temperature data from Firebase once the emissions data has been gotten
function getWorldTemp(){
    var tempsDataRequest = firebase.database().ref("/Temps/");
    tempsDataRequest.on("child_added", function(data, prevChildkey)
{
    let tempData = data.val();
    for (var i = 0; i < Object.keys(tempData).length; i++) {
        worldTemperatures.push(tempData.Temp);
    };
    loadGraph();
});
}

////////////////////////////Graph Section////////////////////////////////
function loadGraph() {
    console.log(worldEmissions,worldTemperatures,years);
    var trace1 = {
        x: years,
        y: worldEmissions,
        mode: 'lines',
        name: 'Emissions'
      };

    var trace2 = {
        x: years,
        y: worldTemperatures,
        mode: 'lines',
        name: 'Temperature'
    };

    var data = [trace1,trace2];

    var layout = {
        title:'Total Emissions(Million kt) vs Global Temperature(°C)'
    }

    Plotly.newPlot('graph', data, layout);   
}


