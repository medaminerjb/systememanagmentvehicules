if(new URL(document.location.href).pathname === '/ordre' ||new URL(document.location.href).pathname === '/mission'){
    const excursionSelect = document.getElementById('select_box');
    const vehicleSelect = document.getElementById('select_box2');
    const driversSelect = document.getElementById('select_box3');
    const addordreErr = document.getElementById('addordreErr');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter Ordre`;
    const excursion = document.querySelector('[name="excursion"]');
    const heure = document.querySelector('[name="heure"]');
    const agence = document.querySelector('[name="agence"]');
    const heurer = document.querySelector('[name="heurer"]');
    const dater = document.querySelector('[name="dater"]');
    const bebe = document.querySelector('[name="bebe"]');
    const hotel = document.querySelector('[name="hotel"]');
    const chambre = document.querySelector('[name="chambre"]');
    const addOrdreForm = document.forms.addOrdreForm;
 let excursions;
    const APIGetRequest = async () => {
        try {
            // Fetch vehicles data
            const vehiclesRequest = await fetch('/api/vehicles?methode=allVehicles');
            const vehiclesResponse = await vehiclesRequest.json();
            
            // Process vehicles data
            vehiclesResponse.data.forEach(vehicle => {
                     
                vehicleSelect.insertAdjacentHTML('beforeend', `<option value="${vehicle.vehicleUuid}">${vehicle.regisNumber}-${vehicle.vtype}-${vehicle.model}</option>`);
              
            });
            
            // Fetch drivers data
            const excursionRequest = await fetch('/api/excursion?methode=allexcursions');
            const excursionResponse = await excursionRequest.json();

            excursions = excursionResponse.data;

            // Process drivers data
            excursionResponse.data.forEach(excursion => {
                if(excursion.type !== 'mission')
                {
                     excursionSelect.insertAdjacentHTML('beforeend', `<option value="${excursion.excursionUuid}">${excursion.type}  ${excursion.nom}</option>`); 
                } 
                   
            });

            // select chauffeur
            const driversRequest = await fetch('/api/drivers?methode=alldrivers');
            const driverResponse = await driversRequest.json();
            // select chauffeur
            console.log(driverResponse);
            driverResponse.data.forEach(driver => {
                driversSelect.insertAdjacentHTML('beforeend', `<option value="${driver.driverUuid}">${driver.driverFullName}</option>`); });
       
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

    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };

    addOrdreForm.addEventListener('submit', async (e) => {
       /*
        const kmRequest = await fetch('/api/kilometerges?method=kmhis');
        const kmResponse = await kmRequest.json();
        kmResponse.data.forEach(driver => {
            if(vehicleSelect.value == driver.vehicleUuid){
                var $kmdepart = driver.vehicleUuid;

            }
               
        });
        console.log($kmdepart);*/

        e.preventDefault();
        addOrdreForm.querySelector('button').setAttribute('disabled', true);
        addOrdreForm.querySelector('button').innerHTML = loadingBtn;
        const formData = new FormData();
     

const selectedExcursion = excursions.find(excursion => excursion.excursionUuid === document.getElementById("select_box").value);
        if (selectedExcursion) {
          duree = selectedExcursion.duree;
          var retour = new Date(document.getElementById("dater").value);
            var depart = new Date(document.getElementById("excursion").value);
            var retourDate = new Date(depart.getTime() + duree * 24 * 60 * 60 * 1000);
            var formattedRetourDate = retourDate.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            // Calculate retour date based on excursion duration in minutes
    console.log(retourDate);
            if (retour < retourDate) {
                addOrdreForm.querySelector('button').removeAttribute('disabled');
                addOrdreForm.querySelector('button').innerHTML = loadedBtn;
                addordreErr.innerText = 'date de retour ne est pas valid correct date de retour est '+formattedRetourDate;
                addordreErr.style.color = 'red';
                return;
            }  else if (retour > retourDate) {
                addOrdreForm.querySelector('button').removeAttribute('disabled');
                addOrdreForm.querySelector('button').innerHTML = loadedBtn;
                addordreErr.innerText = 'date de retour ne est pas valid correct date de retour est '+formattedRetourDate;
                addordreErr.style.color = 'red';
                return;
            }else {
              document.getElementById("dater").setCustomValidity("");
            }
        }
      
       
    
   
        
        formData.append('type', 'addOrdre');
        formData.append('method', 'POST');
        formData.append('heure', heure.value);
        formData.append('excursion', excursion.value);
        formData.append('heurer', heurer.value);
        formData.append('dater', dater.value);
        formData.append('agence',agence.value);
        formData.append('driverUuid',driversSelect.value)
        formData.append('vehicleUuid', vehicleSelect.value);
        formData.append('excursionUuid', excursionSelect.value);
        
        const response = await APIPostRequest('/api/ordre', formData);
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            addOrdreForm.querySelector('button').removeAttribute('disabled');
            addOrdreForm.querySelector('button').innerHTML = loadedBtn;
            addordreErr.innerText = response.message;
            addordreErr.style.color = 'red';

        }else{
            addordreErr.innerText = response.message;
            addordreErr.style.color = 'green';

            setTimeout(() => {
                document.location.href = '/ordres'
            }, 1000);
        }
    })
}




///////////////////////////////////////////////////////





 else if(new URL(document.location.href).pathname === '/ordres'){
    let vehicleDeleteBtns;
    let vehicleShowBtns;
    const tBody = document.querySelector('.table-border-bottom-0');
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

    const detailDivShow = ({ nom, excursion, agence, type,heure, adulte, enfant, bebe ,fullName,vehicleUuid,driverFullName ,regisNumber }) => {
        let result = `
            <h6>excursion</h6> <p>${nom}</p> <br/>
            <h6>vehicule</h6> <p>${regisNumber}</p> <br/>
            <h6>chauffuer</h6> <p>${driverFullName}</p> <br/>
            <h6>ajouter par</h6> <p>${fullName}</p> <br/>
            <h6>date</h6> <p>${excursion}</p> <br/>
            <h6>heure</h6> <p>${heure}</p> <br/>`;
    
        if (type==='excursion' ) {
            result += `
                <h6>agence</h6> <p>${agence}</p> <br/>
                <h6>num adulte</h6> <p>${adulte}</p> <br/>
                <h6>num enfant</h6> <p>${enfant}</p> <br/>
                <h6>num bebe</h6> <p>${bebe}</p> <br/>
                <h6>num total</h6> <p>${enfant + bebe + adulte}</p> <br/>`;
        }
    
        return result;
    };
    const currentDate = new Date();

    // Get the year, month, and day
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with 0 if needed
    const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with 0 if needed
    
    // Create the formatted date string
    const formattedDate = `${year}-${month}-${day}`;
    const currentTime = new Date();

// Get the current hour and minute
const hours = String(currentTime.getHours()).padStart(2, '0'); // Get the hours (in 24-hour format) and pad with 0 if needed
const minutes = String(currentTime.getMinutes()).padStart(2, '0'); // Get the minutes and pad with 0 if needed

// Create the formatted time string
const formattedTime = `${hours}:${minutes}`;

    const tableTr = ({type,nom ,etat,gasoil, placeocu,excursion, heure,place,agence,regisNumber,driverUuid ,id,kmtotal},role,userUuid) => {
        if(role === 'superAdmin' || role === 'admin'){
      
     
            let result = `

      
            <tr>
            <td><strong>${type}</strong></td>
                <td><strong>${nom}</strong></td>
                <td>${regisNumber}</td>
                <td>${excursion}</td>
                <td>
                
                `
              if(etat!=='confirmer')
               {
                result+= `   <a href="ordres/confirmation/${id}" class="btn btn-outline-success" target="_blank"><i class="bx bx-message-rounded-check"></i></a>
                `}
                result+=` </td> <td>  `
                if((type==='mission')&& (excursion < formattedDate ||  (formattedTime >= heure && formattedDate===excursion ))&&((gasoil===null )&&(kmtotal=== null))){
               
               result+= ` <a href="carburants/nouvelle/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-gas-pump"></i></a>
               
               `  }
               if( (excursion < formattedDate ||  (formattedTime >= heure && formattedDate===excursion ))&& (kmtotal=== null)) {
                result+=  `
                  <a href="add-km/chauffeur/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-calculator"></i></a>`
                 }
                     if(type!=='mission'){
                        result += `
                        <td> `
                        
                        if((place>placeocu)&&(etat!=='confirmer')){
                            result +=  `   <a href="ordres/ticket/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-list-plus"></i></a>
                            `
                        }
                        result +=   ` <a href="tickets/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-list-ol"></i></a></td>
                            </td>`
                           }
                else{
                    result+=`<td></td>`
                }
                  
                result +=  ` <td>
                      <a href="ordres/imprimer/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-printer"></i></a>
                      <a href="ordres/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit"></i></a>
                    <button id="ordreShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="ordreDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>     
            </tr>
            
        ` 
        return result;
        ;
        }else 
        {
            let result = `
    <tr>
      <td><strong>${type}</strong></td>
      <td><strong>${nom}</strong></td>
      <td>${regisNumber}</td>
      <td>${excursion}</td>
      <td>${heure}</td>
      <td> `
      if((nom === 'Remplir Carburant')&& (gasoil===0 )){
               
        result+= ` <a href="carburants/nouvelle/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-gas-pump"></i></a>
        
        `  }
        if( (excursion < formattedDate ||  (formattedTime >= heure && formattedDate===excursion ))&& (kmtotal=== 0)) {
         result+=  `
           <a href="add-km/chauffeur/${id}" class="btn btn-outline-secondary" target="_blank">KM<i class="bx bx-calculator"></i></a>`
          }

        result+= `</td><td> `
     

    
  if (excursion > formattedDate ||  (formattedTime <= heure && formattedDate===excursion )) {
    result += `
     <a href="ordres/imprimer/${id}" class="btn btn-outline-secondary" target="_blank"><i class="bx bx-printer"></i></a>`;
  }

  result += `
      <button id="ordreShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
      `
    
    result+= `
      </td>
  </tr>`;

  return result;
        ;
        
    }
        
    }

    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);

    const APIGetData = async (page , search) => {
        tBody.innerHTML = '';
      
        const request = await fetch('/api/ordre?methode=allordre&&page='+page+'&&search='+search);
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(response.status){
    
            response.data.map((vehicle) => {
                tBody.innerHTML += tableTr(vehicle, response.role,response.userUuid);
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
        const request = await fetch('/api/ordre', {
            method: 'POST',
            body: data
        });
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
            setTimeout(function() {
                // Réorienterto "/ordres"
                window.location.href = "/ordres";
              }, 1000);
        
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
            setTimeout(function() {
                // Réorienterto "/ordres"
                window.location.href = "/ordres";
              }, 1000);

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
            vehicleDeleteBtns = document.querySelectorAll('#ordreDeleteBtn');
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
                    await APIGetData(parseInt(pageNum.getAttribute('page-number')));
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

        
        if(document.querySelectorAll('#ordreShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#ordreShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const ordreId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ordreId', ordreId);
                    formData.append('method', 'GET');
                    formData.append('type' ,'getordre');
                    const response = await APIGet('/api/ordre', formData);
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
        if(document.querySelectorAll('#ordreDeleteBtn')){
            ordreDeleteBtns = document.querySelectorAll('#ordreDeleteBtn');
            ordreDeleteBtns.forEach((ordreDeleteBtn) => {
                ordreDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const ordreId = ordreDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ordreId', ordreId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#ordreShowBtn')){
            vehicleShowBtns = document.querySelectorAll('#ordreShowBtn');
            vehicleShowBtns.forEach((vehicleShowBtn) => {
                vehicleShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const ordreId = vehicleShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ordreId', ordreId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/ordre', formData);
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
        if(document.querySelectorAll('#ordreShowBtn2')){
            vehicleShowBtns = document.querySelectorAll('#ordreShowBtn2');
            vehicleShowBtns.forEach((ordreShowBtn2) => {
                ordreShowBtn2.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const ordreId = ordreShowBtn2.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ordreId', ordreId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/ordre', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }

                    if(response.status){
                        setTimeout(() => {
                            detailsBody2.innerHTML = detailDivShow(response.data);
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
}else if(document.forms.editordre){
    
    const editordre = document.forms.editordre;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add ordre`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

  
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
    editordre.addEventListener('submit', async function (e) {
       
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const excursionSelect = document.getElementById('select_box');
        const vehicleSelect = document.getElementById('select_box2');
        const driversSelect = document.getElementById('select_box3');
        const heure = this.querySelector('[name="heure"]');
        const excursion = this.querySelector('[name="excursion"]');
        const agence = this.querySelector('[name="agence"]');
        const enfant = this.querySelector('[name="enfant"]');
        const adulte = this.querySelector('[name="adulte"]');
        const bebe = this.querySelector('[name="bebe"]');
        const formData = new FormData();
        formData.append('heure', heure.value);
        formData.append('excursion', excursion.value);
        formData.append('agence',agence.value);
   
        formData.append('driverUuid',driversSelect.value);
        formData.append('vehicleUuid', vehicleSelect.value);
        formData.append('excursionUuid', excursionSelect.value);
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
                document.location.href = '/ordres'
            }, 1000);
        }
    }); 
}
else if(document.forms.confirmerordre){
    const confirmerordre = document.forms.confirmerordre;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add ordre`;
    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

  
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
   
    confirmerordre.addEventListener('submit', async function (e) {
        const chambre = document.querySelector('[name="chambre"]');
        const enfant = document.querySelector('[name="enfant"]');
        const adulte = document.querySelector('[name="adulte"]');
        const bebe = document.querySelector('[name="bebe"]');
        const paiment = document.getElementById('paiment');
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const formData = new FormData();
       if(confirmation==='ticket'){
        const depart = document.getElementById(elementnumero);
        const numero1 = parseInt(elementnumero);
        formData.append('numero',numero1);
        formData.append('depart', depart.value);
        formData.append('enfantr',enfant.value);
        formData.append('adulter',adulte.value);
        formData.append('beber',bebe.value);
        formData.append('etat',paiment.value);
formData.append('tarifstadu',tarifsadu);
formData.append('tarifstenf',tarifsenf);

        formData.append('method', 'confiermerticket');

       }else{ 
        const confirmer = 'confirmer'
        formData.append('confirmer', confirmer);
        formData.append('method', 'confirmerordre');
       }
         
         


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
            errDiv.style.color = 'green';
            if(confirmation==='ticket')
         {   setTimeout(() => {
                location.reload(); // Reload the current page
            }, 1000); }
           else{
            setTimeout(() => {
                document.location.href = '/ordres'
            }, 1000);
           }
        }
    }); 
}else if(document.forms.confirmationtotal){
    const confirmationtotal = document.forms.confirmationtotal;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Add ordre`;
    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

  
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
   
    confirmationtotal.addEventListener('submit', async function (e) {
       
        
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
         

         const formData = new FormData();
         const confirmer = 'confirmé'
         formData.append('confirmer', confirmer);
         formData.append('method', 'confirmerordre');
          


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
            errDiv.style.color = 'green';

           
            setTimeout(() => {
                location.reload(); // Reload the current page
            }, 1000); 
        }
    }); 
}
