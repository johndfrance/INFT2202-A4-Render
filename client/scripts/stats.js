/*
stats.js retrieves data about visitor frequency from a JSON file, and displays
a chart on the webpage which calls createChart()

March 28th 2024
 */

// Function to fetch JSON data


import {Chart} from "chart.js";

async function fetchData(url) {
        const response = await fetch(url);
        return response.json();
    }

// Function to create chart from fetched data
    async function createChart() {
        console.log("HERE");
        const data = await fetchData('./data/visitordata.json');

        const visitorData = {
            labels: data.map(entry => entry.month), // Extracting month names
            datasets: [{
                label: 'Visitor Frequency',
                data: data.map(entry => entry.count), // Extracting visitor counts
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        const chartConfig = {
            type: 'line',
            data: visitorData,
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month'
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Visitor Count'
                        }
                    }
                }
            }
        };

        const ctx = document.getElementById('visitorChart').getContext('2d');
        new Chart(ctx, chartConfig);
    }
