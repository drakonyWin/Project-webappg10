const chartData = {
    labels: ["Free","Pending","Reserved","Disabled"],
    data:[30,20,40,10],
    backgroundColors: ["#28a745", "#ffc107", "#007bff", "#dc3545"],
};

const myChart = document.querySelector(".my-chart");
const ul = document.querySelector(".programming-stats .details ul")

new Chart(myChart, {
    type: "doughnut",
    data: {
        labels: chartData.labels,
        datasets: [
            {
                labels: "Language Popularity",
                data: chartData.data,
                backgroundColor: chartData.backgroundColors,
            },
        ],
    },
    options: {
        borderWidth: 10,
        borderRadius: 2,
        hoverBorderWidth: 0,
        plugins: {
            legend:{
                display: false,
            }
        }
    }
});

const populateUl = () => {
    chartData.labels.forEach((l, i) => {
        let li = document.createElement("li");
        li.innerHTML = `${l}: <span class='percentage'>${chartData.data[i]}%</span>`
        ul.appendChild(li);
    })
}

populateUl();