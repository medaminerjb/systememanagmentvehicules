const addSchoolBtn = document.getElementById('addSchool');
const schoolBtnDivs = document.getElementById('schoolFieldDiv');
let addCompanyBtn;

const workExpDiv = document.getElementById('experienceFieldDiv');
const expBtnDiv = document.getElementById('expBtnDiv');
const workExpRadio = document.querySelectorAll('[name="workingExp-radio"]');


const schoolInputs = `
<div class="row g-2 mt-2 mb-2" id="schoolInputDivs">
  <div class="col-sm-5 mb-0" id="inputParent">
    <label for="" class="form-label">School Name</label>
    <input type="text" id="workerSchName" class="form-control" placeholder="" required> 
    <small></small>
  </div>
  <div class="col-sm-4 mb-0" id="inputParent">
    <label for="" class="form-label">Location</label>
    <input type="text" id="workerSchLoc" class="form-control" placeholder="" required>
    <small></small>
  </div>
  <div class="col-sm-3 mb-2" id="inputParent">
    <label for="" class="form-label">Date Graduated</label>
    <input type="date" id="workerSchGrad" class="form-control" placeholder="" required>
    <small></small>
  </div>
  <div class="col-3 mt-2">
    <button type="button" id="removeSchool" class="btn btn-danger mb-3"><i class="bx bx-trash"></i></button>
  </div>
</div>
`

const companyInputs = `
<div class="row g-2 mt-2 mb-2" id="experienceInputDiv">
    <div class="col-sm-6 mb-0"  id="inputParent">
      <label for="" class="form-label">Company Name</label>
      <input type="text" id="workerExpCompany" name="workerExpCompany" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-3 mb-0"  id="inputParent">
      <label for="" class="form-label">Period (From)</label>
      <input type="number" id="workerExpFrom" name="workerExpFrom" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-3 mb-2"  id="inputParent">
      <label for="" class="form-label">Period (To)</label>
      <input type="number" id="workerExpTo" name="workerExpTo" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-12 mb-2"  id="inputParent">
      <label for="" class="form-label">Position</label>
      <input type="text" id="workerExpPosition" name="workerExpPosition" class="form-control" placeholder="" required>
      <small></small>
    </div>
    <div class="col-sm-12 mb-1" id="textareaParent">
      <label for="" class="form-label">Reason for Leaving</label>
      <textarea type="number" id="reasonForLeaving" name="reasonForLeaving" class="form-control" required></textarea>
      <small></small>
    <div class="col-3 mt-2">
        <button type="button" id="removeCompany" class="btn btn-danger mb-3"><i class="bx bx-trash"></i></button>
    </div>
    </div>
</div>
`;




