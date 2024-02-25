if(new URL(document.location.href).pathname === '/vehicles'){
    const vehicleForm = document.forms.vehicleForm;
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;

    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter Vehicle`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

    const APIGetRequest = async () => {
        try {
                const modelsRequest = await fetch('/api/modelsvehicle?method=GET&&methode=allmodels');
                const modelsResponse = await modelsRequest.json();
                // select chauffeur
                modelsResponse.data.forEach(models => {
                    modelsSelect.insertAdjacentHTML('beforeend', `<option  value="${models.modelUuid}">${models.model} ${models.place}  <img src="./image1.jpg" alt="Image 1">  places</option>`);
                  });
                  
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    };
   
    document.addEventListener('DOMContentLoaded', async() => {
        await APIGetRequest();
     
    })
  
 
  
    vehicleForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
       
       
        const model = this.querySelector('[name="model"]');
        const regisNo = this.querySelector('[name="regisNo"]');
       
        const km = this.querySelector('[name="km"]');
        const color = this.querySelector('[name="color"]');
        
        
        const formData = new FormData();
     
     
        formData.append('modelUuid', model.value);
        formData.append('regisNo', regisNo.value);
        formData.append('km',km.value);
        formData.append('color', color.value);
        
        formData.append('method', 'POST');

        const response = await APIPostRequest('/api/vehicles', formData);
        if(response.message === 'Réorienter'){
            document.location.href = '/logout';
            return
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
                document.location.href = '/vehicles'
            }, 1000);
        }
    });



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
    
      
    const detailDivShow = ({ model, color, vtype, regisNumber ,puissanceA,puissanceM,typec,place}) => {
        return `
          <div>
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
              <h6>Registration Number</h6>
              <p>${regisNumber}</p>
            </div>
            <div>
              <h6>Puissance Vehicule </h6>
              <p>${puissanceA}</p>
            </div>
            <div>
            <h6>Puissance Vehicule </h6>
            <p>${puissanceM}</p>
          </div>
            <div>
              <h6>Type de Carburant</h6>
              <p>${typec}</p>
            </div>
            <div>
            <h6>Number de place</h6>
            <p>${place}</p>
          </div>
            
        `;
      };
    const tableTr = ({regisNumber, model, color, vehicleUuid, vtype}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${model}</td>
                <td>${color}</td>
                <td>${vtype}</td>
                <td>
                    <a href="vehicles/${vehicleUuid}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                    <button id="vehicleShowBtn" data-tid=${vehicleUuid} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="vehicleDeleteBtn" data-tid=${vehicleUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
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
                    formData.append('id', id);
                    formData.append('id', id);
                    formData.append('method', 'GET');
                    formData.append('type' ,'getordre');
                    const raddcarburantesponse = await APIGet('/api/ordre', formData);
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

}
