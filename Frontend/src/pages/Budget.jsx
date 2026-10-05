import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../ApiClient/interceptor";

import {
  Wallet,
  Plus,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle,
  Trash2,
} from "lucide-react";

const MONTH_NAMES = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Budget = () => {
  const [budget, setBudget] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Get all budgets
  const getBudget = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await apiClient.get("/budget/get");

      setBudget(response.data.data || []);
    } catch (err) {
      console.log(err.message);

      setError(
        err.response?.data?.message ||
          "Unable to load your budgets. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBudget();
  }, []);

  // Open budget details
  const handleClick = (budgetId) => {
    navigate(`/budget/${budgetId}`);
  };

  // Delete budget
  const handleDelete = async (e, budgetId) => {
    e.stopPropagation();

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this budget?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await apiClient.delete(`/budget/delete/${budgetId}`);

      setBudget((prevBudget) =>
        prevBudget.filter((item) => item._id !== budgetId)
      );
    } catch (err) {
      console.log(err.message);

      alert(
        err.response?.data?.message ||
          "Unable to delete budget. Please try again."
      );
    }
  };

  // Go to create budget page
  const handleCreateBudget = () => {
    navigate("/createbudget");
  };

  const totalAllocated = budget.reduce(
    (total, item) => total + Number(item.amount),
    0
  );

  const totalBudget = budget.length;

  const activeBudgets = budget.filter(
    (item) => !item.isDone
  ).length;

  return (
    <main className="budget-page">
      {/* ================= HEADER ================= */}

      <div className="budget-list-header">
        <div>
          <p className="budget-tag">PERSONAL FINANCE</p>

          <h1>Your Budgets</h1>

          <p className="budget-list-subtitle">
            Manage your monthly budgets and keep track of your spending.
          </p>
        </div>

        <button
          type="button"
          className="budget-add-btn"
          onClick={handleCreateBudget}
        >
          <Plus size={18} />
          <span>Create Budget</span>
        </button>
      </div>

      {/* ================= LOADING ================= */}

      {loading && (
        <div className="budget-status">
          <div className="budget-spinner"></div>
          <p>Loading your budgets...</p>
        </div>
      )}

      {/* ================= ERROR ================= */}

      {!loading && error && (
        <div className="budget-status budget-error">
          <p>{error}</p>

          <button type="button" onClick={getBudget}>
            Try Again
          </button>
        </div>
      )}

      {/* ================= EMPTY STATE ================= */}

      {!loading && !error && budget.length === 0 && (
        <div className="budget-empty">
          <div className="budget-empty-icon">
            <Wallet size={35} />
          </div>

          <h2>No Budgets Yet</h2>

          <p>
            You haven't created any budgets yet. Start by creating your first
            monthly budget.
          </p>

          <button
            type="button"
            className="budget-add-btn"
            onClick={handleCreateBudget}
          >
            <Plus size={18} />
            <span>Create Your First Budget</span>
          </button>
        </div>
      )}

      <div className="budget-summary">
        <div className="summary-card">
          <div className="summary-icon">₹</div>

          <div>
            <h3>₹{totalAllocated.toLocaleString()}</h3>
            <p>Total Allocated</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">▣</div>

          <div>
            <h3>₹{totalBudget.toLocaleString()}</h3>
            <p>Total Budget</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon">✓</div>

          <div>
            <h3>{activeBudgets}</h3>
            <p>Active Budgets</p>
          </div>
        </div>
      </div>

      {/* ================= BUDGET CARDS ================= */}

      {!loading && !error && budget.length > 0 && (
        <div className="budget-container">
          {budget.map((bud) => {
            const monthName =
              MONTH_NAMES[Number(bud.month)] || `Month ${bud.month}`;

            const categoryName =
              bud.category?.category ||
              bud.category?.name ||
              "General";

            return (
              <div
                className="budget-item"
                key={bud._id}
                onClick={() => handleClick(bud._id)}
              >
                {/* Card top */}

                <div className="budget-card-top">
                  <div className="budget-category">
                    <Layers size={16} />
                    <span>{categoryName}</span>
                  </div>

                  <div className="budget-card-actions">
                    <div className="budget-wallet-icon">
                      <Wallet size={20} />
                    </div>

                    <button
                      type="button"
                      className="budget-delete-btn"
                      onClick={(e) => handleDelete(e, bud._id)}
                      title="Delete budget"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                </div>

                {/* Amount */}

                <div className="budget-amount-section">
                  <p>Budget Limit</p>

                  <h2>
                    <span>₹</span>
                    {Number(bud.amount).toLocaleString("en-IN")}
                  </h2>
                </div>

                {/* Details */}

                <div className="budget-info">
                  <div className="budget-info-item">
                    <Calendar size={16} />

                    <div>
                      <span>Period</span>

                      <strong>
                        {monthName} {bud.year}
                      </strong>
                    </div>
                  </div>

                  <div className="budget-info-item">
                    {bud.isDone ? (
                      <CheckCircle size={16} />
                    ) : (
                      <Clock size={16} />
                    )}

                    <div>
                      <span>Status</span>

                      <strong>
                        {bud.isDone ? "Completed" : "Active"}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Open details */}

                <div className="budget-card-footer">
                  <span>View Budget Details</span>

                  <ArrowRight size={18} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Budget;