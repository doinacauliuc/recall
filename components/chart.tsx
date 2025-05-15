import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/hooks/userContext'; 

// Registering necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


// Chart component to display weekly study hours
export default function Chart() {
  // State to store formatted data for the chart
  const [studyData, setStudyData] = useState<{ labels: string[]; datasets: any[] } | null>(null);

  // Access current user from context
  const { user } = useUser();

  // Fetch study session data from the backend API
  const fetchData = async () => {
    try {
      // Send a GET request to the API with the user's ID
      const res = await fetch(`/api/study-session?userId=${user?.id}`);

      // Handle failed response
      if (!res.ok) {
        throw new Error('Failed to fetch study data');
      }

      // Parse the response as JSON (array of { day, hours } objects)
      const rawData: { day: string; hours: number }[] = await res.json();

      // Extract labels (days) and corresponding study hours
      const labels = rawData.map(d => d.day);
      const data = rawData.map(d => d.hours);

      // Format the data in a structure compatible with Chart.js
      setStudyData({
        labels,
        datasets: [
          {
            label: 'Study Hours',
            data,
            backgroundColor: 'rgba(108, 46, 81, 0.49)', // Light purple fill
            borderColor: 'rgba(108, 46, 81, 1)',       // Darker purple border
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      // Log any error during fetch
      console.error('Error fetching study data:', error);
    }
  };

  // Fetch study data once the user is available
  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  // Chart configuration options
  const options = {
    responsive: true, // Chart adjusts to container size
    plugins: {
      title: {
        display: true,
        text: 'Time Spent Studying This Week',
        font: {
          size: 20,
          color: 'rgba(108, 46, 81, 1)', // Title text color
        },
      },
      tooltip: {
        mode: "index" as const, // Show all items in the same index on hover
        intersect: false,
      },
    },
    scales: {
      x: {
        beginAtZero: true, // Start X-axis at 0
      },
      y: {
        beginAtZero: true, // Start Y-axis at 0
      },
    },
  };

  // Render the chart only when studyData is available
  return (
    <div style={{ width: '90%', height: '100%', margin: '0 auto' }}>
      {studyData && <Bar options={options} data={studyData} />}
    </div>
  );
}
