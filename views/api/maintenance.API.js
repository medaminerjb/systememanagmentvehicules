if(new URL(document.location.href).pathname === '/listevehiculesmaintenance'){
    const vehicleForm = document.forms.vehicleForm;
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;

  

/* --------------------------------------------------------------------------------------- */
    let vehicleDeleteBtns;
    let vehicleShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const modelsSelect =document.getElementById('model');
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
    
      
    const detailDivShow = ({ model, color, vtype, regisNumber ,obeservation}) => {
        return `
          <div>
          
              <h6>Vehicle Matricel</h6>
              <p>${regisNumber}</p>
            </div>
            <div>
              <h6>Vehicle Model</h6>
              <p>${model}</p>
            </div>
            <div>
              <h6>Vehicle Color</h6>
              <p>${color}</p>
            </div>
            <div>
              <h6>Vehicle Type</h6>
              <p>${vtype}</p>
            </div>
           
            <div>
            <h6 style="color : red;">description de probleme</h6>
            <p style="color: red;">${obeservation}</p>
          </div>
          
           
            
        `;
      };
    const tableTr = ({regisNumber,etat, model, color, vehicleUuid, vtype}, role) => {

        if(etat==='maintenance')
{

        if(role === 'superAdmin' || role === 'admin'){
         
         
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
                <td>${color}</td>
                <td>${etat}</td>
                <td>
                    <a href="maintenirvehicule/${vehicleUuid}" class="btn btn-outline-secondary"><i class="bx bx-cog "></i></a>
                    <button id="vehicleShowBtn" data-tid=${vehicleUuid} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
                <td>${color}</td>
                <td>${vtype}</td>
                <td>
                    <button id="vehicleShowBtn" data-tid=${vehicleUuid} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                </td>
            </tr>
        `;
        }
        }else {
            return ''; // Return an empty string if etat is not 'maintenance'
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
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle,response.role);
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
        const request = await fetch('/api/vehicles', {
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

        
        if(document.querySelectorAll('#vehicleShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#vehicleShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const vehicleId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'GET');
                  
                    const response = await APIGet('/api/vehicles', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
                    }
                });
            });
        }
        
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        searchDriver.value = search;
        await APIGetData(page,search);
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
                });
            });
        }
        
        if(document.querySelectorAll('#vehicleShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#vehicleShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const vehicleId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('vehicleId', vehicleId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/vehicles', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
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

    
} else if(document.forms.editVehicle){
    const editVehicle = document.forms.editVehicle;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `modifier Vehicle`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

    let converted;
    document.querySelectorAll('[name=convertedRadio]').forEach(function (radio){
        radio.addEventListener('change', async function (e){
            if(this.value === 'converted'){
                const formData = new FormData();
                formData.append('method', 'GET');
                const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
                convertedDiv.innerHTML = `
                <div class="row g-2 mb-3">
                    <div class="mb-0">
                        <label for="other" class="form-label"> What was it converted to?</label>
                        <textarea name="converted" id="converted" class="form-control" required>${response.data.converted !== 'unconverted' ? response.data.converted : ''}</textarea>
                    </div>
                </div>`;
                converted = document.querySelector('[name="converted"]');
            }else{
                convertedDiv.innerHTML = '';
            }
        })
    })
    editVehicle.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
      
      
       
        const model = this.querySelector('[name="model"]');
        const regisNo = this.querySelector('[name="regisNo"]');
        const color = this.querySelector('[name="color"]');
        const formData = new FormData();
        formData.append('modelUuid', model.value);
        formData.append('regisNo', regisNo.value);
        formData.append('color', color.value);
        formData.append('methode', 'UPDATE');

        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
        if(response.message === 'Réorienter'){
            document.location.href = '/logout';
            return
        }

        if (!response.status) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
        }else{
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'green'
            setTimeout(() => {
                document.location.href = '/vehicles'
            }, 1000);
        }
    }); 

}else if(new URL(document.location.href).pathname === '/historiquesmaintenance'){
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;

  

/* --------------------------------------------------------------------------------------- */
    let vehicleDeleteBtns;
    let vehicleShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const modelsSelect =document.getElementById('model');
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
    
      
    const detailDivShow = ({ dateen, datesor, total,type, regisNumber ,obeservation}) => {
        return `
          <div>
          
              <h6>Vehicle Matricel</h6>
              <p>${regisNumber}</p>
            </div>
            <div>
              <h6>date debut de maintenance</h6>
              <p>${dateen}</p>
            </div>
            <div>
              <h6>date fin maintenance</h6>
              <p>${datesor}</p>
            </div>
            <div>
            <h6>total montant </h6>
            <p>${total}</p>
          </div>
            <div>
              <h6>Type maintenance</h6>
              <p>${type}</p>
            </div>
           
            <div>
            <h6 style="color : red;">description de probleme</h6>
            <p style="color: red;">${obeservation}</p>
          </div>
          
           
            
        `;
      };
    const tableTr = ({regisNumber,dateen, datesor, type,id}, role) => {

   
        if(role === 'superAdmin' || role === 'admin'){
         
         
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${dateen}</td>
                <td>${datesor}</td>
                <td>${type}</td>
                <td>
                <a href="maintenance/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                <button id="maintenanceShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                <button id="maintenanceDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
            </td>
            </tr>
        `;
        }else{
            return`
            <tr>
            <td><strong>${regisNumber}</strong></td>
            <td>${dateen}</td>
            <td>${datesor}</td>
            <td>${type}</td>
                <td>
                    <button id="maintenanceShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
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
        const request = await fetch('/api/maintenance?methode=maintenance&&search='+search+'&&page='+page);
        const response = await request.json();
        console.log(response.data);
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle,response.role);
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
        const request = await fetch('/api/maintenance', {
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
        if(document.querySelectorAll('#maintenanceDeleteBtn')){
            maintenanceDeleteBtns = document.querySelectorAll('#maintenanceDeleteBtn');
            maintenanceDeleteBtns.forEach((maintenanceDeleteBtn) => {
                maintenanceDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const maintenanceId = maintenanceDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('maintenanceId', maintenanceId);
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

        
        if(document.querySelectorAll('#maintenanceShowBtn')){
            maintenanceShowBtns = document.querySelectorAll('#maintenanceShowBtn');
            maintenanceShowBtns.forEach((maintenanceShowBtn) => {
                maintenanceShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const maintenanceId = maintenanceShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('maintenanceId', maintenanceId);
                    formData.append('method', 'GET');
                  
                    const response = await APIGet('/api/maintenance', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
                    }
                });
            });
        }
        
    });

    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        searchDriver.value = search;
        await APIGetData(page,search);
        if(document.querySelectorAll('#maintenanceDeleteBtn')){
            maintenanceDeleteBtns = document.querySelectorAll('#maintenanceDeleteBtn');
            maintenanceDeleteBtns.forEach((maintenanceDeleteBtn) => {
                maintenanceDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const maintenanceId = maintenanceDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('maintenanceId', maintenanceId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#maintenanceShowBtn')){
            maintenanceShowBtns = document.querySelectorAll('#maintenanceShowBtn');
            maintenanceShowBtns.forEach((maintenanceShowBtn) => {
                maintenanceShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const maintenanceId = maintenanceShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('maintenanceId', maintenanceId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/maintenance', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                        }, 1500);
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

    
} else{
       
    const type = document.getElementById('type');
    const vehicleUuid = document.getElementById('vehicle');
    const addcarburanterr = document.getElementById('addcarburanterr');
   
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter`;
    const dateen  = document.querySelector('[name="dateen"]');
    const datesor = document.querySelector('[name="datesor"]');
    const total = document.querySelector('[name="total"]');
    
    const obeservation = document.querySelector('[name="obeservation"]');
    const addmain = document.forms.addmain;
    const editmaintenance = document.forms.editmaintenance;

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };
     if(document.forms.addmain){
        addmain.addEventListener('submit', async (e) => {
        e.preventDefault();
        addmain.querySelector('button').setAttribute('disabled', true);
        addmain.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
      
      
      
        formData.append('method', 'POST');
        formData.append('total',total.value);
     
        formData.append('dateen', dateen.value);
        formData.append('datesor', datesor.value);
        formData.append('type', type.value);
        formData.append('vehicleUuid', vehicleUuid.value);
        formData.append('obeservation',obeservation.value);
        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
          if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout";
            return;
        }

        if (!response.status) {
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'red'
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
        }else{
            errDiv.innerHTML = response.message;
            errDiv.style.color = 'green'
            setTimeout(() => {
                document.location.href = '/historiquesmaintenance'
            }, 1000);
        }

    })
    }
    else if(document.forms.editmaintenance){
        editmaintenance.addEventListener('submit', async (e) => {
        e.preventDefault();
        editmaintenance.querySelector('button').setAttribute('disabled', true);
        editmaintenance.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
      
      
      
       
 
        formData.append('total',total.value);
     
        formData.append('dateen', dateen.value);
        formData.append('datesor', datesor.value);
        formData.append('type', type.value);
        formData.append('vehicleUuid', vehicleUuid.value);
        formData.append('obeservation',obeservation.value);
        formData.append('method', 'UPDATE');
        
        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            editmaintenance.querySelector('button').removeAttribute('disabled');
            editmaintenance.querySelector('button').innerHTML = loadedBtn;
            addcarburanterr.innerText = response.message;
            addcarburanterr.style.color = 'red';

        }else{
            addcarburanterr.innerText = response.message;
            addcarburanterr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/ordres'
            }, 1000);
        }
    })


    }

}
