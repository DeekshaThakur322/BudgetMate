import React, { useEffect, useState } from "react";
import apiClient from "../ApiClient/interceptor";
import {
  Layers,
  Plus,
  X,
  Check,
  IndianRupee,
  Calendar,
  CalendarDays,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
const CreateBudget = () => {
  // Categories
  const [categories, setCategories] = useState([]);
  const [categoryLoader, setCategoryLoader] = useState(true);

  // Create category
  const [createCategory, setCreateCategory] = useState(false);

  const [createCategoryData, setcreateCategoryData] = useState({
    category: "",
  });

  // Budget
  const [budgetData, setBudgetData] = useState({
    category: "",
    amount: "",
    month: "",
    year: "",
  });

  // Months
  const month = [
    {
      value: 1,
      name: "January",
    },
    {
      value: 2,
      name: "February",
    },
    {
      value: 3,
      name: "March",
    },
    {
      value: 4,
      name: "April",
    },
    {
      value: 5,
      name: "May",
    },
    {
      value: 6,
      name: "June",
    },
    {
      value: 7,
      name: "July",
    },
    {
      value: 8,
      name: "August",
    },
    {
      value: 9,
      name: "September",
    },
    {
      value: 10,
      name: "October",
    },
    {
      value: 11,
      name: "November",
    },
    {
      value: 12,
      name: "December",
    },
  ];

  // Get categories
  const getCategories = async () => {
    try {
      const response = await apiClient.get("/category/get");
      setCategories(response.data.data);
    } catch (err) {
      console.log(err.message);
    } finally {
      setCategoryLoader(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // Handle category creation input
  const handleCategoryChange = (e) => {
    setcreateCategoryData({
      ...createCategoryData,
      [e.target.name]: e.target.value,
    });
  };

  // Create new category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();

    try {
      await apiClient.post("/category/create", createCategoryData);

      // Get updated categories
      getCategories();

      // Clear input
      setcreateCategoryData({
        category: "",
      });

      // Close category input
      setCreateCategory(false);
    } catch (err) {
      console.log(err.message);
    }
  };

  // Handle budget input changes
  const handleChange = (e) => {
    setBudgetData({
      ...budgetData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit budget
  const submitBudget = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post(
        "/budget/create",
        budgetData
      );

      console.log(response.data);

      // Clear form after successful submission
      setBudgetData({
        category: "",
        amount: "",
        month: "",
        year: "",
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <>
      <main className="create-budget-page">

        {/* PAGE HEADER */}
        <div className="budget-header">
          <p className="budget-tag">PERSONAL FINANCE</p>

          <h1>Create Your Budget</h1>

          <p>
            Plan your spending and stay in control of your money.
          </p>
        </div>

        {/* BUDGET FORM CARD */}
        <div className="budget-card">

          <form onSubmit={submitBudget}>

            {/* CATEGORY */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              {categoryLoader ? (
                <select disabled>
                  <option value="">
                    Loading...
                  </option>
                </select>
              ) : categories.length === 0 ? (
                <select disabled>
                  <option value="">
                    No categories found
                  </option>
                </select>
              ) : (
                <select
                  name="category"
                  id="category"
                  value={budgetData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select a category
                  </option>

                  {categories.map((cat) => (
                    <option
                      key={cat._id}
                      value={cat._id}
                    >
                      {cat.category}
                    </option>
                  ))}
                </select>
              )}

              {/* CREATE CATEGORY */}
              <div className="create-category">

                {createCategory ? (
                  <>
                    <input
                      type="text"
                      placeholder="Enter category"
                      name="category"
                      value={createCategoryData.category}
                      onChange={handleCategoryChange}
                    />

                    <button
                      type="button"
                      onClick={handleCategorySubmit}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCreateCategory(false);
                        setcreateCategoryData({
                          category: "",
                        });
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      setCreateCategory(true)
                    }
                  >
                    + Create New Category
                  </button>
                )}

              </div>
            </div>

            {/* AMOUNT */}
            <div className="form-group">
              <label htmlFor="amount">
                Budget Amount
              </label>

              <div className="amount-input">
                <span>₹</span>

                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={budgetData.amount}
                  placeholder="Enter your amount"
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* MONTH */}
            <div className="form-group">
              <label htmlFor="month">
                Month
              </label>

              <select
                name="month"
                id="month"
                value={budgetData.month}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select month
                </option>

                {month.map((m) => (
                  <option
                    key={m.value}
                    value={m.value}
                  >
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            {/* YEAR */}
            <div className="form-group">
              <label htmlFor="year">
                Year
              </label>

              <input
                type="number"
                id="year"
                name="year"
                placeholder="Enter year"
                min={2026}
                max={2031}
                value={budgetData.year}
                onChange={handleChange}
                required
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="create-budget-btn"
            >
              Create Budget
            </button>

          </form>
        </div>
      </main>
    </>
  );
};

export default CreateBudget;