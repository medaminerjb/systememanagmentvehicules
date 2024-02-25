if(document.forms.addWorkerFrom){    
    let genPassBtn;
  
    let workerDeleteBtns;
    
    const tBody = document.querySelector('.table-border-bottom-0');
    const deleteErr =document.getElementById('deleteErr');
    
    let explainCrime;
    let pageNums;
    
    
    const addWorkerForm = document.forms.addWorkerFrom;
    const canWorkerBtn = document.getElementById('canWorkerBtn');
    const addWorkerBtn = document.getElementById('addWorkerBtn');
    const successDiv = document.getElementById('successDiv');
    const pageNumbers = document.querySelector('.pagination');
    const closeDetails =document.getElementById('closeDetails');
    const detailsBody =document.getElementById('detailsBody');
    const genNewPassDiv =document.getElementById('genPass');
    const genPassBtnDiv =document.getElementById('genPassBtnDiv');
    document.addEventListener('click', () => {
        
      
        inputParent = document.querySelectorAll('#inputParent');
        selectParent = document.querySelectorAll('#selectParent');
        textareaParent = document.querySelectorAll('#textareaParent');
    
        pageNums = document.querySelectorAll('#pageNums');
    
        inputParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('input').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('input').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        selectParent.forEach((child) => {
            const msg = `Please select ${child.querySelector('label').innerText.toLowerCase()}`;
            child.querySelector('select').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('select').setAttribute('oninput', `this.setCustomValidity('')`)
        })
    
        textareaParent.forEach((child) => {
            const msg = `${child.querySelector('label').innerText.toLowerCase()} should not be empty`;
            child.querySelector('textarea').setAttribute('oninvalid', `this.setCustomValidity('${msg}');`)
            child.querySelector('textarea').setAttribute('oninput', `this.setCustomValidity('')`)
        })
        
    });
    const loadingDiv = `
            <div class="text-center fs-3">
                <i class='bx bx-loader-alt bx-spin fs-1'></i>
            </div>
    `;
    
    closeDetails.addEventListener('click', () => {
        detailsBody.innerHTML = loadingDiv;
    })
    
    const detailDivShow = ({fullName, bateOfBirth, phoneOne, phoneTwo, idNumber, userEmail}) => {
    
    
        return `
            <h6>Name</h6> <p>${fullName}</p> <br>
            <h6>Date Of birth</h6> <p>${bateOfBirth}</p> <br>
            <h6>Phone Number One</h6> <p>${phoneOne}</p> <br>
            <h6>Phone Number Two</h6> <p>${phoneTwo}</p> <br>
            <h6>I.D Card Number</h6> <p>${idNumber}</p> <br>
            <h6>Email</h6> <p>${userEmail}</p> <br>
      
        
            `;
    }
    
    const tableTr = (admin) => {
        return `
        <tr>
            <td> <strong>${admin.fullName}</strong></td>
            <td>${admin.userEmail}</td>
            <td>
${admin.userRole}
            
          
            
            </td>
            <td><span class="badge bg-label-primary me-1">${admin.userStatus}</span></td>
       
            <td>
                <div class="d-flex gap-10">
                    <a class="btn w-30 btn-outline-secondary me-2" href="workers/${admin.userUuid}"><i class="bx bx-edit-alt me-1"></i></a>
                    <button id="workerShowBtn" data-tid=${admin.userUuid} class="btn btn-info me-2" data-bs-toggle="modal" data-bs-target="#modalScrollable2"><i class="bx bx-show"></i></button>
                    <button id="workerDeleteBtn" data-tid=${admin.userUuid} class="btn btn-danger"><i class="bx bx-trash "></i></button>

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
    }
    
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Ajouter Employer`;
    
    
 
    
    const APIGet = async (url, formData) => {
        const request = await fetch(url, {
            method: 'POST',
            body: formData
        });
        const response = await request.json();
        return response;
    }
    
    const fetchWorkers = async (page) => {
        tBody.innerHTML = '';
        const fetchWorkers = await fetch('/api/workers?page='+page);
        const workers = await fetchWorkers.json();
        if(workers.message && workers.message == "Réorienter"){
            document.location.href = "/logout"
        }else if(workers.status){
    
            workers.data.map((worker) => {
                tBody.innerHTML += tableTr(worker);
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
            for(let i = 1; i <= workers.totalPages; i++){
                pageNumbers.innerHTML += pagination(i, page);
            }
            page++;
            if(page > workers.totalPages){
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
    
    window.addEventListener('popstate', async function () {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await fetchWorkers(page);
    });
    
    function setQueryStringParameter(name, value) {
        const params = new URLSearchParams(window.location.search);
        params.set(name, value);
        window.history.pushState({}, "", decodeURIComponent(`${window.location.pathname}?${params}`));
    }

    const APIDeleteData = async (data) => {
        const request = await fetch('/api/workers', {
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
            deleteErr.innerText = response.message;
            deleteErr.style.color = 'green';
            await fetchWorkers(page);
        }
    }
    
    document.addEventListener('DOMContentLoaded', async () => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page') ? parseInt(params.get('page')) : 1;
        await fetchWorkers(page);

        if(document.querySelectorAll('#workerDeleteBtn')){
            workerDeleteBtns = document.querySelectorAll('#workerDeleteBtn');
            workerDeleteBtns.forEach((workerDeleteBtn) => {
                workerDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workerId = workerDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
            });
        }
    
        if(document.querySelectorAll('#workerShowBtn')){
            workerShowBtns = document.querySelectorAll('#workerShowBtn');
            workerShowBtns.forEach((workerShowBtn) => {
                workerShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    genPassBtnDiv.innerHTML = '';
                    genNewPassDiv.innerHTML = '';
                    const workerId = workerShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/workers', formData);
                    if(response.message && response.message == "Réorienter"){
                        document.location.href = "/logout"
                        return;
                    }
    
                    if(response.status){
                        setTimeout(() => {
                            detailsBody.innerHTML = detailDivShow(response.data);
                            if(!document.getElementById('genPassBtn')){
                                genPassBtnDiv.innerHTML += `<button type="button" id="genPassBtn" class="btn btn-primary">Set New Password For Worker</button>`

                            }
                            genPassBtn = document.getElementById('genPassBtn');
                            genPassBtn.addEventListener('click', async (e) => {
                                genPassBtn.innerHTML = loadingBtn;
                                genPassBtn.setAttribute('disabled', true);
                                    const dataB = new FormData();
                                try {
                                    dataB.append('workerId', workerId);
                                    dataB.append('method', 'UPDATEPASS');
                                    const genRequest = await fetch('/api/workers', {
                                        method: 'POST',
                                        body: dataB
                                    });
                                    const genResponse = await genRequest.json();
                                    if(genResponse.message && genResponse.message == "Réorienter"){
                                        document.location.href = "/logout"
                                        return;
                                    }
                    
                                    if(genResponse.status){
                                        genNewPassDiv.innerHTML = `
                                        <div class="alert alert-info">
                                            <p>A new password is successfully set.</p>
                                            <p>New Password: <strong>${genResponse.newPassword}</strong></p>
                                        </div>`;

                                        genPassBtn.innerHTML = 'Set New Password For Worker';
                                        genPassBtn.removeAttribute('disabled');
                                    }
                                } catch (e) {
                                    console.log(e);
                                }
                            })
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
        
        pageNums = document.querySelectorAll('#pageNums');
        pageNums.forEach((pageNum) => {
            pageNum.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();
                e.stopImmediatePropagation();
                await fetchWorkers(parseInt(pageNum.getAttribute('page-number')));
                pageNums = document.querySelectorAll('#pageNums');
                setQueryStringParameter('page', parseInt(pageNum.getAttribute('page-number')));
            }, false)
        });

        if(document.querySelectorAll('#workerDeleteBtn')){
            workerDeleteBtns = document.querySelectorAll('#workerDeleteBtn');
            workerDeleteBtns.forEach((workerDeleteBtn) => {
                workerDeleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    const workerId = workerDeleteBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'DELETE');
                    APIDeleteData(formData);
                    /* d7c6c385-9919-401e-a63f-4d8246fd9f5d */
                });
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
                await fetchWorkers(page - 1)
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
                await fetchWorkers(page + 1)
                setQueryStringParameter('page', page+1)
                document.querySelector('.next').classList.remove('disabled');
            });
        }
    
        if(document.querySelectorAll('#workerShowBtn')){
            workerShowBtns = document.querySelectorAll('#workerShowBtn');
            workerShowBtns.forEach((workerShowBtn) => {
                workerShowBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    detailsBody.innerHTML = loadingDiv;
                    const workerId = workerShowBtn.getAttribute('data-tid');
                    const formData = new FormData();
                    formData.append('workerId', workerId);
                    formData.append('method', 'GET');
                    const response = await APIGet('/api/workers', formData);
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
        
    })
    
    
    
    addWorkerForm.addEventListener('submit', async (e) => {
        addWorkerBtn.innerHTML = loadingBtn;
        addWorkerBtn.setAttribute('disabled', true)
        canWorkerBtn.style.display = 'none';
        e.preventDefault();
            const formData = new FormData();
            const fullName = document.querySelector("[name='workerName']").value;
            const phoneMobile = document.querySelector("[name='phoneMobile']").value;
            const Email = document.querySelector("[name='email']").value;
            const DoB = document.querySelector("[name='dob']").value;

            const workerRole = document.querySelector("[name='workerRole']").value;
             
           
            formData.append('fullName', fullName);
            formData.append('DoB', DoB);
            formData.append('userRole', workerRole);
            formData.append('email', Email);
            formData.append('phoneMobile', phoneMobile);


            formData.append('method', 'POST');
            
            const fetching = await fetch('/api/add-worker', {
                method: 'POST',
                body: formData
            });
            const response = await fetching.json();
       
            
            if(response.message == "Réorienter"){
                document.location.href = "/logout"
            }else if(response.status){
                setTimeout(async () => {
                    addWorkerBtn.innerHTML = loadedBtn;
                    addWorkerBtn.removeAttribute('disabled')
                    canWorkerBtn.style.display = 'block';
    
                    successDiv.innerHTML = alertMsg('info', `<p>${response.message}</p> <p>Default Password: <strong>${response.Password}</strong></p>`)
    
                    setTimeout(() => {
                        document.location.href = '/workers'
                    }, 5000);
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addWorkerBtn.innerHTML = loadedBtn;
                addWorkerBtn.removeAttribute('disabled')
                canWorkerBtn.style.display = 'block';
                setTimeout(() => {
                    document.location.href = '/workers'
                }, 5000);
            }
    })

}else if(document.forms.updateWorkerFrom){
    const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
    const loadedBtn = `Modifier Employe`;
    const updateWorkerFrom = document.forms.updateWorkerFrom;

 
    
    const addWorkerBtn = document.getElementById('addWorkerBtn');

    updateWorkerFrom.addEventListener('submit', async (e) => {
        e.preventDefault();
        addWorkerBtn.innerHTML = loadingBtn;
        addWorkerBtn.setAttribute('disabled', true)
     
            const formData = new FormData();
            const workerRole = document.getElementById('workerRole');
            const fullName = document.querySelector("[name='workerName']").value;
            const DoB = document.querySelector("[name='dob']").value;
            const workerPhone1 = document.querySelector("[name='workerPhone1']").value;
            const workerPhone2 = document.querySelector("[name='workerPhone2']").value;
            const workerId = document.querySelector("[name='workerId']").value;
            const workerEmail = document.querySelector("[name='workerEmail']").value;
           
    
            formData.append('fullName', fullName);
            formData.append('DoB', DoB);
            formData.append('userRole', workerRole.value);
            formData.append('workerPhone1', workerPhone1);
            formData.append('workerPhone2', workerPhone2);
            formData.append('workerId', workerId);
            formData.append('workerEmail', workerEmail);

            formData.append('method', 'UPDATE');
            
            const fetching = await fetch('/api/workers?uid='+new URL(document.location.href).pathname.split('/').filter(n => n)[1], {
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
                document.querySelector('#pError').innerHTML = "Worker Mis à jour......";
                document.querySelector('#pError').style.color = 'green';
                setTimeout(async () => {
                    window.location.search = 's=u'
                },1500);
            }else{
                document.querySelector('#pError').innerHTML = response.message;
                document.querySelector('#pError').style.color = 'red';
                addWorkerBtn.innerHTML = loadedBtn;
                addWorkerBtn.removeAttribute('disabled')
            }
    });

    document.addEventListener('DOMContentLoaded', () => {
        let params = (new URL(document.location)).searchParams;
        if(params.get("s")){
            document.querySelector('#pError').innerHTML = "Worker Mis à jour avec succés!";
            document.querySelector('#pError').style.color = 'green';

        }
    })
}