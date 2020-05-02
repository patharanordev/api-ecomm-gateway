import React from 'react';
import {
  ResponsiveContainer, 
  PieChart, Pie, Cell,
  Tooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#87ff95', '#ff87f3', '#ff5c5c'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx, cy, midAngle, innerRadius, outerRadius, name, percent, index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // console.log({ name:name, percent:percent })

  return (
    <text x={x} y={y} fill="white" font-size="10" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      <tspan x={x} y={y}>{`${name}`}</tspan>
      <tspan x={x} y={y+10}>{`${(percent * 100).toFixed(0)}%`}</tspan>
    </text>
  );
};

// const data = [
//   { name: 'Group A', value: 400 },
//   { name: 'Group B', value: 300 },
//   { name: 'Group C', value: 300 },
//   { name: 'Group D', value: 200 },
// ];


export default function OrderStatus(props) {
  
  console.log('orderStatus:', props.orderStatus)

  return (
    <div style={{ width: '100%', height: '100%' }}>
    {
      props.orderStatus && Array.isArray(props.orderStatus)
      ? 
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={
                props.orderStatus.map((o) => {
                  console.log(o)
                  o.value = parseInt(o.value)
                  return o
                })
                // data
              }
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {
                props.orderStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
                // data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
              }
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      : 
        null
    }
    </div>
  );
}
