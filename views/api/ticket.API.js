
if(document.forms.addticketForm){ 
    const addordreErr = document.getElementById('addordreErr');
    const hotelSelect = document.getElementById('hotel');
    const libreSelect = document.getElementById('libre');
    const occupeSelect = document.getElementById('occupe');
       const paiment = document.getElementById('paiment');
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter`;
    const heure = document.querySelector('[name="heure"]');
    const adulte = document.querySelector('[name="adulte"]');
    const chambre = document.querySelector('[name="chambre"]');
    const enfant = document.querySelector('[name="enfant"]');
    const bebe = document.querySelector('[name="bebe"]');
    const client = document.querySelector('[name="client"]');
    const obeservation = document.querySelector('[name="obeservation"]');

    const APIGetRequest = async () => {
        try {
            // Fetch vehicles data
            const hotelsRequest = await fetch('/api/hotels?method=allhotels');
            const hotelsResponse = await hotelsRequest.json();
            
            // Process vehicles data
            hotelsResponse.data.forEach(hotel => {
                hotelSelect.insertAdjacentHTML('beforeend', `<div><option value="${hotel.hotelUuid}">${hotel.nom}</option></div>`);
              
            });
       
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







    const addticketForm = document.forms.addticketForm;
    const APIPostRequest = async(url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        })
        const response = await request.json();
        return response;
    };

    addticketForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData();
       
        let placeocu = parseInt(adulte.value, 10) + parseInt(enfant.value, 10) + parseInt(bebe.value, 10);
       
  if(placeocu > libreSelect.value){
    addordreErr.innerText = 'attention vous passe le nombre maximal';
    addordreErr.style.color = 'red';
    return;

  }
  
  else{
    placeocu =  parseInt(occupeSelect.value, 10) - parseInt(libreSelect.value, 10);
   placeocu = placeocu + parseInt(adulte.value, 10) + parseInt(enfant.value, 10) + parseInt(bebe.value, 10)
}



        formData.append('method', 'POST');
        formData.append('placeocu', placeocu);
        
        formData.append('enfant',enfant.value);
        formData.append('adulte',adulte.value);
        if(chambre!==null){
            formData.append('chambre',chambre.value);
        }
        formData.append('bebe',bebe.value);
        formData.append('hotel',hotelSelect.value);
        formData.append('client',client.value);
        formData.append('etat',paiment.value);
   
        formData.append('obeservation',obeservation.value);

 
        const response = await APIPostRequest('/api'+new URL(document.location.href).pathname, formData);
        if(response.message && response.message == "Réorienter"){
            document.location.href = "/logout";
            return;
        }

        if(!response.status){
            addticketForm.querySelector('button').removeAttribute('disabled');
            addticketForm.querySelector('button').innerHTML = loadedBtn;
            addordreErr.innerText = response.message;
            addordreErr.style.color = 'red';

        }else{
            addordreErr.innerText = response.message;
            addordreErr.style.color = 'green';

            setTimeout(() => {
               window.open('/ticket/' + response.numero, '_blank');
               document.location.href = '/ordres';
            }, 1000);
        }
    })
}
else if((new URL(document.location.href).pathname === '/tickets')){
    let hotelShowDeleteBtns;
    let hotelShowBtns;
    const searchDriver = document.querySelector('[name="searchDriver"]');
    const searchDriverBtn =document.getElementById('searchDriverBtn');
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

    const detailDivShow = ({numero,nom, depart,hotel,client, adulte, enfant, bebe }) => {
        return `
        <h6>numero ticket</h6> <p>${numero}</p> <br/>
        <h6>excursion</h6> <p>${nom}</p> <br/>
        <h6>depart</h6> <p>${depart}</p> <br/>
        <h6>hotel</h6> <p>${hotel}</p> <br/>
        <h6>client</h6> <p>${client}</p> <br/>
        <h6>num adulte</h6> <p>${adulte}</p> <br/>
        <h6>num enfant</h6> <p>${enfant}</p> <br/>
        <h6>num bebe</h6> <p>${bebe}</p> <br/>
        <h6>num total</h6> <p>${enfant + bebe + adulte}</p> <br/>
        `;
    }

    const tableTr = ({numero , nom ,nomh,excursion,etat,id}, role) => {
        if(role === 'superAdmin' || role === 'admin'){
            return`
            <tr>
                <td><strong>${numero}</strong></td>
                <td><strong>${nom}</strong></td>
                <td>${nomh}</td>
                <td>${excursion}</td>
                <td>${etat}</td>
                <td>
                    <a href="ticket/${id}" class="btn btn-outline-secondary"><i class="bx bx-edit "></i></a>
                    <button id="ticketShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="ticketDeleteBtn" data-tid=${id} class="btn btn-danger"><i class="bx bx-trash "></i></button>
                </td>
            </tr>
        `;
        }else{
            return`
            <tr>
            <td><strong>${numero}</strong></td>
            <td><strong>${nom}</strong></td>
            <td>${nomh}</td>
            <td>${excursion}</td>
                <td>
                    <button id="ticketShowBtn" data-tid=${id} class="btn btn-info" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
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
        const request = await fetch('/api/ticket?search='+search+'&&page='+page);
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
        const request = await fetch('/api/ticket', {
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
        if(document.querySelectorAll('#ticketDeleteBtn')){
            ticketDeleteBtns = document.querySelectorAll('#ticketDeleteBtn');
            ticketDeleteBtns.forEach((ticketDeleteBtn) => {
                ticketDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const ticketId = ticketDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ticketId', ticketId);
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
        if(document.querySelectorAll('#ticketDeleteBtn')){
            ticketDeleteBtns = document.querySelectorAll('#ticketDeleteBtn');
            ticketDeleteBtns.forEach((ticketDeleteBtn) => {
                ticketDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const ticketId = ticketDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ticketId', ticketId);
                    formData.append('method', 'DELETE');
                   
                    APIDeleteData(formData);
                });
            });
        }
        
        if(document.querySelectorAll('#ticketShowBtn')){
            ticketShowBtns = document.querySelectorAll('#ticketShowBtn');
            ticketShowBtns.forEach((ticketShowBtn) => {
                ticketShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const ticketId = ticketShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('ticketId', ticketId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/ticket', formData);
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

}