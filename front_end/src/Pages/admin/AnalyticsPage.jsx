import { FiMenu, FiBell, FiSearch, FiUser, FiSettings } from "react-icons/fi";
import { Line, Pie, Bar, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);


const DashboardCard = ({ title, value, icon, percentage }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
          <p className="text-green-500 text-sm mt-2">+{percentage}%</p>
        </div>
        <div className="text-blue-500 text-3xl">{icon}</div>
      </div>
    </motion.div>
  );
};
const AnalyticsPage = () => {
    const lineChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
        label: "Revenue",
        data: [3000, 4500, 3500, 5000, 4800, 6000],
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4
        }]
    };

    const pieChartData = {
        labels: ["Desktop", "Mobile", "Tablet"],
        datasets: [{
        data: [45, 40, 15],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
        }]
    };

    const barChartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
        datasets: [{
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(59, 130, 246, 0.5)"
        }]
    };

    const donutChartData = {
        labels: ["Electronics", "Clothing", "Food", "Others"],
        datasets: [{
        data: [30, 25, 20, 25],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
        }]
    };
    
    return(
        <div className={`flex-1 ml-64} transition-all duration-300`}>
            {/* Dashboard Content */}
            <main className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <DashboardCard
                  title="Tổng số sản phẩm hoạt động"
                  value="$54,375"
                  percentage="12.5"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số đơn hàng"
                  value="2,345"
                  percentage="8.2"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số khách hàng"
                  value="3.45%"
                  percentage="5.6"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số doanh thu"
                  value="$123"
                  percentage="10.2"
                  icon={<FiUser />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Revenue Trends</h3>
                  <Line data={lineChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">User Distribution</h3>
                  <Pie data={pieChartData} options={{ responsive: true }} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Monthly Performance</h3>
                  <Bar data={barChartData} options={{ responsive: true }} />
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Product Categories</h3>
                  <Doughnut data={donutChartData} options={{ responsive: true }} />
                </div>
              </div>
            </main>
        </div>
    );


}
export default AnalyticsPage;