/* ?uid='+new URL(document.location.href).pathname.split('/').filter(n => n)[1]  */
if(document.forms.addDriver){
    const successDiv = document.getElementById('successDiv');
    const pageNumbers = document.querySelector('.pagination');
    const addDriverBtn = document.querySelector('#addDriverBtn');
    const canDriverBtn = document.querySelector('#canDriverBtn');
    const tBody = document.querySelector('.table-border-bottom-0');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const addDriver = document.forms.addDriver;
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;
   
    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }

    
    const loadingDiv = `
    <div class="text-center fs-3">
        <i class='bx bx-loader-alt bx-spin fs-1'></i>
    </div>
    `;
    
    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })
    
    const detailDivShow = ({ bateOfBirth, driverFullName, driverIdNo, email, idNumber,  phoneHome, phoneMobile}) => {
    
    return `
        <h6>Name</h6> <p>${driverFullName}</p> <br>
      
        <h6>Driver's Identity Number </h6> <p>${driverIdNo}</p> <br>
        <h6>Date Of birth</h6> <p>${bateOfBirth}</p> <br>
        <h6>Phone Number(Home)</h6> <p>${phoneHome}</p> <br>
        <h6>Phone Number (Mobile)</h6> <p>${phoneMobile}</p> <br>
        <h6>I.D Card Number</h6> <p>${idNumber}</p> <br>
        <h6>Email</h6> <p>${email}</p>
    `;
    }
    
    
    const tableTr = (driver) => {
        return `
        <tr>
            <td> <strong>${driver.driverFullName}</strong></td>
            <td>${driver.driverIdNo}</td>
            <td>${driver.email}</td>
            <td>${driver.phoneMobile ? driver.phoneMobile : 'No Number yet'}</td>
           
            <td>
                <div class="d-flex">
                    <a class="btn w-30 btn-outline-secondary me-2" href="/drivers/${driver.driverUuid}"><i class="bx bx-edit-alt me-1"></i> </a>
                    <button id="driverShowBtn" type="button"  data-bs-toggle="modal" data-bs-target="#modalScrollable2" class="btn w-30 btn-info me-2" data-tid="${driver.driverUuid}"><i class="bx bx-show me-1"></i> </button>
                    <button id="driverDeleteBtn" data-tid=${driver.driverUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </div>
            </td>
        </tr>
    `;
    }
    
    const pagination  = (i, currentPage) => (`
        <li class="page-item ${ currentPage == i ? 'active' : ''}" page-number="${i}" id="pageNums">
            <a class="page-link" href="javascript:void(0);" id="pageNumsA">${i}</a>
        </li>
    `);
    
    const alertMsg = (alertColor, message) => {
        return `
            <div class="alert alert-${alertColor} alert-dismissible p-3" role="alert">
                ${message}
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
              </button>
            </div>
        `
    };
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter Chauffeur`;
    
    const fetchDrivers = async (page, search) => {
        tBody.innerHTML = '';
        const fetchDrivers = await fetch('/api/drivers?search='+search+'&&page='+page);
        const drivers = await fetchDrivers.json();
        if(drivers.message && drivers.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(drivers.status){
    
            drivers.data.map((driver) => {
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
            for(let i = 1; i <= drivers.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > drivers.totalPages){
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

        
    const APIDeleteData = async (data) => {
        const request = await fetch('/api/drivers', {
            method: 'POST',
            body: data
        });
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
            return;
        }

        if(!response.status){
            successDiv.innerHTML = response.message;
            successDiv.style.color = 'red';
        }else{
            const params = new URLSearchParams(window.location.search);
            const page = 1;
            const search = params.get('search') ? params.get('search') : '';
            successDiv.innerHTML = "Driver successfully deleted!";
            successDiv.style.color = 'green';
            await fetchDrivers(page, search);
        }
    }
    
    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        await fetchDrivers(page, search);
    });
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }
    
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        searchDriver.value = search;
        await fetchDrivers(page, search);
    
        if(document.querySelectorAll('#driverShowBtn')){
            driverShowBtns = document.querySelectorAll('#driverShowBtn');
            driverShowBtns.forEach((driverShowBtn) => {
                driverShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const driverId = driverShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/drivers', formData);
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
    
    
    document.addEventListener('mouseover', (e) => {
        e.stopPropagation();
        e.preventDefault();
        e.stopImmediatePropagation();
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        const search = params.get('search') ? params.get('search') : '';
        
        pageNums = document.querySelectorAll('#pageNums');
        pageNums.forEach((pageNum) => {
            pageNum.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                await fetchDrivers(parseInt(pageNum.getAttribute('page-number')), search);
                pageNums = document.querySelectorAll('#pageNums');
                setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
            }, false)
        });

        if(document.querySelectorAll('#driverDeleteBtn')){
            let driverDeleteBtns = document.querySelectorAll('#driverDeleteBtn');
            driverDeleteBtns.forEach((driverDeleteBtn) => {
                driverDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const driverId = driverDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }

        if(document.querySelector('.prev')){
            document.querySelector('.prev').addEventListener('click', async () => {
                if(document.querySelector('.prev').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.prev').classList.add('disabled');
                await fetchDrivers(page - 1, search)
                setQueryStringParameter('page', page - 1)
                document.querySelector('.prev').classList.remove('disabled');
            });
        }
    
        if(document.querySelector('.next')){
            document.querySelector('.next').addEventListener('click',async () => {
                if(document.querySelector('.next').classList.contains('disabled')){
                    return;
                }
                document.querySelector('.next').classList.add('disabled');
                await fetchDrivers(page + 1, search)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
    
        if(document.querySelectorAll('#driverShowBtn')){
            driverShowBtns = document.querySelectorAll('#driverShowBtn');
            driverShowBtns.forEach((driverShowBtn) => {
                driverShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const driverId = driverShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('driverId', driverId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/drivers', formData);
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
    
    addDriver.addEventListener('submit', async (e) => {
        addDriverBtn.innerHTML = loadingBtn;
        addDriverBtn.setAttribute('disabled', true)
        canDriverBtn.style.display = 'none';
        e.preventDefault();
     
            const formData = new FormData();
   
            const fullName = document.querySelector("[name='driverName']");
            const DoB = document.querySelector("[name='dob']");
            const phoneOne = document.querySelector("[name='phoneOne']");
            const phoneTwo = document.querySelector("[name='phoneTwo']");
            const idNumber = document.querySelector("[name='idNumber']");
            const driverEmail = document.querySelector("[name='driverEmail']");
            formData.append('fullName', fullName.value);
            formData.append('DoB', DoB.value);
            formData.append('phoneOne', phoneOne.value);
            formData.append('phoneTwo', phoneTwo.value);
            formData.append('idNumber', idNumber.value);
            formData.append('driverEmail', driverEmail.value);
            formData.append('method', 'POST');
            
  
            const fetching = await fetch('/api/add-driver', {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();

            
           if(response.message == "Réorienter"){
                document.location.href = "/logout" 
            }else if(response.status){
                setTimeout(async () => {
                    const inputParent = addDriver.querySelectorAll('#inputParent');
                    const selectParent = addDriver.querySelectorAll('#selectParent');
                    addDriverBtn.innerHTML = loadedBtn;
                    addDriverBtn.removeAttribute('disabled')
                    canDriverBtn.style.display = 'block';
    
                    successDiv.innerHTML = alertMsg('info', ` <p>email: <strong>${response.email}</strong></p><p> mot de passe est :<strong> ${response.Password}</strong></p>`)
    
                    inputParent.forEach((child) => {
                        child.querySelector('input').value = '';
                    })
                
                    selectParent.forEach((child) => {
                        child.querySelector('select').value = '';
                    })
        
                    setTimeout(() => {
                        document.location.href = '/drivers'
                    }, 5000);
                    
                },1500);
                
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addDriverBtn.innerHTML = loadedBtn;
                addDriverBtn.removeAttribute('disabled')
                canDriverBtn.style.display = 'block';
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
        fetchDrivers(page, searchValue);
        
    });

    searchDriverForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchValue = searchDriver.value ? searchDriver.value : '';
        const page = 1;
        setQueryStringParameter('search', searchValue);
        setQueryStringParameter('page', 1);
        fetchDrivers(page, searchValue);
    });

}else if(document.forms.updateDriver){
    const updateDriver = document.forms.updateDriver;
    const updateDriverBtn = document.getElementById('updateDriverBtn');
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Save changes`;

    updateDriver.addEventListener('submit', async (e) => {
        e.preventDefault();
        updateDriverBtn.innerHTML = loadingBtn;
        updateDriverBtn.setAttribute('disabled', true)
     
            const formData = new FormData();
    
            const fullName = document.querySelector("[name='driverName']");
            const DoB = document.querySelector("[name='dob']");
            const phoneOne = document.querySelector("[name='phoneOne']");
            const phoneTwo = document.querySelector("[name='phoneTwo']");
            const idNumber = document.querySelector("[name='idNumber']");
            const driverEmail = document.querySelector("[name='driverEmail']");
         
    
            formData.append('fullName', fullName.value);
            formData.append('DoB', DoB.value);
            formData.append('phoneOne', phoneOne.value);
            formData.append('phoneTwo', phoneTwo.value);
            formData.append('idNumber', idNumber.value);
            formData.append('driverEmail', driverEmail.value);
          
            formData.append('method', 'UPDATE');
            
            const fetching = await fetch('/api/drivers?did='+new URL(document.location.href).pathname.split('/').filter(n => n)[1] , {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
            document.querySelector('#pError').innerHTML = '';
            
           if(response.message == "Réorienter"){
                document.location.href = "/logout" 
            }else if(response.status){
                window.scrollTo({ 
                    top: 0, 
                    behavior: "smooth" });
                document.querySelector('#pError').innerHTML = "Chauffeur Mise à jour......";
                document.querySelector('#pError').style.color = 'green';
                setTimeout(async () => {
                    window.location.search = 's=u'
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                updateDriverBtn.innerHTML = loadedBtn;
                updateDriverBtn.removeAttribute('disabled')
                canDriverBtn.style.display = 'block';
            }
    })

    document.addEventListener('DOMContentLoaded', () => {
        let params = (new URL(document.location)).searchParams;
        if(params.get("s")){
            document.querySelector('#pError').innerHTML = "Chauffeur Mis à jour avec succés!";
            document.querySelector('#pError').style.color = 'green';

        }
    })
}