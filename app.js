const BASE_URL = "https://62a3220121232ff9b21956d0.mockapi.io/student";
const PER_PAGE = 10;

async function getData(url) {
  let response = await fetch(url);
  if (response.status === 200) {
    let data = await response.json();

    return data;
  } else {
    throw new Error("not found ...");
  }
}

async function tableRender(page = 1) {
  const url = `${BASE_URL}?page=${page}&limit=${PER_PAGE}`;

  const data = await getData(url);

  const tbody = document.getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";

  data.forEach((element) => {
    const tr = tbody.insertRow();

    const checkbox = tr.insertCell();
    checkbox.innerHTML = `<label><input type="checkbox" class="checkbox" /> ${element.id} </label> `;
    const nameAvatar = tr.insertCell();
    nameAvatar.innerHTML = `<div class="flex items-center space-x-3">
             
                <div class="font-bold"> ${element.name}</div>
            </div>`;
    const family = tr.insertCell();
    family.innerHTML = element.family;
    const birthday = tr.insertCell();
    birthday.innerHTML = element.birthday;
    const mathGrade = tr.insertCell();
    mathGrade.innerHTML = element.mathGrade;
    const socialStudiesGrade = tr.insertCell();
    socialStudiesGrade.innerHTML = element.socialStudiesGrade;
    const persianGrade = tr.insertCell();
    persianGrade.innerHTML = element.persianGrade;
    
    
  });
}
tableRender(1);

async function pagination(page = 1) {
  let btnGroup = document.querySelector(".btn-group");
  const data = await getData(BASE_URL);
  const totalPage = data.length / PER_PAGE;
  for (let i = 1; i <= totalPage + 1; i++) {
    let btn = document.createElement("button");
    btn.innerHTML = i;
    btn.classList.add("btn");
    btnGroup.appendChild(btn);
    btn.onclick = () => {
      tableRender(i);
    };
  }
}

pagination();

const formAdd = document.querySelector(".form-add-user");

formAdd.onsubmit = async (e) => {
  e.preventDefault();

  let formData = new FormData(formAdd);
  let formD = Object.fromEntries(formData.entries());

  let response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formD),
  });

  tableRender();
  let result = await response.json();

  document.querySelector("#my-modal").checked = false;

  e.target.reset();
};

const formEdit = document.querySelector(".form-edit-user");
const btnEdit = document.querySelector("#btn-edit");

btnEdit.onclick = async (e) => {
  const checked = document.querySelector(".checkbox:checked");
  if (checked) {
    let id = +checked.parentNode.textContent;
    let user = await getData(`${BASE_URL}/${id}`);


    
    formEdit.elements.id.value = user.id;
    formEdit.elements.name.value = user.name;
    formEdit.elements.family.value = user.family;
    formEdit.elements.birthday.value = user.birthday;
    formEdit.elements.mathGrade.value = user.mathGrade;
    formEdit.elements.socialStudiesGrade.value = user.socialStudiesGrade;
    formEdit.elements.persianGrade.value = user.persianGrade;
  } else {
    e.preventDefault();
    alert("Please select a user");
  }
};

formEdit.onsubmit = async (e) => {
  e.preventDefault();
  let formData = new FormData(formEdit);
  let formD = Object.fromEntries(formData.entries());
  let id = formEdit.elements.id.value;
  console.log(id);
  await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formD),
  });

  tableRender();
  document.querySelector("#my-edit-modal").checked = false;
  e.target.reset();
};

const checkboxAll = document.querySelector(".check-all");

checkboxAll.addEventListener("change", (e) => {
  const checkbox = Array.from(document.querySelectorAll(".checkbox"));
  e.target.checked ? checkbox.forEach((item) => (item.checked = true)) : checkbox.forEach((item) => (item.checked = false));
});

const deleteBtn = document.querySelector(".btn-delete");

deleteBtn.addEventListener("click", async () => {

  deleteItem();
});

async function deleteItem() {
  const checkBoxes = Array.from(document.querySelectorAll(".checkbox:checked"));
  const ids = checkBoxes.map((item) => +item.parentNode.parentNode.textContent);

  await Promise.all(ids.map(runLoopItem));



  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    runLoopItem(id, i);
  }

  tableRender(1);
  console.log(checkBoxes);
}

async function runLoopItem(id, index) {
  await delay(index * 1000);
  await deleteDataAsync(id);
}

const delay = (time) => new Promise((resolve) => setTimeout(resolve, time));

async function deleteDataAsync(id) {
  await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json",
    },
  });
}