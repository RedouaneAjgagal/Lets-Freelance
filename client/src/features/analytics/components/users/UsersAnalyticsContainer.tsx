import { Bar, BarChart, CartesianGrid, Legend, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import formatDates, { formatRequestDates } from "../../utils/formatDates";
import { FilterValues } from "../ChartsNavbar";
import AnalyticsWrapper from "../AnalyticsWrapper";
import { useEffect, useState } from "react";


const UsersAnalyticsContainer = () => {
  const [filterValue, setFilterValue] = useState<FilterValues>("week");

  const barDataKey = "Created accounts";

  const values = [
    {
      _id: "2024",
      count: 2
    },
    {
      _id: "2023",
      count: 6
    },
    {
      _id: "2020",
      count: 4
    },
    {
      _id: "2017",
      count: 4
    }
  ].map(value => {
    const dateValue = formatRequestDates({
      value: value._id,
      dateType: filterValue === "all" ? undefined : filterValue
    });

    return {
      _id: dateValue,
      [barDataKey]: value.count
    }
  });

  const dates = formatDates({
    dateType: filterValue === "all" ? undefined : filterValue,
    value: values,
    barDataKey
  });

  const selectFilterValueHandler = (filter: FilterValues) => {
    setFilterValue(filter);
  }

  useEffect(() => {
    console.log(filterValue);
  }, [filterValue]);

  return (
    <AnalyticsWrapper filterValue={filterValue} onSelectFilter={selectFilterValueHandler} title="Created accounts">
      <ResponsiveContainer>
        <BarChart className="w-full"
          width={300}
          height={300}
          data={dates}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray={3} />
          <XAxis dataKey="_id" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={barDataKey} fill="#4884d8" activeBar={<Rectangle fill="#bae6fd" stroke="blue" />} />
        </BarChart>
      </ResponsiveContainer>
    </AnalyticsWrapper>
  )
}

export default UsersAnalyticsContainer