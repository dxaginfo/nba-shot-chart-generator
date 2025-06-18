import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CourtVisualizationProps {
  width?: number;
  height?: number;
  shots?: Shot[];
  showMakes?: boolean;
  showMisses?: boolean;
  heatmap?: boolean;
  zoneMethod?: 'hexbin' | 'grid';
  zoneSize?: 'small' | 'medium' | 'large';
  colorScale?: string;
}

interface Shot {
  x: number;
  y: number;
  made: boolean;
  shotType: '2PT' | '3PT' | 'FT';
  distance: number;
  gameDate: string;
  opponent: string;
  period: number;
  playerId: string;
  playerName: string;
}

const CourtVisualization: React.FC<CourtVisualizationProps> = ({
  width = 800,
  height = 600,
  shots = [],
  showMakes = true,
  showMisses = true,
  heatmap = false,
  zoneMethod = 'hexbin',
  zoneSize = 'medium',
  colorScale = 'redYellowGreen'
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous visualizations
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height - 50})`);

    // Draw court
    drawCourt(svg, width, height);

    // Filter shots based on user preferences
    const filteredShots = shots.filter(shot => 
      (shot.made && showMakes) || (!shot.made && showMisses)
    );

    // Render shots or heatmap
    if (heatmap) {
      drawHeatmap(svg, filteredShots, zoneMethod, zoneSize, colorScale);
    } else {
      drawShots(svg, filteredShots);
    }
    
  }, [width, height, shots, showMakes, showMisses, heatmap, zoneMethod, zoneSize, colorScale]);

  return <svg ref={svgRef}></svg>;
};

// Draw NBA court
const drawCourt = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, width: number, height: number) => {
  const courtWidth = 500; // NBA court is 50 feet wide
  const courtHeight = 470; // NBA half court is 47 feet deep (94/2)
  
  const scale = Math.min(width / courtWidth, (height - 50) / courtHeight);
  
  // Court outline
  svg.append('rect')
    .attr('x', -courtWidth * scale / 2)
    .attr('y', -courtHeight * scale)
    .attr('width', courtWidth * scale)
    .attr('height', courtHeight * scale)
    .attr('fill', '#f8f8f8')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Free throw circle
  svg.append('circle')
    .attr('cx', 0)
    .attr('cy', -(courtHeight - 190) * scale)
    .attr('r', 60 * scale)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Free throw lane (key)
  svg.append('rect')
    .attr('x', -80 * scale)
    .attr('y', -courtHeight * scale)
    .attr('width', 160 * scale)
    .attr('height', 190 * scale)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Backboard
  svg.append('line')
    .attr('x1', -30 * scale)
    .attr('y1', -(courtHeight - 40) * scale)
    .attr('x2', 30 * scale)
    .attr('y2', -(courtHeight - 40) * scale)
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Basket
  svg.append('circle')
    .attr('cx', 0)
    .attr('cy', -(courtHeight - 52.5) * scale)
    .attr('r', 9 * scale)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Three-point line (arc)
  const tpRadius = 238 * scale; // 23.8 feet
  
  svg.append('path')
    .attr('d', d3.arc()({
      innerRadius: tpRadius,
      outerRadius: tpRadius,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2
    }))
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Three-point corners
  svg.append('line')
    .attr('x1', -220 * scale)
    .attr('y1', -(courtHeight - 140) * scale)
    .attr('x2', -220 * scale)
    .attr('y2', -courtHeight * scale)
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  svg.append('line')
    .attr('x1', 220 * scale)
    .attr('y1', -(courtHeight - 140) * scale)
    .attr('x2', 220 * scale)
    .attr('y2', -courtHeight * scale)
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
  
  // Center court arc
  svg.append('path')
    .attr('d', d3.arc()({
      innerRadius: 60 * scale,
      outerRadius: 60 * scale,
      startAngle: -Math.PI / 2,
      endAngle: Math.PI / 2
    }))
    .attr('transform', `translate(0, ${-courtHeight * scale})`)
    .attr('fill', 'none')
    .attr('stroke', '#000')
    .attr('stroke-width', 2);
};

// Draw shot dots
const drawShots = (svg: d3.Selection<SVGGElement, unknown, null, undefined>, shots: Shot[]) => {
  const courtWidth = 500;
  const courtHeight = 470;
  
  // Scale factors for actual court dimensions to pixels
  const scaleX = Math.min(800, 600) / courtWidth;
  const scaleY = (600 - 50) / courtHeight;
  
  svg.selectAll('.shot-dot')
    .data(shots)
    .enter()
    .append('circle')
    .attr('class', 'shot-dot')
    .attr('cx', d => d.x * scaleX)
    .attr('cy', d => -d.y * scaleY)
    .attr('r', 4)
    .attr('fill', d => d.made ? '#2bba64' : '#e94c4d')
    .attr('opacity', 0.7)
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5)
    .append('title')
    .text(d => `${d.playerName}: ${d.made ? 'Made' : 'Missed'} ${d.shotType} (${d.distance} ft)`);
};

// Draw heat map
const drawHeatmap = (
  svg: d3.Selection<SVGGElement, unknown, null, undefined>, 
  shots: Shot[], 
  zoneMethod: 'hexbin' | 'grid', 
  zoneSize: 'small' | 'medium' | 'large',
  colorScale: string
) => {
  const courtWidth = 500;
  const courtHeight = 470;
  
  // Scale factors
  const scaleX = Math.min(800, 600) / courtWidth;
  const scaleY = (600 - 50) / courtHeight;
  
  // Determine zone size in pixels
  const zoneSizeValues = {
    small: 15,
    medium: 25,
    large: 40
  };
  
  const zoneRadius = zoneSizeValues[zoneSize];
  
  // Create color scale
  let colorScaleFunction;
  
  if (colorScale === 'redYellowGreen') {
    colorScaleFunction = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateRgb('#e94c4d', '#2bba64'));
  } else {
    colorScaleFunction = d3.scaleSequential()
      .domain([0, 1])
      .interpolator(d3.interpolateViridis);
  }
  
  // Prepare shot data
  const shotPoints = shots.map(shot => ([shot.x * scaleX, -shot.y * scaleY, shot.made ? 1 : 0]));
  
  if (zoneMethod === 'hexbin') {
    // D3 hexbin generator
    const hexbin = d3.hexbin()
      .radius(zoneRadius)
      .extent([[-courtWidth * scaleX / 2, -courtHeight * scaleY], [courtWidth * scaleX / 2, 0]]);
    
    // Group shots into hexbins
    const bins = hexbin(shotPoints as [number, number][]);
    
    // Add shotMade property to each point
    bins.forEach(bin => {
      bin.shotsMade = (bin as any[]).reduce((acc, shot) => acc + (shot[2] || 0), 0);
      bin.total = bin.length;
      bin.percentage = bin.total > 0 ? bin.shotsMade / bin.total : 0;
    });
    
    // Draw hexagons
    svg.selectAll('.hexagon')
      .data(bins)
      .enter()
      .append('path')
      .attr('class', 'hexagon')
      .attr('d', hexbin.hexagon())
      .attr('transform', d => `translate(${d.x}, ${d.y})`)
      .attr('fill', d => colorScaleFunction(d.percentage))
      .attr('stroke', '#fff')
      .attr('stroke-width', 1)
      .append('title')
      .text(d => `${Math.round(d.percentage * 100)}% (${d.shotsMade}/${d.total})`);
  } else {
    // Grid method
    const gridSize = zoneRadius * 2;
    
    // Create grid cells
    const gridData: any[] = [];
    
    for (let x = -courtWidth * scaleX / 2; x < courtWidth * scaleX / 2; x += gridSize) {
      for (let y = -courtHeight * scaleY; y < 0; y += gridSize) {
        const cellShots = shotPoints.filter(shot => 
          shot[0] >= x && shot[0] < x + gridSize && 
          shot[1] >= y && shot[1] < y + gridSize
        );
        
        if (cellShots.length > 0) {
          const shotsMade = cellShots.reduce((acc, shot) => acc + (shot[2] || 0), 0);
          const percentage = shotsMade / cellShots.length;
          
          gridData.push({
            x,
            y,
            shotsMade,
            total: cellShots.length,
            percentage
          });
        }
      }
    }
    
    // Draw grid cells
    svg.selectAll('.grid-cell')
      .data(gridData)
      .enter()
      .append('rect')
      .attr('class', 'grid-cell')
      .attr('x', d => d.x)
      .attr('y', d => d.y)
      .attr('width', gridSize)
      .attr('height', gridSize)
      .attr('fill', d => colorScaleFunction(d.percentage))
      .attr('stroke', '#fff')
      .attr('stroke-width', 0.5)
      .append('title')
      .text(d => `${Math.round(d.percentage * 100)}% (${d.shotsMade}/${d.total})`);
  }
  
  // Add legend
  const legendWidth = 200;
  const legendHeight = 20;
  
  const legendX = courtWidth * scaleX / 2 - legendWidth - 20;
  const legendY = -courtHeight * scaleY + 20;
  
  const legendScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0, legendWidth]);
  
  const legend = svg.append('g')
    .attr('transform', `translate(${legendX}, ${legendY})`);
  
  // Create gradient for legend
  const defs = svg.append('defs');
  
  const gradient = defs.append('linearGradient')
    .attr('id', 'shotPercentageGradient')
    .attr('x1', '0%')
    .attr('x2', '100%')
    .attr('y1', '0%')
    .attr('y2', '0%');
  
  gradient.append('stop')
    .attr('offset', '0%')
    .attr('stop-color', colorScaleFunction(0));
  
  gradient.append('stop')
    .attr('offset', '100%')
    .attr('stop-color', colorScaleFunction(1));
  
  // Draw legend rectangle
  legend.append('rect')
    .attr('width', legendWidth)
    .attr('height', legendHeight)
    .attr('fill', 'url(#shotPercentageGradient)');
  
  // Add axis to legend
  const legendAxis = d3.axisBottom(legendScale)
    .tickValues([0, 25, 50, 75, 100])
    .tickFormat(d => `${d}%`);
  
  legend.append('g')
    .attr('transform', `translate(0, ${legendHeight})`)
    .call(legendAxis);
  
  // Add legend title
  legend.append('text')
    .attr('x', legendWidth / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .attr('font-size', '12px')
    .text('Shot Percentage');
};

export default CourtVisualization;