function buildMetadata(sample) {

    // console.log(sample);
  
    // Use d3 to select the panel with id of `#sample-metadata`
  
    var sample_data = d3.select('#sample-metadata');
  
  
  
    // Use `.html("") to clear any existing metadata
  
    sample_data.html("");
  
  
  
    // @TODO: Complete the following function that builds the metadata panel
  
    // Use `d3.json` to fetch the metadata for a sample
  
    d3.json("metadata/"+sample).then((sampleMData)=>{
  
      // console.log(sampleMData);
  
      // Use `Object.entries` to add each key and value pair to the panel
  
      Object.entries(sampleMData).forEach(([key,value])=>{
  
        // console.log(`${key},${value}`);
  
        // Hint: Inside the loop, you will need to use d3 to append new
  
      // tags for each key-value in the metadata.
  
        sample_data.append('p').text(`${key}: ${value}`)
  
      });
  
    });
  
      // BONUS: Build the Gauge Chart
  
      // buildGauge(data.WFREQ);    
  
  }
  
  
  
  function buildCharts(sample) {
  
  
  
    d3.json("samples/"+sample).then((sampleData)=>{
  
      
  
      //bubble chart
  
      var trace1 = {
  
        x:sampleData['otu_ids'],
  
        y:sampleData['sample_values'],
  
        mode:'markers',
  
        type:'scatter',
  
        text:sampleData[`otu_labels`],
  
        marker:{
  
          color: sampleData['otu_ids'],
  
          opacity:0.5,
  
          size:sampleData['sample_values']
  
        }
  
      };
  
    //piechart
  
    var data2 = [{
  
      "labels":sampleData['otu_ids'].slice(0,10),
  
      "values":sampleData['sample_values'].slice(0,10),
  
      "type": 'pie',
  
      "hovertext":sampleData['otu_labels']
  
    }]
  
    //bubble
  
    var data = [trace1];
  
    //piechart
  
    
  
    var layout = {
  
      title:`buble chart for ${sample}`,
  
      xaxis:{title:'otu ids'},
  
      yaxis:{title:'sample values'}
  
    };
  
    var layout2 = {title:`pie chart for ${sample}`};
  
    
  
  
  
  
  
    Plotly.newPlot('bubble',data,layout);
  
    Plotly.newPlot('pie',data2,layout2);
  
    });
  
    //creating gauge chart via https://plot.ly/javascript/gauge-charts/
  
    d3.json(`/wfreq/${sample}`).then((sample)=>{
  
      var wfreq = sample.WFREQ;
  
      //created an empty variable f to hold the correct value to subtract since wash frequency is a range
  
      var f;
  
      if(wfreq===0){
  
        f=15;
  
      }else if(wfreq===1||wfreq===2){
  
        f=45;
  
      }else if(wfreq===3||wfreq===4){
  
        f=75;
  
      }else if(wfreq===5||wfreq===6){
  
        f=105;
  
      }else if(wfreq===7||wfreq===8){
  
        f=135;
  
      }else{f=165};
  
  
  
      var degrees = 180- f,
  
        radius = .5;
  
  
  
      //
  
      var radians = degrees * Math.PI / 180;
  
      var x = radius * Math.cos(radians);
  
      var y = radius * Math.sin(radians);
  
      // Path: may have to change to create a better triangle
  
      var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
  
        pathX = String(x),
  
        space = ' ',
  
        pathY = String(y),
  
        pathEnd = ' Z';
  
      var path = mainPath.concat(pathX,space,pathY,pathEnd);
  
      
  
      var data = [{ type: 'scatter',
  
        x: [0], y:[0],
  
        marker: {size: 28, color:'850000'},
  
        showlegend: false,
  
        name: 'washes',
  
        text: wfreq,
  
        hoverinfo: 'text+name'},
  
        { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  
        rotation: 90,
  
        text: ['9+', '7-8', '5-6', '3-4',
  
            '1-2', '0', ''],
  
        textinfo: 'text',
  
        textposition:'inside',	  
  
        marker: {colors:['rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
  
                  'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
  
                  'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
  
                  'rgba(255, 255, 255, 0)']},
  
        labels: ['9+', '7-8', '5-6', '3-4','1-2', '0', ''],
  
        hoverinfo: 'label',
  
        hole: .5,
  
        type: 'pie',
  
        showlegend: false
  
      }];
  
    
  
    var layout = {
  
      shapes:[{
  
          type: 'path',
  
          path: path,
  
          fillcolor: '850000',
  
          line: {
  
            color: '850000'
  
          }
  
        }],
  
      title: `frequency of sample washes for sample #${sample.sample}`,
  
      height: 500,
  
      width: 500,
  
      xaxis: {zeroline:false, showticklabels:false,
  
           showgrid: false, range: [-1, 1]},
  
      yaxis: {zeroline:false, showticklabels:false,
  
           showgrid: false, range: [-1, 1]}
  
    };
  
    
  
    Plotly.newPlot('gauge', data, layout)
  
  }
  
  )};  
  
  
  
  function init() {
  
    // Grab a reference to the dropdown select element
  
    var selector = d3.select("#selDataset");
  
  
  
    // Use the list of sample names to populate the select options
  
    d3.json("/names").then((sampleNames) => {
  
      sampleNames.forEach((sample) => {
  
        selector
  
          .append("option")
  
          .text(sample)
  
          .property("value", sample);
  
      });
  
      
  
      // Use the first sample from the list to build the initial plots
  
      const firstSample = sampleNames[0];
  
      buildCharts(firstSample);
  
      buildMetadata(firstSample);
  
    });
  
  }
  
  
  
  function optionChanged(newSample) {
  
    // Fetch new data each time a new sample is selected
  
    buildCharts(newSample);
  
    buildMetadata(newSample);
  
  }
  
  
  
  // Initialize the dashboard
  
  init();