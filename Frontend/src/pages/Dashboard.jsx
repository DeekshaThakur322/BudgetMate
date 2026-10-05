
import React, { useEffect, useState } from "react";
import apiClient from "../ApiClient/interceptor";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalBudget: 0,
    totalSpent: 0,
    remaining: 0,
    activeBudgets: 0,
    spentPercentage: 0,
    categoryData: [],
    monthlyData: [],
    budgets: [],
    purchases: [],
  });

  const getDashboardData = async () => {
    try {
      const response = await apiClient.get("/dashboard/overview");

      console.log("Dashboard data:", response.data);

      setDashboardData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const {
    totalBudget,
    totalSpent,
    remaining,
    activeBudgets,
    spentPercentage,
    categoryData,
    monthlyData,
    budgets,
    purchases,
  } = dashboardData;

  const currentMonth = new Date().toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
  });
  const alerts = budgets.map((budget) => {
  const budgetPurchases = purchases.filter(
    (purchase) => purchase.budget === budget._id
  );

  const budgetSpent = budgetPurchases.reduce(
    (total, purchase) => total + Number(purchase.amount),
    0
  );

  const percentage =
    budget.amount > 0
      ? (budgetSpent / budget.amount) * 100
      : 0;

  return {
    category: budget.category?.category,
    percentage: Math.round(percentage),
    remaining: budget.amount - budgetSpent,
  };
});
const budgetAlerts = alerts
  .filter((alert) => alert.percentage >= 80)
  .map((alert) => {
    return {
      ...alert,
      message:
        alert.percentage >= 100
          ? "You've reached your budget limit."
          : "You're close to your budget limit.",
    };
  });
  const chartColors = [
  "#d946ef",
  "#22b8cf",
  "#20e3a2",
  "#8e44ad",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#14b8a6",
];

  return (
    <div className="dashboard-container">

      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Welcome back 👋</h1>
          <p>Here's your budget overview</p>
        </div>

        <Link to="/createbudget" className="dashboard-add-btn">
          + Create Budget
        </Link>
      </div>


      {/* Summary Cards */}
      <div className="dashboard-summary">

        <div className="summary-card">
          <p>Total Budget</p>
          <h2>₹{Number(totalBudget).toLocaleString("en-IN")}</h2>
          <span>This month</span>
        </div>

        <div className="summary-card">
          <p>Total Spent</p>
          <h2>₹{Number(totalSpent).toLocaleString("en-IN")}</h2>
          <span>{spentPercentage}% of budget</span>
        </div>

        <div className="summary-card">
          <p>Remaining</p>
          <h2>₹{Number(remaining).toLocaleString("en-IN")}</h2>
          <span>Available to spent</span>
        </div>

        <div className="summary-card">
          <p>Active Budgets</p>
          <h2>{activeBudgets}</h2>
          <span>This month</span>
        </div>

      </div>


      {/* Spending Overview */}
      <div className="dashboard-section">

        <div className="section-header">
          <div>
            <h2>Spending Overview</h2>
            <p>{currentMonth}</p>
          </div>

          <span>{spentPercentage}% spent</span>
        </div>

        <div className="spending-amount">
          <strong>
            ₹{Number(totalSpent).toLocaleString("en-IN")}
          </strong>

          <span>
            of ₹{Number(totalBudget).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${Math.min(spentPercentage, 100)}%`,
            }}
          ></div>
        </div>

      </div>


      {/* Charts */}
      <div className="dashboard-charts">


        {/* Spending by Category */}
        <div className="dashboard-section spending-chart-section">

          <div className="section-header">
            <div>
              <h2>Spending by Category</h2>
              <p>Where your money is going</p>
            </div>
          </div>

          {categoryData.length === 0 ? (
            <p>No spending data available.</p>
          ) : (
            <PieChart width={400} height={300}>

              <Pie
                data={categoryData}
                dataKey="amount"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                label
              >

              {categoryData.map((entry, index) => (
  <Cell
    key={`cell-${index}`}
    fill={chartColors[index % chartColors.length]}
  />
))}

              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />

              <Legend />

            </PieChart>
          )}

        </div>


        {/* Monthly Spending */}
        <div className="dashboard-section monthly-chart-section">

          <div className="section-header">
            <div>
              <h2>Monthly Spending</h2>
              <p>Track your spending over time</p>
            </div>
          </div>

          {monthlyData.length === 0 ? (
            <p>No monthly spending data available.</p>
          ) : (
            <BarChart
              width={500}
              height={300}
              data={monthlyData}
              margin={{
                top: 20,
                right: 20,
                left: 10,
                bottom: 10,
              }}
            >

              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" />

              <YAxis />

              <Tooltip
                formatter={(value) =>
                  `₹${Number(value).toLocaleString("en-IN")}`
                }
              />
<Bar
  dataKey="amount"
  fill="#8a2d89 "
  radius={[6, 6, 0, 0]}
/>
              
            </BarChart>
          )}

        </div>

      </div>

{/* Budget Alerts */}
<div className="dashboard-section budget-alert-section">

  <div className="section-header">
    <div>
      <h2>Budget Alerts</h2>
      <p>Budgets that need your attention</p>
    </div>
  </div>

  {budgetAlerts.length === 0 ? (
  <div className="budget-alert">
    <div>
      <h3>All Budgets</h3>
      <p>All your budgets are under control.</p>
    </div>

    <strong>✓</strong>
  </div>
) : (
  budgetAlerts.map((alert, index) => (
    <div className="budget-alert" key={index}>

      <div>
        <h3>{alert.category}</h3>
        <p>{alert.message}</p>
      </div>

      <strong>{alert.percentage}%</strong>

    </div>
  ))
)}

</div>


 
      {/* Bottom Section */}
      <div className="dashboard-bottom">


        {/* Your Budgets */}
        <div className="dashboard-section">

          <div className="section-header">
            <h2>Your Budgets</h2>

            <Link to="/budget">
              View All →
            </Link>
          </div>


          {budgets.map((budget) => {

            const budgetPurchases = purchases.filter(
              (purchase) => purchase.budget === budget._id
            );

            const budgetSpent = budgetPurchases.reduce(
              (total, purchase) =>
                total + Number(purchase.amount),
              0
            );

            const percentage =
              budget.amount > 0
                ? Math.min(
                    (budgetSpent / budget.amount) * 100,
                    100
                  )
                : 0;


            return (
              <div
                className="budget-row"
                key={budget._id}
              >

                <div>
                  <h3>
                    {budget.category?.category}
                  </h3>

                  <p>
                    ₹{Number(budget.amount).toLocaleString("en-IN")}
                  </p>
                </div>


                <div className="budget-progress">

                  <div className="progress-bar">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    ></div>

                  </div>

                  <span>
                    {Math.round(percentage)}%
                  </span>

                </div>

              </div>
            );
          })}

        </div>


        {/* Recent Purchases */}
        <div className="dashboard-section">

          <div className="section-header">
            <h2>Recent Purchases</h2>
          </div>


          {purchases.length === 0 ? (
            <p>No purchases found.</p>
          ) : (
            purchases.slice(0, 3).map((purchase) => (

              <div
                className="purchase-row"
                key={purchase._id}
              >

                <div>
                  <h3>{purchase.title}</h3>
                  <p>Purchase</p>
                </div>

                <strong>
                  ₹{Number(purchase.amount).toLocaleString("en-IN")}
                </strong>

              </div>

            ))
          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
