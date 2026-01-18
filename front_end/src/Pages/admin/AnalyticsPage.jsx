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
import { useEffect, useState } from "react";
import { AnalyticsService } from "../../API/AnalyticsService";
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
    const [analytics,setAnalytics] = useState({});
    const [revenue, setRevenue] = useState({});
    const [bestSeller, setBestSeller] = useState({
      variants: [],
      quantities: []
    });
    const fetchRevenue = async () => {
      const response = await AnalyticsService.getRevenueLast6Months();
      console.log("API response:", response);
      setRevenue(response.result);
    };
    const fetchProducts = async () => {
      const response = await AnalyticsService.getAnalytics();
      console.log("API response:", response);
      setAnalytics(response.result);
    };
    const fetchBestSellers = async() => {
      const response = await AnalyticsService.getTopSellingVariants();
      console.log("API response:", response);
      setBestSeller(response.result);
    }

    useEffect(() => {
      fetchProducts();
      fetchRevenue();
      fetchBestSellers();
    }, []);

    const lineChartData = {
        labels: revenue.months,
        datasets: [{
        label: "Doanh thu",
        data: revenue.revenues,
        borderColor: "rgb(59, 130, 246)",
        tension: 0.4
        }]
    };
    // const [lineChartData,setLineChartData]= useState({});

    const pieChartData = {
        labels: ["Desktop", "Mobile", "Tablet"],
        datasets: [{
        data: [45, 40, 15],
        backgroundColor: ["#3B82F6", "#10B981", "#F59E0B"]
        }]
    };

    const barChartData = {
        labels: bestSeller.variants.map(v => v.product.name),
        datasets: [{
        label: "Số lượng bán ra",
        data: bestSeller.quantities,
        backgroundColor: "rgba(59, 130, 246, 0.5)"
        }]
    };

    const options = {
      scales: {
        x: {
          ticks: {
            callback: function(value) {
              const label = this.getLabelForValue(value);
              return label.length > 10 ? label.substring(0, 10) + "..." : label;
            }
          }
        },
        y: {
          ticks: {
            callback: function(value) {
              return Number.isInteger(value) ? value : null;  
            }
          }
        }
      }
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
                  value={analytics.totalProducts}
                  percentage="12.5"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số đơn hàng"
                  value={analytics.totalOrders}
                  percentage="8.2"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số khách hàng"
                  value={analytics.totalCustomers}
                  percentage="5.6"
                  icon={<FiUser />}
                />
                <DashboardCard
                  title="Tổng số doanh thu"
                  value={analytics.totalRevenue+' đồng'}
                  percentage="10.2"
                  icon={<FiUser />}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Doanh thu 6 tháng gần nhất</h3>
                  <Line data={lineChartData} options={{ responsive: true }} />
                </div>
                
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">Top 6 sản phẩm bán chạy nhất</h3>
                  <Bar data={barChartData} options={options} />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
                  <h3 className="text-xl font-bold mb-4">User Distribution</h3>
                  <Pie data={pieChartData} options={{ responsive: true }} />
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