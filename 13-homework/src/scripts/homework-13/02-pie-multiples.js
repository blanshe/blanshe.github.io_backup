import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

// At the very least you'll need scales, and

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
//   .attr('transform', `translate(${margin.left}, ${margin.top})`)
// you'll need to read in the file. And you'll need
// and svg, too, probably.

const pie = d3.pie().value(function(d) {
  return +d.minutes
})

const radius = 70

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#7fbf7b', '#af8dc3', '#f1a340'])

const pointScale = d3.scalePoint().range([radius, width - radius])

d3.csv(require('/data/time-breakdown-all.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  // console.log(pie(datapoints))

  const project = datapoints.map(d => d.project)
  pointScale.domain(project)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.project
    })
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('.pie-chart')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      const container = d3.select(this)
      const datapoints = d.values
      container
        .selectAll('path')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('d', d => arc(d))
        .attr('fill', d => colorScale(d.data.task))
        .attr('transform', function(d) {
          console.log(pointScale(d.data.project))
          return `translate(${pointScale(d.data.project)},${height / 2})`
        })

      container
        .selectAll('.label')
        .data(pie(datapoints))
        .enter()
        .append('text')
        .text(d => d.data.project)
        .attr('text-anchor', 'middle')
        .style('font-size', '24')
        .attr('transform', function(d) {
          console.log(pointScale(d.data.project))
          return `translate(${pointScale(d.data.project)},${height})`
        })
    })
}
