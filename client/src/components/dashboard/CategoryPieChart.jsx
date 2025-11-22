// src/components/dashboard/CategoryPieChart.jsx
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryPieChart = () => {
  const data = {
    labels: ['Electronics', 'Accessories', 'Computing', 'Mobile', 'Audio'],
    datasets: [
      {
        label: 'Stock Distribution',
        data: [3500, 2800, 4200, 3900, 1600],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ],
        borderColor: '#fff',
        borderWidth: 2
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { padding: 20, font: { size: 13 } } },
      tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', padding: 12, borderRadius: 8 }
    },
    animation: { animateRotate: true, animateScale: true, duration: 1500 }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Category Distribution</h3>
      <div className="h-80">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default CategoryPieChart;

