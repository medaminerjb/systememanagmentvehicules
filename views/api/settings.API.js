const siteName = document.querySelector('[name="siteName"]');
const siteNumber1 = document.querySelector('[name="siteNumber1"]');
const siteNumber2 = document.querySelector('[name="siteNumber2"]');
const siteEmail = document.querySelector('[name="siteEmail"]');
const siteAdresse = document.querySelector('[name="siteAdresse"]');


const siteLogo = document.querySelector('[name="siteLogo"]');
const loadingBtn = `<i class='bx bx-loader-alt bx-spin'></i>`;
const loadedBtn = `Save`;
const settingsForm = document.forms.settingsForm;

settingsForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    this.querySelector('[type="submit"]').setAttribute('disabled', true);
    this.querySelector('[type="submit"]').innerHTML = loadingBtn;
    const formData = new FormData();
    formData.append('siteAdresse',siteAdresse.value);
    formData.append('siteEmail',siteEmail.value);
    formData.append('siteNumber1',siteNumber1.value);
    formData.append('siteNumber2',siteNumber2.value);
    formData.append('siteName', siteName.value);
    formData.append('logo', siteLogo.files[0]);


    const request = await fetch('/api/settings', {
        method: 'POST',
        body: formData
    });
    const response = await request.json();

    if(response.message === 'Réorienter'){
        document.location.href = '/logout';
        return;
    }

    if(!response.status){
        this.querySelector('#settingsErr').innerText = response.message;
        this.querySelector('#settingsErr').style.color = 'red';
        this.querySelector('[type="submit"]').removeAttribute('disabled');
        this.querySelector('[type="submit"]').innerHTML = loadedBtn;
    }else{
        setTimeout(() => {
            this.querySelector('#settingsErr').innerText = response.message;
            this.querySelector('#settingsErr').style.color = 'green';
            this.querySelector('[type="submit"]').removeAttribute('disabled');
            this.querySelector('[type="submit"]').innerHTML = loadedBtn;
            
        }, 1000);
    }

})
