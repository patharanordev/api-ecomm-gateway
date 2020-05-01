import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts';
import Title from './Title';

// Generate Sales Data
function createData(date, total) {
  return { date:date.split('T')[0], total };
}

const data = [
  createData('2020-11-01', 0),
  createData('2020-11-12', 300),
  createData('2020-11-21', 600),
  createData('2020-12-04', 800),
  createData('2020-12-13', 1500),
  createData('2020-12-15', 2000),
  createData('2020-01-08', 2400),
  createData('2020-01-21', 2400),
  createData('2020-02-22', undefined),
];

export default function Chart(props) {
  const theme = useTheme();

  console.log(props.dailyAccount);

  return (
    <React.Fragment>
      <Title>Daily Revenue</Title>
      <ResponsiveContainer>
        <LineChart
          data={
            props.dailyAccount && Array.isArray(props.dailyAccount)
            ? props.dailyAccount.map((o) => createData(o.date, o.total))
            : null
          }
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="date" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Sales ($)
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="total" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}