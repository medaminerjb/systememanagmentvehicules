
const totalD = document.getElementById('totalD');
const totalV = document.getElementById('totalV');
const totalW = document.getElementById('totalW');
const totalpro = document.getElementById('totalpro');
const totalAd = document.getElementById('totalAd');
const salesTotalFiter = document.getElementById('smallSelect');
const filterDateSelector = document.getElementById('filterDateSelector');
const topexcursion = document.getElementById('Topexcursion');

const loadDatas = (data) => {

    totalD.innerHTML = data.user.totalDrivers;
    totalV.innerHTML = data.user.totalVehicles;
    totalW.innerHTML = data.user.totalWorkers;
    totalAd.innerHTML = data.user.totalAdmins;
}

document.addEventListener('DOMContentLoaded', async () => {
    const request = await fetch('/api/totals?type=all');
    const response = await request.json();
    if(response.message && response.message === 'Réorienter'){
        document.location.href = '/logout';
        return;
    }

    if(response.status){
        setTimeout(async() => {
            loadDatas(response.data);
            await loadFilteredSales();
        }, 1500);
    }
})



const closeDetails =document.getElementById('closeDetails');
const detailsBody =document.getElementById('ordres');
const detailsBody2 =document.getElementById('excursion');
const detailsBody3 =document.getElementById('tarifs');
const detailsBody4 =document.getElementById('vehicles');

const fetchvehicules = async () => {
  try {
    const response = await fetch('/api/vehicles?methode=tousVehicles');
    if (!response.ok) {
      throw new Error('Failed to fetch ordres');
    }
    const vehicles = await response.json();

    const typeCounts = {};
    let total = 0;
console.log(vehicles.data);
    

    const vehicless =vehicles.data;
    let currentIndex = 0; 
    totalpro.innerHTML='tous va bien !';
    function showNextVehicle() {
      if(vehicless[currentIndex].etat =='maintenance')
{   totalpro.innerHTML = '<div style="color:red;">' +vehicless[currentIndex].regisNumber+'</div>';
  totalpro.innerHTML +='</br>'+'<div style="color:red;">' +vehicless[currentIndex].etat+'</div>';
  totalpro.innerHTML +='</br>'+ vehicless[currentIndex].obeservation;
      currentIndex = (currentIndex + 1) % vehicless.length;} // Move to the next vehicle, looping back to the start if needed
  }
  
  // Show the first vehicle immediately
  showNextVehicle();
  
  // Update the vehicle every second
  setInterval(showNextVehicle, 2000);

  vehicles.data.forEach(vehicle => {
    total++;
    const { vtype } = vehicle;
    if (!typeCounts[vtype]) {
      typeCounts[vtype] = 1;
    } else {
      typeCounts[vtype]++;
    }
  });
    totalV.innerHTML = 'Vehicule par type:<br>';
    for (const vtype in typeCounts) {
      totalV.innerHTML += `${vtype}: ${typeCounts[vtype]}<br>`;
    }

    totalV.innerHTML += `Toutes les vehicles: ${total}<br><br>`;

} catch (error) {
  console.error('Error fetching ordres:', error);
}





}

const fetchemployes = async () => {
  try {
    const response = await fetch('/api/workers?methode=tousEmployes');
    if (!response.ok) {
      throw new Error('Failed to fetch ordres');
    }
    const employes = await response.json();
console.log(employes.data);
    const typeCounts = {};
    let total = 0;

    employes.data.forEach(employe => {
      total++;
      const { userRole } = employe;
      if (!typeCounts[userRole]) {
        typeCounts[userRole] = 1;
      } else {
        typeCounts[userRole]++;
      }
    });

   

  
    totalW.innerHTML = 'Employes <br>';
    for (const vtype in typeCounts) {
      totalW.innerHTML += `${vtype}: ${typeCounts[vtype]}<br>`;
    }

    totalW.innerHTML += `Toutes les employes: ${total}<br><br>`;

} catch (error) {
  console.error('Error fetching ordres:', error);
}





}

const fetchcarburants = async () => {
  try {
    const response = await fetch('/api/statistiques?methode=getcarbrantstatall');
    if (!response.ok) {
      throw new Error('Failed to fetch carburants');
    }
    const vehicles = await response.json();
    console.log(vehicles.data);

    const carburantTotal = {};
    const kmTotal = {};

    vehicles.data.forEach(vehicle => {
      const { regisNumber, kmtotal, gasoil, excursion } = vehicle;
      const month = excursion.substring(0, 7);

      if (!carburantTotal[regisNumber]) {
        carburantTotal[regisNumber] = {};
        kmTotal[regisNumber] = {};
      }
      if (!carburantTotal[regisNumber][month]) {
        carburantTotal[regisNumber][month] = 0;
        kmTotal[regisNumber][month] = 0;
      }
      carburantTotal[regisNumber][month] += gasoil;
      kmTotal[regisNumber][month] += kmtotal;
    });

    const ctx = document.getElementById('vehicles').getContext('2d');

    let labels = [];
    let datasets = [];

    const updateChart = (months) => {
      labels = months;

      datasets = Object.keys(carburantTotal).map(regisNumber => {
        const carburantData = labels.map(month => carburantTotal[regisNumber][month] || 0);
        const kmData = labels.map(month => kmTotal[regisNumber][month] || 0);

        return [
          {
            label: `Carburant Total (${regisNumber})`,
            data: carburantData,
            backgroundColor: 'rgba(90, 128, 128)',
            borderColor: 'rgba(90, 128, 128)',
            borderWidth: 1
          },
          {
            label: `KM Total (${regisNumber})`,
            data: kmData,
            backgroundColor: 'rgba(50, 0, 100)',
            borderColor: 'rgba(50, 0, 100)',
            borderWidth: 1
          }
        ];
      }).flat();

      if (window.mileageChart) {
        // Update existing chart
        window.mileageChart.data.labels = labels;
        window.mileageChart.data.datasets = datasets;
        window.mileageChart.update();
      } else {
        // Create new chart
        window.mileageChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: datasets
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }
    };

    updateChart(Object.keys(carburantTotal[Object.keys(carburantTotal)[0]])); // Initial chart with first vehicle's data

    document.getElementById('filterByLastMonthButton').addEventListener('click', () => {
      const currentDate = new Date();
      const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
      const lastMonthKey = `${lastMonth.getFullYear()}-${(lastMonth.getMonth() + 1).toString().padStart(2, '0')}`;
      updateChart([lastMonthKey]);
    });

    document.getElementById('filterBySelectedMonthButton').addEventListener('click', () => {
      const selectedMonth = document.getElementById('monthSelector').value;
      updateChart([selectedMonth]);
    });

  } catch (error) {
    console.error('Error fetching carburants:', error);
  }
};




const fetchordres = async () => {
    try {
      const response = await fetch('/api/statistiques?method=allordre');
      if (!response.ok) {
        throw new Error('Failed to fetch ordres');
      }
      const ordres = await response.json();





  const ordesstat= ordres.data ;


  const countexcursion = {};
    let total = 0;

    ordesstat.forEach(ordre => {
      total++;
      const { nom } = ordre;
      if (!countexcursion[nom]) {
        countexcursion[nom] = 1;
      } else {
        countexcursion[nom]++;
      }
    });
    
    // Calculate the percentage for each excursion and store in a new array
    const excursionPercentages = Object.keys(countexcursion).map(nom => {
      return {
        nom,
        count: countexcursion[nom],
        percentage: (countexcursion[nom] / total) * 100
      };
    });
    
    // Sort the excursions by count in descending order
    excursionPercentages.sort((a, b) => b.count - a.count);
    
    // Get the top 3 excursions
    const top3Excursions = excursionPercentages.slice(0, 3);
    
    topexcursion.innerHTML = '';

    // Iterate over the top 3 excursions and add them to the HTML element
    top3Excursions.forEach(excursion => {
      const percentage = excursion.percentage.toFixed(2);
      const html = `
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span>${excursion.nom}</span>
          <span class="badge bg-primary">${percentage}%</span>
        </div>`;
      topexcursion.innerHTML += html;
    });

    





     const monthlyOrderTotals = {};
     ordesstat.forEach(order => {
        const month = order.excursion.substring(0, 7); // Extract year-month part of the date
        if (!monthlyOrderTotals[month]) {
          monthlyOrderTotals[month] = 0;
        }
        monthlyOrderTotals[month]++;
      });
     
      // Prepare the data for Chart.js
      const months = Object.keys(monthlyOrderTotals);
      const orderCounts = Object.values(monthlyOrderTotals);
  
    const ctx = detailsBody.getContext('2d');

  
        // Create new chart
        const myChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: months,
              datasets: [{
                label: 'Totales ordres par mois ',
                data: orderCounts,
                backgroundColor: 'rgba(0, 128, 0)',
         
                borderColor: 'rgba(0, 128, 0)',
                borderWidth: 1
             
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
       
    } catch (error) {
      console.error('Error fetching ordres:', error);
    }
  }


  const fetchtarifs = async () => {
    try {
 


  const response1 = await fetch('/api/statistiques?method=alltickets');
  if (!response1.ok) {
    throw new Error('Failed to fetch ordres');
  }
  const ordres1 = await response1.json();

const ordesstat1= ordres1.data ;

  
     const monthlyOrderTotals = {};
     ordesstat1.forEach(order => {
        const month = order.excursion.substring(0, 7); // Extract year-month part of the date
        if (!monthlyOrderTotals[month]) {
          monthlyOrderTotals[month] = 0;
        }

        monthlyOrderTotals[month]+=((order.adulter*order.tarifstadu)+(order.enfantr*order.tarifstenf));
      });


      const months = Object.keys(monthlyOrderTotals);
      const orderCounts = Object.values(monthlyOrderTotals);
   /// getting each month waht rrevune !! 
      // Prepare the data for Chart.js

  
    
      
    
    const ctx = detailsBody3.getContext('2d');

  
        // Create new chart
        const newchart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: months,
              datasets: [{
                label: 'Totales revnue en dinar par mois ',
                data: orderCounts,
                backgroundColor: 'rgba(255, 150, 0)',
         
                borderColor: 'rgba(255, 150, 0)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
 // Store the chart object in a global variable
        return newchart; // Return the new chart object        }

    } catch (error) {
      console.error('Error fetching ordres:', error);
    }
  }
const fetchexcursion = async () => {
    try {
      const response = await fetch('/api/carburants?method=allcarburants');
      if (!response.ok) {
        throw new Error('Failed to fetch ordres');
      }
      const ordres = await response.json();

  const ordesstat= ordres.data ;

  
     const monthlyOrderTotals = {};
     ordesstat.forEach(order => {
        const month = order.date.substring(0, 7); // Extract year-month part of the date
        if (!monthlyOrderTotals[month]) {
          monthlyOrderTotals[month] = 0;
        }

        monthlyOrderTotals[month]+=order.total;
      });
   
      // Prepare the data for Chart.js
      const months = Object.keys(monthlyOrderTotals);
      const orderCounts = Object.values(monthlyOrderTotals);
    
    
      
    
    const ctx = detailsBody2.getContext('2d');

  
        // Create new chart
        const newchart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: months,
              datasets: [{
                label: 'Totales Déspenses en dinar par mois ',
                data: orderCounts,
                backgroundColor: 'rgba(255, 0, 0)',
         
                borderColor: 'rgba(255, 0, 0)',
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
 // Store the chart object in a global variable
        return newchart; // Return the new chart object        }



    } catch (error) {
      console.error('Error fetching ordres:', error);
    }
  }
  

  document.addEventListener('DOMContentLoaded', async() => {
    await fetchordres();
    await fetchexcursion();
    await fetchtarifs();
    await fetchvehicules();
    await fetchemployes();
    await fetchcarburants();
  
})

/*
salesTotalFiter.addEventListener('change',async  (e) => {
    e.preventDefault();
    totalS.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i>`
    setTimeout(async() => {
        await loadFilteredSales();
    }, 1500);
    
});

filterDateSelector.addEventListener('change',async  (e) => {
    e.preventDefault();
    totalST.innerHTML = `<i class='bx bx-loader-alt bx-spin'></i>`
    setTimeout(async() => {
        await loadDailyFilteredSales();
    }, 1500);
    
});

const loadFilteredSales = async () => {
    const request = await fetch('/api/totals?type=sales&&filter='+salesTotalFiter.value);
    const response = await request.json();
    if(response.message && response.message === 'Réorienter
'){
        document.location.href = '/logout';
        return;
    }

    if(response.status){
        totalS.innerHTML = `GH₵ ${response.data.totalSalesFilter}`;
    }
}

const loadDailyFilteredSales = async () => {
    const request = await fetch('/api/totals?type=sales&&filterDate='+filterDateSelector.value);
    const response = await request.json();
    if(response.message && response.message === 'Réorienter
'){
        document.location.href = '/logout';
        return;
    }

    if(response.status){
        totalST.innerHTML = `GH₵ ${response.data.totalDailySalesFilter}`;
    }
}*/