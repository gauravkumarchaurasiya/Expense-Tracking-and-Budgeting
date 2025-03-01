const API_URL = "http://127.0.0.1:8000";

document.addEventListener("DOMContentLoaded", () => {
    fetchBudget();
    fetchTransactions();
    fetchAIAdvice();
    fetchCharts();
});

function fetchBudget() {
    fetch(`${API_URL}/budget/`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("monthly-budget").textContent = `₹ ${data.monthly_budget || 0}`;
            fetchBalance();
        });
}

function updateBudget() {
    const newBudget = document.getElementById("new-budget").value;
    fetch(`${API_URL}/budget/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: parseFloat(newBudget) })
    }).then(() => fetchBudget());
}

function addExpense() {
    const title = document.getElementById("title").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const account = document.getElementById("account").value;
    const type = document.getElementById("type").value;
    
    fetch(`${API_URL}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, amount, account, type })
    }).then(() => {
        fetchTransactions();
        fetchBalance();
    });
}

function fetchTransactions() {
    fetch(`${API_URL}/expenses/`)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("transactions-list");
            tableBody.innerHTML = "";
            data.forEach(expense => {
                tableBody.innerHTML += `
                    <tr>
                        <td>${expense.title}</td>
                        <td>₹${expense.amount}</td>
                        <td>${expense.account}</td>
                        <td>${expense.type}</td>
                        <td>${expense.category || 'N/A'}</td>
                    </tr>`;
            });
        });
}

function fetchBalance() {
    fetch(`${API_URL}/expenses/monthly`)
        .then(response => response.json())
        .then(data => {
            const budget = parseFloat(document.getElementById("monthly-budget").textContent.replace("₹ ", "")) || 0;
            const balance = budget - (data.monthly_expense || 0);
            document.getElementById("balance-left").textContent = `₹ ${balance}`;
        });
}

function fetchAIAdvice() {
    fetch(`${API_URL}/budget/advice`)
        .then(response => response.json())
        .then(data => {
            document.getElementById("ai-advice").textContent = data.advice || "No advice available";
        });
}

function fetchCharts() {
    fetch(`${API_URL}/expenses/today`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById("today-expense-chart").getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: data.map(exp => exp.category),
                    datasets: [{
                        data: data.map(exp => exp.amount),
                        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"]
                    }]
                }
            });
        });

    fetch(`${API_URL}/expenses/monthly`)
        .then(response => response.json())
        .then(data => {
            const ctx = document.getElementById("monthly-expense-chart").getContext("2d");
            new Chart(ctx, {
                type: "line",
                data: {
                    labels: data.trend.map(entry => entry.date),
                    datasets: [{
                        label: "Monthly Expenses",
                        data: data.trend.map(entry => entry.amount),
                        borderColor: "#007bff",
                        fill: false
                    }]
                }
            });
        });
}
