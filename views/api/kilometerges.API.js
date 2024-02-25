if((new URL(document.location.href).pathname === '/add-km')){
    const excursionSelect = document.getElementById('select_box');
    const vehicleSelect = document.getElementById('select_box2');
    const departSelect = document.getElementById('depart');
    const driversSelect = document.getElementById('select_box3');

    var vs = document.getElementById('select_box2');
    const addkilometergeerr = document.getElementById('addkilometergeerr');
   
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter`;
    const depart = document.querySelector('[name="depart"]');
    const arrive = document.querySelector('[name="arrive"]');

 
    const addkilometergeForm = document.forms.addkilometergeForm;
 
    const APIGetRequest = async () => {
        try {
            // Fetch vehicles data
            const vehiclesRequest = await fetch('/api/vehicles?method=allVehicles');
            const vehiclesResponse = await vehiclesRequest.json();
            
            // Process vehicles data
            vehiclesResponse.data.forEach(vehicle => {
                vehicleSelect.insertAdjacentHTML('beforeend', `<div><option value="${vehicle.vehicleUuid}">${vehicle.regisNumber}</option></div>`);
              
            });
           
            // Fetch drivers data
            const excursionRequest = await fetch('/api/excursion?method=allexcursion');
            const excursionResponse = await excursionRequest.json();
            

        
            // Process drivers data
            excursionResponse.data.forEach(excursion => {
                excursionSelect.insertAdjacentHTML('beforeend', `<option value="${excursion.excursionUuid}">${excursion.nom}</option>`); 
                   
            });
            const driversRequest = await fetch('/api/drivers?methode=alldrivers');
            const driverResponse = await driversRequest.json();
            // select chauffeur
            driverResponse.data.forEach(driver => {
                driversSelect.insertAdjacentHTML('beforeend', `<option value="${driver.driverUuid}">${driver.driverFullName}</option>`); });
            // Create a new Date instance for the current date

         
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    };
    document.addEventListener('DOMContentLoaded', async() => {
        await APIGetRequest();
        $('select').selectize({
            sortField: 'text'
        });
    })
    function validatekm() {

        var depart = parseInt(document.getElementById("depart").value);
        var arrive = parseInt(document.getElementById("arrive").value);
    
        if (arrive <= depart) {
          document.getElementById("arrive").setCustomValidity(" 'le kilométrage à l'arrivée devrait être supérieur à celui du départ'");
        } else {
          document.getElementById("arrive").setCustomValidity("");
        }
      }
    
     
    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };

    addkilometergeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addkilometergeForm.querySelector('button').setAttribute('disabled', true);
        addkilometergeForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
        const currentDate = new Date();

        // Get the year, month, and day
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with 0 if needed
        const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with 0 if needed
        
        // Create the formatted date string
        const formattedDate = `${year}-${month}-${day}`;
        const diff = arrive.value - depart.value;
       
      
        formData.append('diff',diff);
        formData.append('method', 'POST');
        formData.append('type', 'addkilometerge');
        formData.append('depart', depart.value);
        formData.append('arrive', arrive.value);
        formData.append('formattedDate',formattedDate);
        formData.append('driverUuid',driversSelect.value);
        formData.append('vehicleUuid', vehicleSelect.value);
        formData.append('excursionUuid', excursionSelect.value);
        
        const response = await APIPostRequest('/api/kilometerges', formData);
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            addkilometergeForm.querySelector('button').removeAttribute('disabled');
            addkilometergeForm.querySelector('button').innerHTML = loadedBtn;
            addkilometergeerr.innerText = response.message;
            addkilometergeerr.style.color = 'red';

        }else{
            addkilometergeerr.innerText = response.message;
            addkilometergeerr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/kilometerges'
            }, 1000);
        }
    })
}

 else if(new URL(document.location.href).pathname === '/kilometerges'){
   
    let salaryDeleteBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
    const filterSelect = document.querySelector('#smallSelect');
    const pageNumbers = document.querySelector('.pagination');
    const deleteErr =document.getElementById('deleteErr');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;
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

    const detailDivShow = ({depart, arrive,regisNumber,fullName,driverFullName,nom}) => {
        return `
            <h6>Kilometerge de depart</h6> <p>${depart}</p> <br/>
            <h6>Kilometerge de arrive</h6> <p>${arrive}</p> <br/>
            <h6>Matricel Voiture</h6> <p>${regisNumber}</p> <br/>
            <h6>Nom Excursion</h6> <p>${nom}</p> <br/>
            <h6>Nom de chauffeur</h6> <p>${driverFullName}</p> <br/>
            <h6>Ajouter par </h6> <p>${fullName}</p> <br/>
      
        `;
    }
    const tableTr = ({ nom, regisNumber, depart, id, arrive ,driverFullName}, role) => {

        if (role === 'superAdmin' || role === 'admin') {
          
          return `
            <tr>
              <td><strong>${regisNumber}</strong></td>
              <td>${nom}</td>
              <td>${driverFullName} </td>
              <td>${depart} km</td>
              <td>${arrive} km</td>
              <td>${arrive-depart}km</td>

              <td>
              <a href="kilometerges/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                <button id="kilometergeShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                <button id="kilometergeDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>

                </td>
            </tr>
          `;
        }
      else{
        
            return`
            <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${nom}</td>
                <td>${driverFullName} </td>
                <td>${depart}km</td>
                <td>${arrive}km</td>
                <td>${arrive-depart}km</td>
                <td>
                <button id="kilometergeShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>

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
        const request = await fetch('/api/kilometerges?method=allKilometerge&&page='+page+'&&search='+search);
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
           
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((salary) => {
            
                tBody.innerHTML += tableTr(salary, response.role);
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
        const request = await fetch('/api/kilometerges', {
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
            await APIGetData(page, search);
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
        await APIGetData(page, search);
    });
    

    document.addEventListener('mouseover', () => {
        const pageNums = document.querySelectorAll('#pageNums');
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;   
        const search = params.get('search') ? params.get('search') : '';
        if(document.querySelectorAll('#kilometergeDeleteBtn')){
            kilometergeDeleteBtns = document.querySelectorAll('#kilometergeDeleteBtn');
            kilometergeDeleteBtns.forEach((kilometergeDeleteBtn) => {
                kilometergeDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const kilometergeId = kilometergeDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('kilometergeId', kilometergeId);
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
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')), search);
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
                await APIGetData(page - 1, search)
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
                await APIGetData(page + 1, search)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
        
    });

  document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        await APIGetData(page, search);
        if(document.querySelectorAll('#kilometergeDeleteBtn')){
            kilometergeDeleteBtns = document.querySelectorAll('#kilometergeDeleteBtn');
            kilometergeDeleteBtns.forEach((kilometergeDeleteBtn) => {
                kilometergeDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const kilometergeId = kilometergeDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('kilometergeId', kilometergeId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        if(document.querySelectorAll('#kilometergeShowBtn')){
      
            kilometergeShowBtns = document.querySelectorAll('#kilometergeShowBtn');
            kilometergeShowBtns.forEach((kilometergeShowBtn) => {
                kilometergeShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const kilometergeId = kilometergeShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('kilometergeId', kilometergeId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/kilometerges', formData);
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
  
}else if(document.forms.editkilometerge){
    const editkilometerge = document.forms.editkilometerge;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter Kilometerge`;

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
    editkilometerge.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const excursionSelect = document.getElementById('select_box');
      const vehicleSelect = document.getElementById('select_box2');
      const driversSelect =document.getElementById('select_box3');
        const depart = this.querySelector('[name="depart"]');
        const arrive = this.querySelector('[name="arrive"]');
      
        const formData = new FormData();
       
        formData.append('depart', depart.value);
        formData.append('arrive', arrive.value);
        formData.append('vehicleUuid', vehicleSelect.value);
        formData.append('excursionUuid', excursionSelect.value);
        formData.append('driverUuid',driversSelect.value);

      
        formData.append('method', 'UPDATE');

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
                document.location.href = '/kilometerges'
            }, 1000);
        }
    }); 
    
}else if(document.forms.addkilometergeForm2){
    const addkilometergeForm2 = document.forms.addkilometergeForm2;
    const convertedDiv = document.getElementById('convertedDiv');
    const addkilometergeerr = document.getElementById('addkilometergeerr');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter kilometerges`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }
    function validatekm() {

        var depart = parseInt(document.getElementById("depart").value);
        var arrive = parseInt(document.getElementById("arrive").value);
    
        if (arrive <= depart) {
          document.getElementById("arrive").setCustomValidity(" 'le kilométrage à l'arrivée devrait être supérieur à celui du départ'");
        } else {
          document.getElementById("arrive").setCustomValidity("");
        }
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
    addkilometergeForm2.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const excursionSelect = document.getElementById('select_box');
      const vehicleSelect = document.getElementById('select_box2');
      const driversSelect = document.getElementById('select_box3');
      const depart =document.getElementById('select_box4');
      
      const currentDate = new Date();

      // Get the year, month, and day
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with 0 if needed
      const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with 0 if needed
      
      // Create the formatted date string
      const formattedDate = `${year}-${month}-${day}`;
        const arrive = this.querySelector('[name="arrive"]');
        const etat = document.getElementById('etat');
        const diff = arrive.value - depart.value;
        const formData = new FormData();
  
        formData.append('diff',diff);
        formData.append('formattedDate',formattedDate);
        formData.append('depart', depart.value);
        formData.append('arrive', arrive.value);
        if(etat.value!=='bien')
        {
            formData.append('etat',etat.value);
        }
      
        formData.append('vehicleUuid', vehicleSelect.value);
        formData.append('excursionUuid', excursionSelect.value);
        formData.append('driverUuid',driversSelect.value);      
        formData.append('method', 'POST');

        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
        if(response.message === 'Réorienter'){
            document.location.href = '/logout';
            return
        }

        if (!response.status) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            addkilometergeerr.innerHTML = response.message;
            addkilometergeerr.style.color = 'red';
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
        }else{
            addkilometergeerr.innerHTML = response.message;
            addkilometergeerr.style.color = 'green'
            setTimeout(() => {
                document.location.href = '/kilometerges'
            }, 1000);
        }
    }); 
    
}

