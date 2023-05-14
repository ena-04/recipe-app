import { db } from "./firebase.config"
import { useState, useEffect } from "react"
import {storage} from "./firebase.config";
import {ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage";
import {v4} from 'uuid';

import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc
} from "firebase/firestore"

function App() { 
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
    image: ""
  })
  const [popupActive, setPopupActive] = useState(false)

  // const [progress, setProgress] = useState(0);

  // const [imageUpload, setImageUpload]=useState(null);

  // const uploadImage=()=>{
  //   if (imageUpload == null) return;
  //   const imageRef= ref(storage, `images/${imageUpload.name+v4()}`);
  //   uploadBytes(imageRef, imageUpload).then( ()=>{
  //     alert("Image uploaded");

  //   });



  



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

  const uploadImage=()=>{
    if (form.image == null) return;
    const imageRef= ref(storage, `images/${form.image.name+v4()}`);
    uploadBytes(imageRef, form.image).then( (snapshot)=>{

      // const progressPercent = Math.round(
      //   (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      // );
      // setProgress(progressPercent);
      alert("Image uploaded");
      // setProgress(0);

      

      getDownloadURL(snapshot.ref).then((url) => {
        addDoc(recipesCollectionRef, {
          title: form.title,
          desc: form.desc,
          imageUrl: url,
          ingredients: form.ingredients,
          steps:form.steps
          
        })
      });

    });

  };

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

    // addDoc(recipesCollectionRef, {
    //   title: form.title,
    //   description: form.desc,
    //   imageUrl: url,
    //   ingredients: form.ingredients,
    //   steps:form.steps
      
    // })

    setForm({
      title: "",
      desc: "",
      ingredients: [],
      steps: [],
      image: ""
    })

    setPopupActive(false)
  }




  







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

  // const storageRef = imageUrl => {
  //   ref(storage, imageUrl)
    
  // }
  // const removeImage= storageRef=>{
  //   deleteObject(storageRef)
  // }






  // const recipesClone = [...recipes]

  //   recipesClone.forEach(recipe => {
  //     if (recipe.id === id) {
  //       recipe.viewing = !recipe.viewing
  //     } else {
  //       recipe.viewing = false
  //     }
  //   })

  // const ingredientsBox=[...form.ingredients]
  // const [checkedState, setCheckedState] = useState(



  //   ingredientsBox.fill(false)
  // )
  // const handleOnChange = (position) => {
  //   const updatedCheckedState = checkedState.map((item, index) =>
  //     index === position ? !item : item
  //   );

  //   setCheckedState(updatedCheckedState);
  // };





  return (
    <div className="App">
      <h1>My recipes</h1>

        <input placeholder="Enter Post Title" onChange={event => setQuery(event.target.value)} />
        
      <button onClick={() => setPopupActive(!popupActive)}>Add recipe</button>

      <div className="recipes">
        {recipes.filter(post => {
            if (query === '') {
              return post;
            } else if (post.title.toLowerCase().includes(query.toLowerCase())) {
              return post;
            }
          }).map((recipe, i) => (
          <div className="recipe" key={recipe.id}>
            <h3>{recipe.title}</h3>


            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              style={{ width: "100%", padding: 10 }}
            />




            <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>

            {recipe.viewing && <div>
              <h4>Ingredients</h4>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <div >
                    <li class="ingredient-list-items" key={i}>

                      {ingredient}

                    </li>
                  </div>
                ))}
              </ul>

              <h4>Steps</h4>
              <ol>
                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>}

            <div className="buttons">
              <button onClick={() => handleView(recipe.id)}>View {recipe.viewing ? 'less' : 'more'}</button>
              <button className="remove" onClick={() => removeRecipe(recipe.id, recipe.imageUrl)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
      

      {popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Add a new recipe</h2>

          <form onSubmit={handleSubmit}>

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
                  <input
                    type="text"
                    key={i}
                    value={ingredient}
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
                    value={step}
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
              <button type="button" class="remove" onClick={() => setPopupActive(false)}>Close</button>
            </div>

          </form>
        </div>
      </div>}
    </div>
  );
}

export default App;