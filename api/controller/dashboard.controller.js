import { Budget } from "../modal/budget.schema.js";
import { Purchase } from "../modal/purchase.schema.js";

export const getDashboardOverview = async (req, res, next) => {
    try {
        // Get all budgets of logged-in user
        const budgets = await Budget.find({
            user: req.user._id,
        }).populate("category");

        // Get all purchases of logged-in user
        const purchases = await Purchase.find({
            user: req.user._id,
        })
            .populate("category")
            .sort({ createdAt: -1 });
        // Total budget
        const totalBudget = budgets.reduce(
            (total, budget) => total + Number(budget.amount),
            0
        );

        // Total spent
        const totalSpent = purchases.reduce(
            (total, purchase) => total + Number(purchase.amount),
            0
        );

        // Remaining
        const remaining = totalBudget - totalSpent;

        // Active budgets
        const activeBudgets = budgets.length;

        // Spending percentage
        const spentPercentage =
            totalBudget > 0
                ? Math.round((totalSpent / totalBudget) * 100)
                : 0;

        // -----------------------------
        // CATEGORY-WISE SPENDING
        // -----------------------------

        const categorySpending = {};

        purchases.forEach((purchase) => {
            const categoryName =
                purchase.category?.category?.trim() || "Other";

            if (!categorySpending[categoryName]) {
                categorySpending[categoryName] = 0;
            }

            categorySpending[categoryName] += Number(purchase.amount);
        });

        const categoryData = Object.entries(categorySpending).map(
            ([category, amount]) => ({
                category,
                amount,
            })
        );


        const monthlySpending = {};

        purchases.forEach((purchase) => {
            const date = new Date(purchase.date);

            const monthName = date.toLocaleString("en-IN", {
                month: "short",
            });

            if (!monthlySpending[monthName]) {
                monthlySpending[monthName] = 0;
            }

            monthlySpending[monthName] += Number(purchase.amount);
        });

        const monthlyData = Object.entries(monthlySpending).map(
            ([month, amount]) => ({
                month,
                amount,
            })
        );

        return res.status(200).json({
            totalBudget,
            totalSpent,
            remaining,
            activeBudgets,
            spentPercentage,
            categoryData,
            monthlyData,
            budgets,
            purchases,
        });
    } catch (err) {
        return res.status(500).json({
            message: err.message,
        });
    }
};