// Read in the samples.json
const sample = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"
let sample_data;

// Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual as well as the bubble chart.
d3.json(sample).then(function (data) {
    sample_data = data
    console.log(data)
    const dropdown = document.getElementById("selDataset");
    const values = data.names;

    for (let i = 0; i < values.length; i++) {
        const option = document.createElement("option");
        option.value = values[i];
        option.text = values[i];
        dropdown.appendChild(option);
    }
optionChanged(values[0])
})

function buildCharts(id) {
    let studySamples = sample_data.samples.filter(samp_id => samp_id.id == id)
    let result = studySamples[0]
    let sampleData = result["sample_values"]
    let otuIDS = result.otu_ids
    let otuLabels = result.otu_labels

    var barChart = [{
        type: 'bar',
        x: sampleData.slice(0, 10).reverse(),
        y: otuIDS.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        text: otuLabels.slice(0, 10).reverse(),
        orientation: 'h'
    }];
    var blayout = {
        margin: { t: 30, l: 150 }
    }
    Plotly.newPlot('bar', barChart, blayout);
    
    console.log(sampleData.length)

    var bubbleChart = {
        x: otuIDS,
        y: sampleData,
        text: otuLabels,
        mode: 'markers',
        marker: { 
            size: sampleData,
            color: otuIDS,
            colorscale: "Earth"
        }
    };
    console.log(otuIDS.length, sampleData.length, otuLabels.length)
    var data = [bubbleChart];
    
    var layout = {
        showlegend: false,
        xaxis:{title: otuIDS}
    };
  
  Plotly.newPlot('bubble', data, layout);
}

// Display the sample metadata (display each key-value pair from the metadata JSON object somewhere on the page)
function buildMetadata(currentId) {
    let studySamples = sample_data.metadata.find(samp_id => samp_id.id == currentId)
    console.log(studySamples)
    const metadata = d3.select("#sample-metadata")
    metadata.html("")
    const {age, bbtype, ethnicity, gender, id, location, wfreq}=studySamples
    metadata.append("div").text(`age: ${age}`)
    metadata.append("div").text(`bbtype: ${bbtype}`)
    metadata.append("div").text(`ethnicity: ${ethnicity}`)
    metadata.append("div").text(`gender: ${gender}`)
    metadata.append("div").text(`id: ${id}`)
    metadata.append("div").text(`location: ${location}`)
    metadata.append("div").text(`wfreq: ${wfreq}`)
}

function optionChanged(input_value) {
    console.log(input_value)
    buildCharts(input_value)
    buildMetadata(input_value);

}