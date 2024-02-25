
if(new URL(document.location.href).pathname === '/carburants'){
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
    const searchDriverForm =document.forms.searchDriverForm;
        let carburantdeletebtns;
        const tBody = document.querySelector('.table-border-bottom-0');
        const filterSelect = document.querySelector('#smallSelect');
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
    
        const detailDivShow = ({regisNumber, nom,date,obeservation,fullName,prix,quantite,total,driverFullName}) => {
            return `
                <h6>type de Mission</h6> <p>${nom}</p> <br/>
                <h6>date </h6> <p>${date}</p> <br/>
                <h6>Matricel Voiture</h6> <p>${regisNumber}</p> <br/>
                <h6>Nom de Chauffeur</h6> <p>${driverFullName}</p> <br/>
                <h6>Obeservation</h6> <p>${obeservation}</p> <br/>
                <h6>Quantite en Litre </h6> <p>${quantite}</p> <br/>
                <h6>Prix en dinar</h6> <p>${prix}</p> <br/>
                <h6>total en dinar</h6> <p>${total}</p> <br/>
                <h6>ajouter par</h6> <p>${fullName}</p> <br/>
          
            `;
        }
        const tableTr = ({ id,regisNumber, nom, date,total,obeservation}, role) => {
    
            if (role === 'superAdmin' || role === 'admin') {
              
              return `
                <tr>
                  <td><strong>${regisNumber}</strong></td>
                  <td>${nom}</td>
                  <td>${date} </td>
                  <td>${total} </td>
                  <td>${obeservation}</td>
    
                  <td>
                  <a href="carburants/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                    <button id="carburantshowbtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="carburantdeletebtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
    
                    </td>
                </tr>
              `;
            }
          else{
            
                return`
                <tr>
                <td><strong>${regisNumber}</strong></td>
                <td>${nom}</td>
                <td>${date} </td>
                <td>${total} </td>
                    <td>
                    <button id="carburantshowbtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
    
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
          
            const request = await fetch('/api/carburants?search='+search+'&&page='+page);
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
            const request = await fetch('/api/carburants', {
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
            const filter = params.get('filter') ? params.get('filter') : 'all';
            const search = params.get('search') ? params.get('search') : '';
            if(document.querySelectorAll('#carburantdeletebtn')){
                carburantdeletebtns = document.querySelectorAll('#carburantdeletebtn');
                carburantdeletebtns.forEach((carburantdeletebtn) => {
                    carburantdeletebtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        const carburantId = carburantdeletebtn.getAttribute('data-tid');
                        const formData = new FormData();
                        formData.append('carburantId', carburantId);
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
                        await APIGetData(parseInt(pageNum.getAttribute('page-number')), filter,search);
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
            if(document.querySelectorAll('#carburantdeletebtn')){
                carburantdeletebtns = document.querySelectorAll('#carburantdeletebtn');
                carburantdeletebtns.forEach((carburantdeletebtn) => {
                    carburantdeletebtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        const carburantId = carburantdeletebtn.getAttribute('data-tid');
                        const formData = new FormData();
                        formData.append('carburantId', carburantId);
                        formData.append('method', 'DELETE');
                        APIDeleteData(formData);
                    });
                });
            }
            if(document.querySelectorAll('#carburantshowbtn')){
          
                carburantshowbtns = document.querySelectorAll('#carburantshowbtn');
                carburantshowbtns.forEach((carburantshowbtn) => {
                    carburantshowbtn.addEventListener('click', async (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        detailsBody.innerHTML = loadingDiv;
                     
                        const carburantId = carburantshowbtn.getAttribute('data-tid');
                        const formData = new FormData();
                        formData.append('carburantId', carburantId);
                        formData.append('method', 'GET');
                        const response = await APIGet('/api/carburants', formData);
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
  
        
            setQueryStringParameter('page', 1);
            setQueryStringParameter('search', searchValue);
            APIGetData(page, searchValue);
        });
     
    }
    else{
       
        const excursionSelect = document.getElementById('select_box');
        const vehicleSelect = document.getElementById('select_box2');
        const departSelect = document.getElementById('select_box4');
        const driversSelect = document.getElementById('select_box3');
        const ordreSelect = document.getElementById('select_box5');
        const addcarburanterr = document.getElementById('addcarburanterr');
       
        const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
        const loadedBtn = `Ajouter`;
        const depart = document.querySelector('[name="depart"]');
        const date = document.querySelector('[name="date"]');
        const typec = document.querySelector('[name="type"]');
        const arrive = document.querySelector('[name="arrive"]');
        const quantite = document.querySelector('[name="quantite"]');
        const prix =document.querySelector('[name="prix"]');
    
        const obeservation = document.querySelector('[name="obeservation"]');
        const addcarburant = document.forms.addcarburant;
        const editcarburant = document.forms.editcarburant;
    
        const APIPostRequest = async(url, formData) => {
            const request = await fetch(url, {
                method: 'POST',
                body: formData
            })
            const response = await request.json();
            return response;
        };
         if(document.forms.addcarburant){
        addcarburant.addEventListener('submit', async (e) => {
            e.preventDefault();
            addcarburant.querySelector('button').setAttribute('disabled', true);
            addcarburant.querySelector('button').innerHTML = loadingBtn;
            const formData = new FormData();
            const currentDate = new Date();
          
            // Get the year, month, and day
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with 0 if needed
            const day = String(currentDate.getDate()).padStart(2, '0'); // Pad with 0 if needed
            const etat = document.getElementById('etat');

            // Create the formatted date string
            const formattedDate = `${year}-${month}-${day}`;
            const diff = arrive.value - departSelect.value;
            const total = prix.value * quantite.value;
            formData.append('diff',diff);
            formData.append('method', 'POST');
            formData.append('type', 'addkilometerge');
            formData.append('total',total);
            formData.append('prix',prix.value);
            formData.append('quantite',quantite.value);
       
            formData.append('date', date.value);
            formData.append('typec', typec.value);
            formData.append('depart', departSelect.value);
            formData.append('arrive', arrive.value);
            if(etat.value!=='bien')
        {
            formData.append('etat',etat.value);
        }
      
            formData.append('ordreId',ordreSelect.value);
            formData.append('obeservation',obeservation.value);
            formData.append('driverUuid',driversSelect.value);
            formData.append('vehicleUuid', vehicleSelect.value);
            formData.append('excursionUuid', excursionSelect.value);
           
            const response = await APIPostRequest('/api/carburants', formData);
            if(response.message && response.message == "Réorienter"){
                document.location.href = "/logout";
                return;
            }
    
            if(!response.status){
                addcarburant.querySelector('button').removeAttribute('disabled');
                addcarburant.querySelector('button').innerHTML = loadedBtn;
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
        else if(document.forms.editcarburant){
        editcarburant.addEventListener('submit', async (e) => {
            e.preventDefault();
            editcarburant.querySelector('button').setAttribute('disabled', true);
            editcarburant.querySelector('button').innerHTML = loadingBtn;
            const formData = new FormData();
          
          
          
           
            const total = prix.value * quantite.value;
        
            
            formData.append('total',total);
            formData.append('prix',prix.value);
            formData.append('quantite',quantite.value);
            formData.append('date', date.value);
            formData.append('typec', typec.value);
            formData.append('obeservation',obeservation.value);
            formData.append('driverUuid',driversSelect.value);
            formData.append('vehicleUuid', vehicleSelect.value);
            formData.append('excursionUuid', excursionSelect.value);
            formData.append('method', 'UPDATE');
            
            const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
            if(response.message && response.message == "Réorienter"){
                document.location.href = "/logout";
                return;
            }
    
            if(!response.status){
                addcarburant.querySelector('button').removeAttribute('disabled');
                addcarburant.querySelector('button').innerHTML = loadedBtn;
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