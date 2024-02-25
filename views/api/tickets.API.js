let excursionDeleteBtns;
let excursionShowBtns;

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
    deleteErr.innerText = response.message;
    deleteErr.style.color = 'green';

    setTimeout(() => {
        location.reload();
     }, 1000);

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
location.reload();
});


document.addEventListener('mouseover', () => {
const pageNums = document.querySelectorAll('#pageNums');
const params = new URLSearchParams(window.location.search);
const page = params.get('page') ? parseInt(params.get('page')) : 1;
if(document.querySelectorAll('#ordreDeleteBtn')){
    ordreDeleteBtns = document.querySelectorAll('#ordreDeleteBtn');
    ordreDeleteBtns.forEach((ordreDeleteBtn) => {
        ordreDeleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            const ticketId = ordreDeleteBtn.getAttribute('data-tid');
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
        await APIGetData(page - 1)
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
        await APIGetData(page + 1)
        setQueryStringParameter('page', page+1)
        document.querySelector('.next').classList.remove('disabled');
    });
}



});

document.addEventListener('DOMContentLoaded', async () => {
const params = new URLSearchParams(window.location.search);
const page = params.get('page') ? parseInt(params.get('page')) : 1;
if(document.querySelectorAll('#ordreDeleteBtn')){
    ordreDeleteBtns = document.querySelectorAll('#ordreDeleteBtn');
    ordreDeleteBtns.forEach((ordreDeleteBtn) => {
        ordreDeleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            const ticketId = ordreDeleteBtn.getAttribute('data-tid');
            const formData = new FormData();
            formData.append('ticketId', ticketId);
            formData.append('method', 'DELETE');
           
            APIDeleteData(formData);
        });
    });
}

if(document.querySelectorAll('#ordreShowBtn')){
    excursionShowBtns = document.querySelectorAll('#ordreShowBtn');
    excursionShowBtns.forEach((ordreShowBtn) => {
        ordreShowBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            e.preventDefault();
            e.stopImmediatePropagation();
            detailsBody.innerHTML = loadingDiv;
            const ticketId = ordreShowBtn.getAttribute('data-tid');
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