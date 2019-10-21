import * as d3 from 'd3'

const margin = { top: 30, left: 30, right: 30, bottom: 30 }
const height = 400 - margin.top - margin.bottom
const width = 780 - margin.left - margin.right

const svg = d3
  .select('#chart-4')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  .append('g')
  .attr('transform', `translate(${width / 2},${height / 2})`)

const radius = 150

const colorScale = d3.scaleLinear().range(['blue', 'pink'])

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

d3.csv(require('/data/ny-temps.csv'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(datapoints) {
  // This is reading high temperature and updating scales
  const temps = datapoints.map(d => +d.high_temp)
  colorScale.domain(d3.extent(temps))
  radiusScale.domain(d3.extent(temps))

  const months = datapoints.map(d => d.month_name)
  angleScale.domain(months)
  svg
    .selectAll('polar-bar')
    .data(datapoints)
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', 'pink')

  const bands = [20, 30, 40, 50, 60, 70, 80, 90]
  svg
    .selectAll('.band')
    .data(bands)
    .enter()
    .append('circle')
    .attr('r', d => radiusScale(d))
    .attr('fill', 'none')
    .attr('stroke', 'lightgray')
    .lower()

  const bandsText = [30, 50, 70, 90]
  svg
    .selectAll('.amount-chart')
    .data(bandsText)
    .enter()
    .append('text')
    .text(d => d + '°')
    .attr('y', d => -radiusScale(d))
    .attr('dy', -8)
    .attr('alignment-baseline', 'middle')
    .attr('text-anchor', 'middle')

  svg
    .append('text')
    .style('font-size', '24')
    .attr('text-anchor', 'middle')
    .text('NYC')
    .attr('x', 0)
    .attr('y', 0)
}
