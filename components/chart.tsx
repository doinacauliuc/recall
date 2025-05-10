import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { useEffect, useState } from 'react';
import { useUser } from '@/app/hooks/userContext'; // Importing user context from Clerk
import { color } from 'framer-motion';

// Registering necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Chart(){
    const [studyData, setStudyData] = useState<{ labels: string[]; datasets: any[] } | null>(null);
    const { user } = useUser(); // Accessing user context

      const fetchData = async () => {
    try {
      const res = await fetch(`/api/study-session?userId=${user?.id}`);
      if (!res.ok) {
        throw new Error('Failed to fetch study data');
      }
      const rawData: { day: string; hours: number }[] = await res.json();

      const labels = rawData.map(d => d.day);
      const data = rawData.map(d => d.hours);

      setStudyData({
        labels,
        datasets: [
          {
            label: 'Study Hours',
            data,
            backgroundColor: 'rgba(108, 46, 81, 0.49)',
            borderColor: 'rgba(108, 46, 81, 1)',
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching study data:', error);
    }
  };

    useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Time Spent Studying This Week',
                font: {
                    size: 20,
                    color: 'rgba(108, 46, 81, 1)',}
            },
            tooltip: {
                mode: "index" as const,
                intersect: false,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
            },
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div style={{ width: '90%', height: '100%', margin: '0 auto' }}>
            {studyData && <Bar options={options} data={studyData} />}
        </div>
    );
}
