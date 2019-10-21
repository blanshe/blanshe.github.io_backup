import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 1200 - margin.left - margin.right

// At the very least you'll need scales, and

const svg = d3
  .select('#chart-5')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
//   .attr('transform', `translate(${margin.left}, ${margin.top})`)
// you'll need to read in the file. And you'll need
// and svg, too, probably.

const radius = 100

const pointScale = d3.scalePoint().range([radius, width - radius])

const radiusScale = d3.scaleLinear().range([radius / 2, radius])
const angleScale = d3
  // .scalePoint()
  // .padding(0.5)
  .scaleBand()
  .range([0, Math.PI * 2])

const arc = d3
  .arc()
  .innerRadius(d => radiusScale(+d.low_temp))
  .outerRadius(d => radiusScale(+d.high_temp))
  .startAngle(d => angleScale(d.month_name))
  .endAngle(d => angleScale(d.month_name) + angleScale.bandwidth())

d3.csv(require('/data/all-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // console.log(pie(datapoints))

  const temps = datapoints.map(d => +d.high_temp)
  radiusScale.domain(d3.extent(temps))

  const months = datapoints.map(d => d.month_name)
  angleScale.domain(months)

  const cities = datapoints.map(d => d.city)
  pointScale.domain(cities)

  const nested = d3
    .nest()
    .key(function(d) {
      return d.city
    })
    .entries(datapoints)
  console.log(nested)

  svg
    .selectAll('.polar-bar')
    .data(nested)
    .enter()
    .append('g')
    .each(function(d) {
      const container = d3.select(this)
      const bands = [20, 30, 40, 50, 60, 70, 80, 90]
      container
        .selectAll('.band')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', 'none')
        .attr('stroke', 'lightgray')
        .lower()
        .attr('transform', function(d) {
          console.log(pointScale(d.key))
          return `translate(${pointScale(d.key)},${height / 2})`
        })

      // const bandsText = [30, 50, 70, 90]
      // container
      //   .selectAll('.amount-chart')
      //   .data(bandsText)
      //   .enter()
      //   .append('text')
      //   .text(d => d + '°')
      //   .attr('y', d => -radiusScale(d))
      //   .attr('dy', -8)
      //   .attr('alignment-baseline', 'middle')
      //   .attr('text-anchor', 'middle')
      //   .style('font-size', '20')
      //   .attr('transform', function(d) {
      //     console.log(pointScale(d.city))
      //     return `translate(${pointScale(d.city)},${height})`
      //   })
    })
}
