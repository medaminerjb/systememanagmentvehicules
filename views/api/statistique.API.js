
if(new URL(document.location.href).pathname === '/statistiques/vehicles'){
    const vehicleForm = document.forms.vehicleForm;
    const closeDetails2 =document.getElementById('closeDetails2');
    const closeDetail =document.getElementById('closeDetails');
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }


  
    const tBody = document.querySelector('.table-border-bottom-0');
    const pageNumbers = document.querySelector('.pagination');
  
    const detailsBody =document.getElementById('detailsBody');
    

    const loadingDiv = `
        <div class="text-center fs-3">
            <i class='bx bx-loader-alt bx-spin fs-1'></i>
        </div>
    `;
  
    function truncate(str, n){
        return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
    };

    closeDetail.addEventListener('click', () => {
       
                detailsBody.innerHTML = '';
    })
    
    
    const detailDivShow3 = async (data) => {
        try {
            // Process the data and aggregate it by month
            const aggregatedData = {};
            data.forEach(entry => {
                const month = entry.date.substring(0, 7); // Extract year-month part of the date
                if (!aggregatedData[month]) {
                    aggregatedData[month] = 0;
                }
                aggregatedData[month] += entry.total;
            });
          
        
            // Convert aggregated data to arrays for Chart.js
            const dates = Object.keys(aggregatedData);
            const differences = Object.values(aggregatedData);
    
            // Create or update the Chart.js chart
            const ctx2 = detailsBody.getContext('2d');
           
                // Create new chart
                if (window.mileageChart) {
                    // Update existing chart
                    window.mileageChart.type='bar';
                    window.mileageChart.data.datasets[0].label = 'depenses en dinar par mois';

                    window.mileageChart.data.labels = dates;
                    window.mileageChart.data.datasets[0].data = differences;
                    window.mileageChart.update();
                    return window.mileageChart; // Return the updated chart object
                }
                else{
                const newChart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'kilometergae de mois ',
                            data: differences,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            borderColor: 'rgba(0, 99, 132, 0)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }
                    });
                    window.mileageChart = newChart; 
                return newChart; // Return the new chart object
                } 
        } catch (error) {
            console.error('Error Mis à jour chart:', error);
        }
    };
    
    const detailDivShow2 = async (data) => {
        try {
            // Process the data and aggregate it by month
            const aggregatedData = {};
            data.forEach(entry => {
                const month = entry.date.substring(0, 7); // Extract year-month part of the date
                if (!aggregatedData[month]) {
                    aggregatedData[month] = 0;
                }
                aggregatedData[month] += entry.diff;
            });
          
        
            // Convert aggregated data to arrays for Chart.js
            const dates = Object.keys(aggregatedData);
            const differences = Object.values(aggregatedData);
    
            // Create or update the Chart.js chart
            const ctx2 = detailsBody.getContext('2d');
           
                // Create new chart
                if (window.mileageChart) {
                    // Update existing chart
                    window.mileageChart.type='bar';
                    window.mileageChart.data.datasets[0].label = 'kilometergae de mois';

                    window.mileageChart.data.labels = dates;
                    window.mileageChart.data.datasets[0].data = differences;
                    window.mileageChart.update();
                    return window.mileageChart; // Return the updated chart object
                }
                else{
                const newChart = new Chart(ctx2, {
                    type: 'bar',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'kilometergae de mois ',
                            data: differences,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            borderColor: 'rgba(0, 99, 132, 0)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }
                    });
                    window.mileageChart = newChart; 
                return newChart; // Return the new chart object
                } 
        } catch (error) {
            console.error('Error Mis à jour chart:', error);
        }
    };




    const detailDivShow = async (data) => {
        try {
            const groupedData = data.reduce((acc, item) => {
                const month = item.excursion.substring(0, 7); // Extract year-month part of the date
                if (!acc[month]) {
                  acc[month] = [];
                }
                acc[month].push(item);
                return acc;
              }, {});
              
              // Calculate the gasoil consumption per 100 kilometers for each month
              const monthlyAverages = {};
              for (const month in groupedData) {
                const monthData = groupedData[month];
                const totalGasoil = monthData.reduce((sum, item) => sum + item.gasoil, 0);
                const totalDiff = monthData.reduce((sum, item) => sum + item.kmtotal, 0);
                const averageGasoilPer100Km = (totalGasoil / totalDiff) * 100;
                monthlyAverages[month] = averageGasoilPer100Km;
              }
              const dates = Object.keys(monthlyAverages);
              const values = Object.values(monthlyAverages);
              
          
            // Create or update the Chart.js chart
            const ctx = detailsBody.getContext('2d');
            if (window.mileageChart) {
                // Update existing chart
                window.mileageChart.type='bar';
                window.mileageChart.data.datasets[0].label = 'Carburant Consomation Per 1l/100km ';
                window.mileageChart.data.labels = dates;
                window.mileageChart.data.datasets[0].data = values;
                window.mileageChart.update();
                return window.mileageChart; // Return the updated chart object
            }else{
                // Create new chart
                const MyChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: dates,
                        datasets: [{
                            label: 'Carburant Consomation Per 1l/100km ',
                            data: values,
                            backgroundColor: 'rgba(54, 162, 235, 1)',
                            borderColor: 'rgba(0, 99, 132, 0)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                          y: {
                            beginAtZero: false
                          }
                        }
                      }
                    });
                    window.mileageChart = MyChart;    // Store the chart object in a global variable
                return MyChart; // Return the new chart object
            }
        }
        catch (error) {
            console.error('Error Mis à jour chart:', error);
        }
    };
    const tableTr = ({regisNumber, model, vehicleUuid}, role) => {
        if(role === 'superAdmin' || role === 'admin'||role==='Agent'){
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
              <td><button id="vehiclestatistic" data-tid=${vehicleUuid} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show">kilometerages</i></button></td>
            <td> <button id="vehiclegasoil" data-tid=${vehicleUuid} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show">Gasoil</i></button></td>
            <td> <button id="vehicledepenses" data-tid=${vehicleUuid} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show">depenses</i></button></td>
              
            </tr>
        `;
        }
        
    }

    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);

    const APIGetData = async (page,search) => {
        tBody.innerHTML = '';
        const request = await fetch('/api/vehicles?methode=vehicles&&search='+search+'&&page='+page);
        const response = await request.json();


        if(response.message && response.message == "Réoriente"){
            document.location.href = "/logout"
        }else if(response.status){

            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle, response.role);
            });

            if(page === 1){
                pageNumbers.innerHTML = `
                <li class="page-item prev" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
                `;
        
            }else{
                pageNumbers.innerHTML = ` 
                <li class="page-item prev">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
            `;
            }
            for(let i = 1; i <= response.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > response.totalPages){
                pageNumbers.innerHTML += `
                <li class="page-item next" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>`;
            }else{
                pageNumbers.innerHTML += ` 
                <li class="page-item next">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>
            `;
            }
        }
    }

    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }
    
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        await APIGetData(page,search);
   
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        if(document.querySelectorAll('#vehicleDeleteBtn')){
            vehicleDeleteBtns = document.querySelectorAll('#vehicleDeleteBtn');
            vehicleDeleteBtns.forEach((vehicleDeleteBtn) => {
                vehicleDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const vehicleId = vehicleDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }

        if(pageNums){
            pageNums.forEach((pageNum) => {
                pageNum.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')),search);
                    setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
                }, false)
            });

        }
    
        if(document.querySelector('.prev')){
            document.querySelector('.prev').addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                if(document.querySelector('.prev').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.prev').classList.add('disabled');
                await APIGetData(page - 1,search)
                setQueryStringParameter('page', page - 1)
                document.querySelector('.prev').classList.remove('disabled');
            });
        }
    
        if(document.querySelector('.next')){
            document.querySelector('.next').addEventListener('click',async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                if(document.querySelector('.next').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.next').classList.add('disabled');
                await APIGetData(page + 1,search)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
    });
   
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        searchDriver.value = search;
        await APIGetData(page,search);      
        if(document.querySelectorAll('#vehiclestatistics')){
            vehiclestatistics = document.querySelectorAll('#vehiclestatistic');
            vehiclestatistics.forEach((vehiclestatistic) => {
                vehiclestatistic.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  //  detailsBody.innerHTML = loadingDiv;
                    const vehicleId = vehiclestatistic.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/statistiques', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if (response.status) {
                 
                        const chart = await detailDivShow2(response.data);
                       
                        
                        // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                        const detailsBody = document.getElementById('detailsBody');
                        
                        // Log chart.canvas and detailsBody to check their values
                       
                        // Clear the contents of detailsBody
                        detailsBody.innerHTML = '';
                        
                        // Append the Chart.js canvas to detailsBody
                       
                       
                      }
                });
            });
        }
        if(document.querySelectorAll('#vehiclegasoil')){
            vehiclegasoils = document.querySelectorAll('#vehiclegasoil');
            vehiclegasoils.forEach((vehiclegasoil) => {
                vehiclegasoil.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                  //  detailsBody.innerHTML = loadingDiv;
                    const vehicleIdg = vehiclegasoil.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleIdg', vehicleIdg);
                    formData.append('method', 'GET');
                
                    const response = await APIGet('/api/statistiques', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if (response.status) {

                 
                        const chart = await detailDivShow(response.data);
                 
                      
                        // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                        const detailsBody = document.getElementById('detailsBody');
                        
                        // Log chart.canvas and detailsBody to check their values
                      
                        // Clear the contents of detailsBody
                        detailsBody.innerHTML = '';
                        
                        // Append the Chart.js canvas to detailsBody
            
                       
                      }
                });
            });
        }
        if(document.querySelectorAll('#vehicledepenses')){
            vehicledepensess = document.querySelectorAll('#vehicledepenses');
            vehicledepensess.forEach((vehicledepenses) => {
                vehicledepenses.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const vehicleIdd = vehicledepenses.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleIdd', vehicleIdd);
                    formData.append('method', 'GET');
                
                    const response = await APIGet('/api/statistiques', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if (response.status) {

                 
                        const chart = await detailDivShow3(response.data);
                 
                      
                        // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                        const detailsBody = document.getElementById('detailsBody');
                        
                        // Log chart.canvas and detailsBody to check their values
                      
                        // Clear the contents of detailsBody
                        detailsBody.innerHTML = '';
                        
                        // Append the Chart.js canvas to detailsBody
            
                       
                      }
                });
            });
        }
    });


    searchDriver.addEventListener('input', async function(e) {
        if(e.target.value && e.target.value.trim() !== ''){
            searchDriverBtn.removeAttribute('disabled');
            return;
        }
        searchDriverBtn.setAttribute('disabled', true);
        const searchValue = e.target.value ? e.target.value : '';
        const params = new URLSearchParams(window.location.search);
        const page = 1;
        params.delete('search');
        setQueryStringParameter('page', 1);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
        APIGetData(page, searchValue);
        
    });

    searchDriverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = searchDriver.value ? searchDriver.value : '';
        const page = 1;
        setQueryStringParameter('search', searchValue);
        setQueryStringParameter('page', 1);
        APIGetData(page, searchValue);
    });
} else if(new URL(document.location.href).pathname === '/statistiques/ordres'){
    

    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('ordres');
    const detailsBody2 =document.getElementById('excursion');
    const detailsBody3 =document.getElementById('mission');
 
 
    const fetchordres = async () => {
        try {
          const response = await fetch('/api/statistiques?method=allordre');
          if (!response.ok) {
            throw new Error('Failed to fetch ordres');
          }
          const ordres = await response.json();

      const ordesstat= ordres.data ;
  
      
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

        if (window.mileageChart) {
            // Update existing chart
            window.mileageChart.data.labels = dates;
            window.mileageChart.data.datasets[0].data = values;
            window.mileageChart.update();
            return window.mileageChart; // Return the updated chart object
        } else {
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
            window.mileageChart = myChart; // Store the chart object in a global variable
            return myChart; // Return the new chart object
        }



        } catch (error) {
          console.error('Error fetching ordres:', error);
        }
      }


const fetchexcursion = async () => {
        try {
          const response = await fetch('/api/statistiques?method=allordreexcursion');
          if (!response.ok) {
            throw new Error('Failed to fetch ordres');
          }
          const ordres = await response.json();

      const ordesstat= ordres.data ;
   
      
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
        
        
          
        
        const ctx = detailsBody2.getContext('2d');

      
            // Create new chart
            const newchart = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: months,
                  datasets: [{
                    label: 'Totales ordres par mois ',
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
      const fetchmission = async () => {
        try {
          const response = await fetch('/api/statistiques?method=allordremission');
          if (!response.ok) {
            throw new Error('Failed to fetch ordres');
          }
          const ordres = await response.json();

      const ordesstat= ordres.data ;
   
      
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
        
        
          
        
        const ctx = detailsBody3.getContext('2d');

      
            // Create new chart
            const newchart = new Chart(ctx, {
                type: 'bar',
                data: {
                  labels: months,
                  datasets: [{
                    label: 'Totales ordres par mois ',
                    data: orderCounts,
                    backgroundColor: 'rgba(0, 0, 255)',
             
                    borderColor: 'rgba(0, 0, 255)',
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
        await fetchmission();
      
    })


}
else if(new URL(document.location.href).pathname === '/statistiques/chauffeurs'){

  const tBody = document.querySelector('.table-border-bottom-0');
  const pageNumbers = document.querySelector('.pagination');

  const detailsBody =document.getElementById('detailsBody');
  const detailsBody2 =document.getElementById('detailsBody2');
  const searchDriver = document.querySelector('[name="searchDriver"]');
  const searchDriverBtn =document.getElementById('searchDriverBtn');
  const searchDriverForm =document.forms.searchDriverForm;
  const loadingDiv = `
      <div class="text-center fs-3">
          <i class='bx bx-loader-alt bx-spin fs-1'></i>
      </div>
  `;
  const loadingDiv2 = `
  <div class="text-center fs-3">
      <i class='bx bx-loader-alt bx-spin fs-1'></i>
  </div>
`;
  function truncate(str, n){
      return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
  };

  closeDetails.addEventListener('click', () => {
      detailsBody.innerHTML = loadingDiv;
  })
  
  const detailDivShow2 = async (data) => {
      try {
          // Process the data and aggregate it by month
    
       const ordesstat = data;
          const monthlyOrderTotals = {};
          ordesstat.forEach(order => {
             const month = order.excursion.substring(0, 7); // Extract year-month part of the date
             if (!monthlyOrderTotals[month]) {
               monthlyOrderTotals[month] = 0;
             }
             monthlyOrderTotals[month]++;
           });

          // Convert aggregated data to arrays for Chart.js
          const dates = Object.keys(monthlyOrderTotals);
          const differences = Object.values(monthlyOrderTotals);

          // Create or update the Chart.js chart
          const ctx = detailsBody.getContext('2d');
          if (window.mileageChart) {
              // Update existing chart
              window.mileageChart.data.labels = dates;
              window.mileageChart.data.datasets[0].data = differences;
              window.mileageChart.update();
              return window.mileageChart; // Return the updated chart object
          } else {
              // Create new chart
              const newChart = new Chart(ctx, {
                  type: 'bar',
                  data: {
                      labels: dates,
                      datasets: [{
                          label: 'nombre de excursion par mois ',
                          data: differences,
                          backgroundColor: 'rgba(0, 162, 235, 1)',
                          borderColor: 'rgba(0, 99, 132, 0)',
                          borderWidth: 1
                      }]
                  },
                  options: {
                      responsive: true,
                      maintainAspectRatio: false,
                      title: {
                          display: true,
                          text: 'Mileage Difference Chart',
                          fontSize: 16,
                          fontColor: '#333'
                      },
                      legend: {
                          display: true,
                          position: 'bottom',
                          labels: {
                              fontColor: '#666'
                          }
                      },
                      scales: {
                          x: {
                              display: true,
                              title: {
                                  display: true,
                                  text: 'Date'
                              }
                          },
                          y: {
                              display: true,
                              title: {
                                  display: true,
                                  text: 'Activités'
                              }
                          }
                      },
                      tooltips: {
                          enabled: true,
                          mode: 'index',
                          intersect: false
                      },
                      animation: {
                          duration: 1000,
                          easing: 'easeInOutQuart'
                      } }
              });
              window.mileageChart = newChart; // Store the chart object in a global variable
              return newChart; // Return the new chart object
          }
      } catch (error) {
          console.error('Error Mis à jour chart:', error);
      }
  };
  const detailDivShow = async (data) => {
      try {
          const groupedData = data.reduce((acc, item) => {
              const month = item.date.substring(0, 7); // Extract year-month part of the date
              if (!acc[month]) {
                acc[month] = [];
              }
              acc[month].push(item);
              return acc;
            }, {});
            
            // Calculate the gasoil consumption per 100 kilometers for each month
            const monthlyAverages = {};
            for (const month in groupedData) {
              const monthData = groupedData[month];
              const totalGasoil = monthData.reduce((sum, item) => sum + item.gasoil, 0);
              const totalDiff = monthData.reduce((sum, item) => sum + item.diff, 0);
              const averageGasoilPer100Km = (totalGasoil / totalDiff) * 100;
              monthlyAverages[month] = averageGasoilPer100Km;
            }
            const dates = Object.keys(monthlyAverages);
            const values = Object.values(monthlyAverages);
     
        
          // Create or update the Chart.js chart
          const ctx = detailsBody.getContext('2d');
          if (window.mileageChart) {
              // Update existing chart
              window.mileageChart.data.labels = dates;
              window.mileageChart.data.datasets[0].data = values;
              window.mileageChart.update();
              return window.mileageChart; // Return the updated chart object
          } else {
              // Create new chart
              const myChart = new Chart(ctx, {
                  type: 'line',
                  data: {
                    labels: dates,
                    datasets: [{
                      label: 'Average Gasoil Consumption per 100 Kilometers',
                      data: values,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                      fill: false
                    }]
                  },
                  options: {
                    scales: {
                      y: {
                        beginAtZero: false
                      }
                    }
                  }
                });
              window.mileageChart = newChart; // Store the chart object in a global variable
              return newChart; // Return the new chart object
          }
         
      } catch (error) {
          console.error('Error Mis à jour chart:', error);
      }
  };
  const tableTr = (driver) => {
     
          return`
          <tr>
          <td> <strong>${driver.driverFullName}</strong></td>
          <td>${driver.email}</td>
        
            <td><button id="chauffeurstat" data-tid=${driver.driverUuid} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show">Activité</i></button></td>
            
          </tr>
      `;
    
      
  }

  const pagination  = (i, currentPage) => (`
      <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
          <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
      </li>
  `);

  const APIGetData = async (page,search) => {
      tBody.innerHTML = '';
      const request = await fetch('/api/drivers?search='+search+'&&page='+page);
      const response = await request.json();
      if(response.message && response.message == "Réorienter"){
          document.location.href = "/logout"
      }else if(response.status){
           
          response.data.map((driver) => {
              tBody.innerHTML += tableTr(driver);
          });

          if(page === 1){
              pageNumbers.innerHTML = `
              <li class="page-item prev" style="display:none">
                  <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
              </li>
              `;
      
          }else{
              pageNumbers.innerHTML = ` 
              <li class="page-item prev">
                  <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
              </li>
          `;
          }
          for(let i = 1; i <= response.totalPages; i++){
              pageNumbers.innerHTML += pagination(i, page);
          }
          page++;
          if(page > response.totalPages){
              pageNumbers.innerHTML += `
              <li class="page-item next" style="display:none">
                  <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
              </li>`;
          }else{
              pageNumbers.innerHTML += ` 
              <li class="page-item next">
                  <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
              </li>
          `;
          }
      }
  }

  const APIGet = async (url, formData) => {
      const request = await fetch(url, {
          method: 'POST',
          body: formData
      });
      const response = await request.json();
      return response;
  }
  
  
  function setQueryStringParameter(name, value) {
      const params = new URLSearchParams(window.location.search);
      params.set(name, value);
      window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
  }

  window.addEventListener('popstate', async function () {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';

      await APIGetData(page,search);
  });
  

  document.addEventListener('mouseover', () => {
      const pageNums = document.querySelectorAll('#pageNums');
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';

      if(document.querySelectorAll('#vehicleDeleteBtn')){
          vehicleDeleteBtns = document.querySelectorAll('#vehicleDeleteBtn');
          vehicleDeleteBtns.forEach((vehicleDeleteBtn) => {
              vehicleDeleteBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  const vehicleId = vehicleDeleteBtn.getAttribute('data-tid');
                  const formData = new FormData();
                  formData.append('vehicleId', vehicleId);
                  formData.append('method', 'DELETE');
                  APIDeleteData(formData);
                  /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
              });
          });
      }

      if(pageNums){
          pageNums.forEach((pageNum) => {
              pageNum.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  await APIGetData(parseInt(pageNum.getAttribute('page-number')),search);
                  setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
              }, false)
          });

      }
  
      if(document.querySelector('.prev')){
          document.querySelector('.prev').addEventListener('click', async (e) => {
              e.stopPropagation();
              e.preventDefault();
              e.stopImmediatePropagation();
              if(document.querySelector('.prev').classList.contains('disabled')){
                  return;
              }
              document.querySelector('.prev').classList.add('disabled');
              await APIGetData(page - 1,search)
              setQueryStringParameter('page', page - 1)
              document.querySelector('.prev').classList.remove('disabled');
          });
      }
  
      if(document.querySelector('.next')){
          document.querySelector('.next').addEventListener('click',async (e) => {
              e.stopPropagation();
              e.preventDefault();
              e.stopImmediatePropagation();
              if(document.querySelector('.next').classList.contains('disabled')){
                  return;
              }
              document.querySelector('.next').classList.add('disabled');
              await APIGetData(page + 1,search)
              setQueryStringParameter('page', page+1)
              document.querySelector('.next').classList.remove('disabled');
          });
      }
  });
 
  document.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';
      searchDriver.value = search;
      await APIGetData(page,search);      
      if(document.querySelectorAll('#chauffeurstat')){
        chauffeurstats = document.querySelectorAll('#chauffeurstat');
        chauffeurstats.forEach((chauffeurstat) => {
          chauffeurstat.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                //  detailsBody.innerHTML = loadingDiv;
                  const chauffeurId = chauffeurstat.getAttribute('data-tid');
                  const formData = new FormData();
                  formData.append('chauffeurId', chauffeurId);
                  formData.append('method', 'GET');
                  const response = await APIGet('/api/statistiques', formData);
                  if(response.message && response.message == "Réorienter"){
                      document.location.href = "/logout"
                      return;
                  }

                  if (response.status) {
                      const chart = await detailDivShow2(response.data);
      
                      // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                      const detailsBody = document.getElementById('detailsBody');
           
                      // Log chart.canvas and detailsBody to check their values
                    
                      // Clear the contents of detailsBody
                      detailsBody.innerHTML = '';
                      
                      // Append the Chart.js canvas to detailsBody
                     
                     
                    }
              });
          });
      }
      if(document.querySelectorAll('#vehiclegasoil')){
          vehiclegasoils = document.querySelectorAll('#vehiclegasoil');
          vehiclegasoils.forEach((vehiclegasoil) => {
              vehiclegasoil.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                //  detailsBody.innerHTML = loadingDiv;
                  const vehicleIdg = vehiclegasoil.getAttribute('data-tid');
                  const formData = new FormData();
                  formData.append('vehicleIdg', vehicleIdg);
                  formData.append('method', 'GET');
                  const response = await APIGet('/api/statistiques', formData);
                  if(response.message && response.message == "Réorienter"){
                      document.location.href = "/logout"
                      return;
                  }

                  if (response.status) {
                      const chart = await detailDivShow(response.data);
      
                      // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                      const detailsBody = document.getElementById('detailsBody');
                      
                      // Log chart.canvas and detailsBody to check their values
                    
                      // Clear the contents of detailsBody
                      detailsBody.innerHTML = '';
                      
                      // Append the Chart.js canvas to detailsBody
          
                     
                    }
              });
          });
      }
  });
     
  searchDriver.addEventListener('input', async function(e) {
    if(e.target.value && e.target.value.trim() !== ''){
        searchDriverBtn.removeAttribute('disabled');
        return;
    }
    searchDriverBtn.setAttribute('disabled', true);
    const searchValue = e.target.value ? e.target.value : '';
    const params = new URLSearchParams(window.location.search);
    const page = 1;
    params.delete('search');
    setQueryStringParameter('page', 1);
    window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    APIGetData(page, searchValue);
    
});

searchDriverForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchValue = searchDriver.value ? searchDriver.value : '';
    const page = 1;
    setQueryStringParameter('search', searchValue);
    setQueryStringParameter('page', 1);
    APIGetData(page, searchValue);
});



}else if(new URL(document.location.href).pathname === '/statistiques/excursions'){
  let excursionDeleteBtns;
    let excursionShowBtns;
    const searchDriver = document.querySelector('[name="searchexcursion"]');
    const searchDriverBtn =document.getElementById('searchexcursionBtn');
    const searchDriverForm =document.forms.searchDriverForm;
    const tBody = document.querySelector('.table-border-bottom-0');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const loadingDiv = `
        <div class="text-center fs-3">
            <i class='bx bx-loader-alt bx-spin fs-1'></i>
        </div>
    `;
    function truncate(str, n){
        return (str.length > n) ? str.slice(0, n-1) + '&hellip;' : str;
    };

    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })

    const detailDivShow = async (data) => {
      try {
         
            
        const ordesstat = data;
        const monthlyOrderTotals = {};
        ordesstat.forEach(order => {
           const month = order.excursion.substring(0, 7); // Extract year-month part of the date
           if (!monthlyOrderTotals[month]) {
             monthlyOrderTotals[month] = 0;
           }
           monthlyOrderTotals[month]++;
         });

        // Convert aggregated data to arrays for Chart.js
        const dates = Object.keys(monthlyOrderTotals);
        const values = Object.values(monthlyOrderTotals);
              
        // Create or update the Chart.js chart
        const ctx = detailsBody.getContext('2d');
          if (window.mileageChart) {
              // Update existing chart
              window.mileageChart.data.labels = dates;
              window.mileageChart.data.datasets[0].data = values;
              window.mileageChart.update();
              return window.mileageChart; // Return the updated chart object
          } else {
              // Create new chart
              const myChart = new Chart(ctx, {
                  type: 'bar',
                  data: {
                    labels: dates,
                    datasets: [{
                      label: '',
                      data: values,
                      borderColor: 'rgba(54, 162, 235, 1)',
                      borderWidth: 1,
                      fill: false
                    }]
                  },
                  options: {
                    scales: {
                      y: {
                        beginAtZero: false
                      }
                    }
                  }
                });
              window.mileageChart = myChart; // Store the chart object in a global variable
              return myChart; // Return the new chart object
          }
         
      } catch (error) {
          console.error('Error Mis à jour chart:', error);
      }
    };

    const tableTr = ({type,nom , destination, excursionUuid,id}, role) => {
        if(role === 'superAdmin' || role === 'admin' ||role==='Agent'){
            return`
            <tr>
            <td><strong>${type}</strong></td>
                <td><strong>${nom}</strong></td>
                <td>${destination}</td>
             
                <td>
                    <button id="excursionstat" data-tid=${excursionUuid} class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#modalScrollable2"> STAT<i class="bx bx-show"></i></button>
                </td>
            </tr>
        `;
        }
    }

    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);
 

    const APIGetData = async (page,search) => {
        tBody.innerHTML = '';
        const request = await fetch('/api/excursion?search='+search+'&&page='+page);
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle, response.role);
            });

            if(page === 1){
                pageNumbers.innerHTML = `
                <li class="page-item prev" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
                `;
        
            }else{
                pageNumbers.innerHTML = ` 
                <li class="page-item prev">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-left"></i></a>
                </li>
            `;
            }
            for(let i = 1; i <= response.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > response.totalPages){
                pageNumbers.innerHTML += `
                <li class="page-item next" style="display:none">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>`;
            }else{
                pageNumbers.innerHTML += ` 
                <li class="page-item next">
                    <a class="page-link" href="javascript:void(0);"><i class="tf-icon bx bx-chevron-right"></i></a>
                </li>
            `;
            }
        }
    }
    const APIGet = async (url, formData) => {
      const request = await fetch(url, {
          method: 'POST',
          body: formData
      });
      const response = await request.json();
      return response;
  }
  
  const APIDeleteData = async (data) => {
      const request = await fetch('/api/excursion', {
          method: 'POST',
          body: data
      });
      const response = await request.json();
      if(response.message && response.message == "Réorienter"){
          document.location.href = "/logout"
          return;
      }

      if(!response.status){
          deleteErr.innerText = response.message;
          deleteErr.style.color = 'red';
      }else{
          const params = new URLSearchParams(window.location.search);
          const page = params.get('page') ? parseInt(params.get('page')) : 1;
          const search = params.get('search') ? params.get('search') : '';

          deleteErr.innerText = response.message;
          deleteErr.style.color = 'green';
          await APIGetData(page,search);
      }
  }

  function setQueryStringParameter(name, value) {
      const params = new URLSearchParams(window.location.search);
      params.set(name, value);
      window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
  }

  window.addEventListener('popstate', async function () {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';
        await APIGetData(page,search);
  });
  

  document.addEventListener('mouseover', () => {
      const pageNums = document.querySelectorAll('#pageNums');
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';
      if(document.querySelectorAll('#excursionDeleteBtn')){
          excursionDeleteBtns = document.querySelectorAll('#excursionDeleteBtn');
          excursionDeleteBtns.forEach((excursionDeleteBtn) => {
              excursionDeleteBtn.addEventListener('click', (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  const excursionId = excursionDeleteBtn.getAttribute('data-tid');
                  const formData = new FormData();
                  formData.append('excursionId', excursionId);
                  formData.append('method', 'DELETE');
                  APIDeleteData(formData);
                  /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
              });
          });
      }
      if(pageNums){
          pageNums.forEach((pageNum) => {
              pageNum.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  await APIGetData(parseInt(pageNum.getAttribute('page-number')),search);
                  setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
              }, false)
          });

      }
  
      if(document.querySelector('.prev')){
          document.querySelector('.prev').addEventListener('click', async (e) => {
              e.stopPropagation();
              e.preventDefault();
              e.stopImmediatePropagation();
              if(document.querySelector('.prev').classList.contains('disabled')){
                  return;
              }
              document.querySelector('.prev').classList.add('disabled');
              await APIGetData(page - 1,search)
              setQueryStringParameter('page', page - 1)
              document.querySelector('.prev').classList.remove('disabled');
          });
      }
  
      if(document.querySelector('.next')){
          document.querySelector('.next').addEventListener('click',async (e) => {
              e.stopPropagation();
              e.preventDefault();
              e.stopImmediatePropagation();
              if(document.querySelector('.next').classList.contains('disabled')){
                  return;
              }
              document.querySelector('.next').classList.add('disabled');
              await APIGetData(page + 1,search)
              setQueryStringParameter('page', page+1)
              document.querySelector('.next').classList.remove('disabled');
          });
      }

      
 
  });

  document.addEventListener('DOMContentLoaded', async () => {
      const params = new URLSearchParams(window.location.search);
      const page = params.get('page') ? parseInt(params.get('page')) : 1;
      const search = params.get('search') ? params.get('search') : '';
      searchDriver.value = search;
      await APIGetData(page,search);
            
      
      if(document.querySelectorAll('#excursionstat')){
        excursionstats = document.querySelectorAll('#excursionstat');
        excursionstats.forEach((excursionstat) => {
          excursionstat.addEventListener('click', async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  detailsBody.innerHTML = loadingDiv;
                  const excursionId = excursionstat.getAttribute('data-tid');
                  const formData = new FormData();
                  formData.append('excursionId', excursionId);
                  formData.append('method', 'GET');
                  const response = await APIGet('/api/statistiques', formData);
                  if(response.message && response.message == "Réorienter"){
                      document.location.href = "/logout"
                      return;
                  }

                  if (response.status) {
                    const chart = await detailDivShow(response.data);
    
                    // Assuming you have an HTML element with the ID 'detailsBody' where you want to display the chart
                    const detailsBody = document.getElementById('detailsBody');

                    // Log chart.canvas and detailsBody to check their values
                  
                    // Clear the contents of detailsBody
                    detailsBody.innerHTML = '';
                    
                    // Append the Chart.js canvas to detailsBody
                   
                   
                  }
              });
          });
      }
  });
  searchDriver.addEventListener('input', async function(e) {
    if(e.target.value && e.target.value.trim() !== ''){
        searchDriverBtn.removeAttribute('disabled');
        return;
    }
    searchDriverBtn.setAttribute('disabled', true);
    const searchValue = e.target.value ? e.target.value : '';
    const params = new URLSearchParams(window.location.search);
    const page = 1;
    params.delete('search');
    setQueryStringParameter('page', 1);
    window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    APIGetData(page, searchValue);
    
});

searchDriverForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const searchValue = searchDriver.value ? searchDriver.value : '';
    const page = 1;
    setQueryStringParameter('search', searchValue);
    setQueryStringParameter('page', 1);
    APIGetData(page, searchValue);
});
}

 
 
