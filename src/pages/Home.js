import React from "react";

import { db, auth} from "../firebase.config"
import { useState, useEffect } from "react"
import {storage} from "../firebase.config";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';
// import {BrowserRouter as Router, Routes, Route, Link} from "react-router-dom";
// import { auth } from "../firebase.config"; 



import {
    collection,
    onSnapshot,
    doc,
    addDoc,
    deleteDoc
  } from "firebase/firestore"
  
  
   




function Home(){

    const [recipes, setRecipes] = useState([])
    const [form, setForm] = useState({
      title: "",
      desc: "",
      ingredients: [],
      steps: [],
      image: ""
    })
    const [popupActive, setPopupActive] = useState(false)

    const [query, setQuery] = useState("")

    const recipesCollectionRef = collection(db, "recipes")

  useEffect(() => {
    onSnapshot(recipesCollectionRef, snapshot => {
      setRecipes(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          viewing: false,
          ...doc.data()
        }
      }))
    })
  }, [])

  const handleView = id => {
    const recipesClone = [...recipes]

    recipesClone.forEach(recipe => {
      if (recipe.id === id) {
        recipe.viewing = !recipe.viewing
      } else {
        recipe.viewing = false
      }
    })

    setRecipes(recipesClone)
  }

  

      const handleSubmit = e => {
        e.preventDefault()
    
        if (
          !form.title ||
          !form.desc ||
          !form.ingredients ||
          !form.steps ||
          !form.image
        ) {
          alert("Please fill out all fields")
          return
        }
        setForm({
            title: "",
            desc: "",
            ingredients: [],
            steps: [],
            image: ""
          })
      
          setPopupActive(false)
        }

        const uploadImage=()=>{
          if (form.image == null) return;
          const imageRef= ref(storage, `images/${form.image.name+v4()}`);

          if (
            !form.title ||
            !form.desc ||
            !form.ingredients ||
            !form.steps ||
            !form.image
          ) {
            alert("Please fill out all fields")
            return
          }

          uploadBytes(imageRef, form.image).then( (snapshot)=>{
              alert("Image uploaded");
              getDownloadURL(snapshot.ref).then((url) => {
                  addDoc(recipesCollectionRef, {
                    title: form.title,
                    desc: form.desc,
                    imageUrl: url,
                    ingredients: form.ingredients,
                    steps:form.steps,
                    chef:{name: auth.currentUser.displayName , id:auth.currentUser.uid}
                    
                  })
                });
          
              });

              

              setForm({
                title: "",
                desc: "",
                ingredients: [],
                steps: [],
                image: ""
              })
          
              setPopupActive(false)
          
            };

        const handleIngredient = (e, i) => {
            const ingredientsClone = [...form.ingredients]
        
            ingredientsClone[i] = e.target.value
        
            setForm({
              ...form,
              ingredients: ingredientsClone
            })
          }
        
          const handleStep = (e, i) => {
            const stepsClone = [...form.steps]
        
            stepsClone[i] = e.target.value
        
            setForm({
              ...form,
              steps: stepsClone
            })
          }
        
          const handleIngredientCount = () => {
            setForm({
              ...form,
              ingredients: [...form.ingredients, ""]
            })
          }
        
          const handleStepCount = () => {
            setForm({
              ...form,
              steps: [...form.steps, ""]
            })
          }
        
          const removeRecipe = (id, imageUrl)=> {
            deleteDoc(doc(db, "recipes", id))
            deleteObject(ref(storage, imageUrl))
            
          }
          const closeform =()=>{
            setForm({
              title: "",
              desc: "",
              ingredients: [],
              steps: [],
              image: ""
            })
        
            setPopupActive(false)
          }

          const [isAuth, setIsAuth] = useState(localStorage.getItem("isAuth"));




    return (

        // {!isAuth ? <Link to="/login">Login</Link>: (
          
        //     <button onClick={signUserOut}>Log Out</button>
        //     )}


        <div className="App">
      <h1>My recipes</h1>

        <input placeholder="Enter Recipe Title" class="searchbar" onChange={event => setQuery(event.target.value)} />
        
    {isAuth? (<button class="addrecipe" onClick={() => setPopupActive(!popupActive)}>Add recipe</button>):(<></>)}
    {/* isAuth && (<button onClick={() => setPopupActive(!popupActive)}>Add recipe</button>); */}

      <div className="recipes">
        {recipes.filter(post => {
            if (query === '') {
              return post;
            } else if (post.title.toLowerCase().includes(query.toLowerCase())) {
              return post;
            }
          }).map((recipe) => (
          <div className="recipe" key={recipe.id}>
            <h3 class="recipe-title">{recipe.title}</h3>


            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              style={{ width: "100%", padding: 0 }}
            />




            <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>
            <h3 class="chef-name">@{recipe.chef.name}</h3>


            {/* <h3>@{recipe.chef.map((name,i))}</h3> */}


            {recipe.viewing && <div>
              <h4 class="titles">Ingredients</h4>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <div >
                    <li class="ingredient-list-items" key={i}>

                      {ingredient}

                    </li>
                  </div>
                ))}
              </ul>

              <h4 class="titles">Steps</h4>
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>}

            <div className="buttons">
              <button onClick={() => handleView(recipe.id)}>View {recipe.viewing ? 'less' : 'more'}</button>
              {isAuth && recipe.chef.id === auth.currentUser.uid && (
              <button className="remove" onClick={() => removeRecipe(recipe.id, recipe.imageUrl)}>Remove</button>
              )}
            </div>
          </div>
        ))}
      </div>
      

      {popupActive && <div className="popup">
        <div className="popup-inner">
          <h2 class="popup-add-recipe">ADD A NEW RECIPE</h2>

          <form onSubmit={handleSubmit} >

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                type="text"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })} />
            </div>

            <div className="form-group">
              <label>Ingredients</label>
              {
                form.ingredients.map((ingredient, i) => (
                 <textarea
                  type="text"
                  key={i}
                  value={ingredient===""?"• "+ingredient:ingredient}
                  onChange={e => handleIngredient(e, i)} />
                ))
              }
              <button type="button" onClick={handleIngredientCount}>Add ingredient</button>
            </div>

            <div className="form-group">
              <label>Steps</label>
              {
                form.steps.map((step, i) => (
                  <textarea
                    type="text"
                    key={i}
                    value={step===""?(i+1)+". "+step:step}
                    onChange={e => handleStep(e, i)} />
                ))
              }
              <button type="button" onClick={handleStepCount}>Add step</button>
            </div>


            {/* <div className="form-group">
              <label>Image</label>
              <input type="file" onChange={(e)=>setImageUpload(e.target.files[0])} />
              <button onClick={uploadImage}>Upload Image</button>
            </div> */}



            <div className="form-group">
              <label>Image</label>
              <input type="file" onChange={(e)=>setForm({...form, image:e.target.files[0]})} />
              {/* <button onClick={uploadImage}>Upload Image</button> */}
            </div>

            {/* {progress === 0 ? null : (
            <div className="progress">
              <div
                className="progress-bar progress-bar-striped mt-2"
                style={{ width: `${progress}%` }}
              >
                {`uploading image ${progress}%`}
              </div>
            </div>
          )} */}

          <button onClick={uploadImage}>Upload Image</button>


        



            <div className="buttons">
              <button type="submit">Submit</button>
              <button type="button" class="remove" onClick={closeform}>Close</button>
            </div>

          </form>
        </div>
      </div>}
    </div>
    );
}

export default Home;