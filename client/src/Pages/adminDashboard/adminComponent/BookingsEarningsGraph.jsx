import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Legend);

const BookingsEarningsGraph = () => {
  const [bookingsData, setBookingsData] = useState([]);
  const [earningsData, setEarningsData] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/bookingCount/getAllBookings');
        const bookingsList = response.data.data;

        // Calculate daily earnings and bookings
        const dailyData = bookingsList.reduce((acc, booking) => {
          const date = booking.preferreddate;
          if (!acc[date]) {
            acc[date] = { earnings: 0, bookings: 0 };
          }
          acc[date].earnings += booking.netTotal;
          acc[date].bookings += 1;
          return acc;
        }, {});

        const dates = Object.keys(dailyData).sort();
        const earnings = dates.map(date => dailyData[date].earnings);
        const bookings = dates.map(date => dailyData[date].bookings);

        setBookingsData({ dates, bookings });
        setEarningsData({ dates, earnings });
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const data = {
    labels: bookingsData.dates,
    datasets: [
      {
        label: 'Daily Bookings',
        data: bookingsData.bookings,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
      {
        label: 'Daily Earnings',
        data: earningsData.earnings,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        fill: true,
      },
    ],
  };

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Daily Bookings and Earnings',
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      },
      legend: {
        position: 'top',
      },
    },
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Count / Earnings',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default BookingsEarningsGraph;