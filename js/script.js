const navTogglerBtn=document.querySelector(".nav-toggler");
const navMenu=document.querySelector(".custom-nav");
const menuTabs=document.querySelector(".menu-tabs");
const recipesList=document.getElementById("recipes-list");


window.addEventListener("load",function(){
    AOS.init(); /*------------ Scroll Aniamtion ----------------------------*/
    defaultDishesDisplay(); /*-----------------Show default menu on load ------------------------- */
    document.querySelector(".page-loader").classList.add("fade-out");
    document.querySelector(".page-loader").style.display="none";
})

function defaultDishesDisplay(){
    const url=`https://forkify-api.herokuapp.com/api/search?q=turkey`;
    getDataFromApi(url)
    .then(response=>{
        const recipes=JSON.parse(response).recipes;
        displayRecipesUI(recipes);
    })
}

const toggleNav=function(){
    navTogglerBtn.classList.toggle("active");
    navMenu.classList.toggle("open");
}

navTogglerBtn.addEventListener("click",function(){
    toggleNav();
})

// Close nav menu when you click nav item
document.addEventListener("click",function(event){
    if(event.target.closest(".nav-item")){
        toggleNav();
    }
})

//Header during scroll
document.addEventListener("scroll",function(){
    if(window.pageYOffset>60){
        document.querySelector("header").classList.add("scrolled");
    }else{
        document.querySelector("header").classList.remove("scrolled");
    }
})

//choose item in menu tab
menuTabs.addEventListener("click",function(event){
    if(event.target.classList.contains("menu-tab-item") && !event.target.classList.contains("active")){
        document.querySelector(".menu-tab-item.active").classList.remove("active");
        event.target.classList.add("active");
        const url=`https://forkify-api.herokuapp.com/api/search?q=${event.target.getAttribute('data-target')}`;
        getDataFromApi(url)
        .then(response=>{
            const recipes=JSON.parse(response).recipes;
            displayRecipesUI(recipes);
        });
    }
})

//show details of recipe
recipesList.addEventListener("click",function(event){
    if(event.target.classList.contains("btn")){
        const url=`https://forkify-api.herokuapp.com/api/get?rId=${event.target.closest(".menu-dish").id}`;
        getDataFromApi(url)
        .then(response=>{
            const recipe=JSON.parse(response).recipe;
            displayRecipeModalDetails(recipe);
        }).catch(error=>{
            displayRecipeModalDetails();
            console.log(error.message);
        });
    }
});


function getDataFromApi(url){
const promise =new Promise((resolve,reject)=>{
    const xhr=new XMLHttpRequest();
    xhr.open("GET",url);
    xhr.onload = function() {
        if (xhr.status == 200) {
          resolve(xhr.response);
        }
        else {
          reject(new Error("error msg reply from server happened"));
        }
      }

      xhr.onError=function(){
        reject(new Error("network error happened"));
    }
    xhr.send();
})
return promise;
}

function displayRecipesUI(recipes){
    const recipesList=document.getElementById("recipes-list");
    let recipesitemsEl=``;
    for (let index = 0; index < recipes.length; index++) {
        const element = recipes[index];
        recipesitemsEl +=`<div class="col-lg-3 col-md-6 col-12 h-100" data-aos="flip-left"
        data-aos-easing="ease-out-cubic">
        <div id="${element.recipe_id}" class="menu-dish">
          <div class="dish-img-container m-auto">
            <button class="btn btn-default" data-bs-toggle="modal" data-bs-target="#recipe-modal"> Details </button>
           <img class="img-fluid" src="${element.image_url}" alt="${element.title} image">
          </div>
          <div class="menu-dish-text d-flex justify-content-between align-items-center">
            <h3 class="dish-title">${element.title}</h3>
            <span class="dish-price d-inline-block ms-1 rounded-circle">14$</span>
         </div>
       </div>
     </div>`;
    }
    recipesList.innerHTML=recipesitemsEl;
}


function displayRecipeModalDetails(recipe){
    if(recipe){
        let ingredientsEl=``;
        for (let index = 0; index < recipe.ingredients.length; index++) {
            ingredientsEl+=` <li>${recipe.ingredients[index]}</li>`
        }
    
        let recipeModalEl=`<div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
            <h3 class="modal-title" id="recipe-modal-Label">${recipe.title}</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="m-auto text-center">
                    <img src=${recipe.image_url} class="img-fluid" alt="">
                </div>
                <ul>
                  ${ingredientsEl}
                </ul>
                <br>
                <div class="fs-5 fw-normal">Source <a href=${recipe.source_url} class="text-decoration-none ms-3 border border-2 p-md-2 rounded-pill">${recipe.publisher}</a></div>
            </div>
            <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>`;
    document.getElementById("recipe-modal").innerHTML=recipeModalEl;
    }
}
