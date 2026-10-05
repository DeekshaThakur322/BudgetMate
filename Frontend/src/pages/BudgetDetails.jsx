import React, { useEffect, useState } from 'react'
import apiClient from '../ApiClient/interceptor';
import { useParams } from 'react-router-dom';

const BudgetDetails = () => {
  //use params 
  const { budgetId } = useParams();
  //budgetStatus
  const [budget, setBudget] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // Purchase states
  const [purchases, setPurchases] = useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(true);
  const [showAddPurchase, setShowAddPurchase] = useState(false);
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchaseCount, setPurchaseCount] = useState(0);
  const [purchaseForm, setPurchaseForm] = useState({
    title: "",
    amount: "",
    note: "",
    date: ""
  })
  const budDetails = async () => {
    try {
      setLoading(true);
      setError("");
      console.log("ID FROM URL:", budgetId);
      const response = await apiClient.get(`/budget/get/${budgetId}`);
      console.log(response.data);
      setBudget(response.data.data);
    } catch (err) {
      console.log(err.message);
      setError(
        err.response?.data?.message || "failed to load data"
      )
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchaseForm({
      ...purchaseForm,
      [name]: value,
    });
  };
  const createPurchase = async (e) => {
    e.preventDefault();
    if (!purchaseForm.title || !purchaseForm.amount) {
      alert("Title and amount are required");
      return;
    }
    try {
      setPurchaseLoading(true);

      const response = await apiClient.post("/purchase/create", {
        title: purchaseForm.title,
        amount: Number(purchaseForm.amount),
        budgetId: budgetId,
        note: purchaseForm.note,
        date: purchaseForm.date,
      });

      console.log("Purchase created:", response.data);
      await getPurchases();
      setPurchaseForm({
        title: "",
        amount: "",
        note: "",
        date: ""
      });
    } catch (err) {
      console.log(err);
    } finally {
      setPurchaseLoading(false);
    }
  };
  const getPurchases = async () => {
    try {
      setPurchaseLoading(true);

      const response = await apiClient.get(`/purchase/get/${budgetId}`);

      console.log("Purchases:", response.data);

      console.log("Purchase data:", response.data.purchases);

      setPurchases(response.data.purchases);
      setTotalSpent(response.data.totalSpent);
      setPurchaseCount(response.data.count);
    } catch (err) {
      console.log(err);
    } finally {
      setPurchaseLoading(false);
    }
  };
  const deletePurchase = async (purchaseId) => {
    try {
      setPurchaseLoading(true);

      const response = await apiClient.delete(
        `/purchase/delete/${purchaseId}`
      );

      console.log("Purchase deleted:", response.data);

      await getPurchases();

    } catch (err) {
      console.log(err);
    } finally {
      setPurchaseLoading(false);
    }
  };
  useEffect(() => {
    if (budgetId) {
      budDetails();
      getPurchases();
    }
  }, [budgetId])
  if (loading) {
    return <h2>Loading...</h2>;
  }


  return (

    <div className='budget-container'>


      {budget ? (
        <div className="budget-details-card">

          <div className="budget-card-header">

            <div>
              <div className="budget-category-pill">
                {budget.category.category}
              </div>

              <h1>{budget.category.category} Budget</h1>

              <p>
                Target allocation for {budget.month}/{budget.year}
              </p>
            </div>

            <div className="budget-status-pill">
              ● Active Budget
            </div>

          </div>

          <div className="budget-amount-box">

            <div>
              <span>Allocated Limit</span>

              <h2>
                ₹{Number(budget.amount).toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="monthly-limit">
              ↗ Monthly Limit
            </div>

          </div>

        </div>
      ) : (
        <p className="budget-not-found">budget not found</p>
      )}
      <div className="purchase-section-header">

        <div>
          <h2>Purchases & Expenses</h2>
          <p>Track all transactions allocated against this budget.</p>
        </div>

        <button
          className="record-purchase-btn"
          onClick={() => setShowAddPurchase(!showAddPurchase)}
        >
          {showAddPurchase ? "✕ Cancel" : "+ Record Purchase"}
        </button>

      </div>

      {showAddPurchase && (
        <div className="purchase-card">

          <h2>Create Purchase</h2>

          <form onSubmit={createPurchase}>

            <div>
              <label>Purchase Title</label>

              <input
                type="text"
                name="title"
                value={purchaseForm.title}
                onChange={handleChange}
                placeholder="Enter purchase title"
              />
            </div>

            <div>
              <label>Amount</label>

              <input
                type="number"
                name="amount"
                value={purchaseForm.amount}
                onChange={handleChange}
                placeholder="Enter amount"
              />
            </div>

            <div>
              <label>Note</label>

              <textarea
                name="note"
                value={purchaseForm.note}
                onChange={handleChange}
                placeholder="Enter note"
              />
            </div>

            <div>
              <label>Date</label>

              <input
                type="date"
                name="date"
                value={purchaseForm.date}
                onChange={handleChange}
              />
            </div>

            <button type="submit">
              Create Purchase
            </button>

          </form>

        </div>
      )}

      <div className="purchases-section">
        <h2>Purchases</h2>
        <div className="purchase-summary">
          <p>Total Spent: {totalSpent}</p>
          <p>Total Purchases: {purchaseCount}</p>
          <p>Remaining Budget: {budget.amount - totalSpent}</p>
        </div>

        {purchaseLoading ? (
          <p>Loading purchases...</p>
        ) : purchases.length === 0 ? (
          <p>No purchases found.</p>
        ) : (
          purchases.map((purchase) => (
            <div className="purchase-item" key={purchase._id}>
              <h3>{purchase.title}</h3>

              <p>Amount: {purchase.amount}</p>

              <p>Note: {purchase.note || "No note"}</p>

              <p>Date: {purchase.date}</p>
              <button onClick={() => deletePurchase(purchase._id)}>
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>

  )

}

export default BudgetDetails