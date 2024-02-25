
if(new URL(document.location.href).pathname === '/modelsvehicle'){
    const modelForm = document.forms.modelForm;
    const searchDriver = document.querySelector('[name="searchmodel"]');
    const searchDriverBtn =document.getElementById('searchmodelBtn');
    const searchDriverForm =document.forms.searchDriverForm;

    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter model`;

    const APIPostRequest = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        return await request.json();
    }

    const TypevSelect = document.getElementById('typev');

    const TypecSelect = document.getElementById('typec');




    
    const APIGetRequest = async () => {
        try {
            const driversRequest = await fetch('/api/typevehicle?method=GET&&methode=type');
            const driverResponse = await driversRequest.json();
            // select chauffeur
            driverResponse.data.forEach(type => {
                TypevSelect.insertAdjacentHTML('beforeend', `<option value="${type.vtypeUuid}">${type.vtype} ${type.placemi}-${type.placemx} places</option>`); });
       
            
       

        
        } catch (error) {
            // Handle errors
            console.error('Error fetching data:', error);
        }
    };
    document.addEventListener('DOMContentLoaded', async() => {
        await APIGetRequest();
    
    })

  
    modelForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
       
        const model = this.querySelector('[name="model"]');
        const place = this.querySelector('[name="place"]');
        const puissanceM = this.querySelector('[name="puissanceM"]');
        const puissanceA = this.querySelector('[name="puissanceA"]');

        const bvitesse = this.querySelector('[name="bvitesse"]');
        const reservoir = this.querySelector('[name="reservoir"]');
        
        
        const formData = new FormData();
     
     
        formData.append('model', model.value);
        formData.append('place', place.value);
        formData.append('puissanceM', puissanceM.value);
        formData.append('puissanceA', puissanceA.value);
        formData.append('bvitesse',bvitesse.value);

        formData.append('reservoir',reservoir.value);
        formData.append('typec', TypecSelect.value);

        formData.append('vtypeUuid', TypevSelect.value);
        formData.append('method', 'POST');
        const response = await APIPostRequest('/api/modelsvehicle', formData);
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
                document.location.href = '/modelsvehicle'
            }, 1000);
        }
    });

/* --------------------------------------------------------------------------------------- */
  
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

    const detailDivShow = ({model , vtype,puissanceA,puissanceM,bvitesse,reservoir,place ,id}) => {
        return `
          
            <h6>excursion</h6> <p>${model}</p> <br/>
            <h6>type de vehicule</h6> <p>${vtype}</p> <br/>
            <h6>puissance administrative</h6> <p>${puissanceA}</p> <br/>
            <h6>puissance moteur</h6> <p>${puissanceM}</p> <br/>
            <h6>boite vitesse</h6> <p>${bvitesse}</p> <br/>
            <h6>reservoir</h6> <p>${reservoir}</p> <br/>
            <h6>nombre de places</h6> <p>${place}</p> <br/>
       

            


        `;
    }

    const tableTr = ({model , vtype,puissanceA,puissanceM,bvitesse,reservoir,place ,id}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${model}</strong></td>
                <td>${vtype}</td>
                <td>${puissanceA}</td>
                <td>${puissanceM}</td>
                <td>${bvitesse}</td>
                <td>${reservoir}</td>
                <td>${place}</td>

                <td>
                    <a href="modelvehicle/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                    <button id="modelShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="modelDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
            <td><strong>${nom}</strong></td>
                <td><strong>${localisation}</strong></td>
              
                <td>
                    <button id="hotelShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
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
        const request = await fetch('/api/modelsvehicle?search='+search+'&&page='+page);
        const response = await request.json();
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(response.status){
    console.log(response.data);
    console.log('test');
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
        const request = await fetch('/api/modelsvehicle', {
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
        if(document.querySelectorAll('#modelDeleteBtn')){
            modelDeleteBtns = document.querySelectorAll('#modelDeleteBtn');
            modelDeleteBtns.forEach((modelDeleteBtn) => {
                modelDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const modelId = modelDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('modelId', modelId);
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
        await APIGetData(page,search);
        if(document.querySelectorAll('#modelDeleteBtn')){
            modelDeleteBtns = document.querySelectorAll('#modelDeleteBtn');
            modelDeleteBtns.forEach((modelDeleteBtn) => {
                modelDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const modelId = modelDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('modelId', modelId);
                    formData.append('method', 'DELETE');
                   
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#modelShowBtn')){
            modelShowBtns = document.querySelectorAll('#modelShowBtn');
            modelShowBtns.forEach((modelShowBtn) => {
                modelShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const modelId = modelShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('modelId', modelId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/modelsvehicle', formData);
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
}else if(document.forms.editmodel){
    const editmodel = document.forms.editmodel;
    const convertedDiv = document.getElementById('convertedDiv');
    const errDiv = document.getElementById('errDiv');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Modifier Excursion`;

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
    editmodel.addEventListener('submit', async function (e) {
        e.preventDefault();
        this.querySelector('[type="submit"]').setAttribute('disabled', true);
        this.querySelector('[type="submit"]').innerHTML = loadingBtn;
        const model = this.querySelector('[name="model"]');
        const place = this.querySelector('[name="place"]');
        const puissanceM = this.querySelector('[name="puissanceM"]');
        const puissanceA = this.querySelector('[name="puissanceA"]');
        const typev = document.getElementById('typev');
        const typec = document.getElementById('typec');
          const bvitesse = this.querySelector('[name="bvitesse"]');
        const reservoir = this.querySelector('[name="reservoir"]');
        
        
        const formData = new FormData();
     
     
        formData.append('model', model.value);
        formData.append('place', place.value);
        formData.append('puissanceM', puissanceM.value);
        formData.append('puissanceA', puissanceA.value);
        formData.append('bvitesse',bvitesse.value);

        formData.append('reservoir',reservoir.value)
        formData.append('vtypeUuid', typev.value);
        formData.append('typec', typec.value);
      
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
                document.location.href = '/modelsvehicle'
            }, 1000);
        }
    }); 
}