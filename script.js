// Import the functions you need from the SDKs you need
import {
    initializeApp,

} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";

import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut

} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js";

import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js";
import {
  getFirestore, getDocs, doc,
    collection, addDoc, deleteDoc

} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAwd8-VkNSEJpBVVO5E3594x1jqiqEPcDA",
  authDomain: "blog-app-ead54.firebaseapp.com",
  projectId: "blog-app-ead54",
  storageBucket: "blog-app-ead54.appspot.com",
  messagingSenderId: "127655680320",
  appId: "1:127655680320:web:ad343a803d9c375f23c2a5",
  measurementId: "G-7ZK1C708HL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const logInForm = document.getElementById('LoginBtn')
const SignUpForm = document.getElementById('SignUpBtn')
const addInfo = document.getElementById('addInfo')
const logout = document.getElementById('logout')
const todoInput = document.getElementById('todo_input')
const todosContainer = document.getElementById('todos_container')


// onAuthStateChanged(auth, (user) => {
//   if (user) {
//       // User is signed in, see docs for a list of available properties
//       // https://firebase.google.com/docs/reference/js/auth.user
//       const uid = user.uid;
//       console.log('user is logged in')

//       userEmail.innerText = `User email is ${user.email} and User uid is ${uid}`
//       getTodos()
//       // ...
//   } else {
//       // User is signed out
//       window.location.href = "index.html"
//       // ...
//   }
// });

const db = getFirestore(app);

const todosCollectionRef = collection(db, 'todos')


SignUpForm?.addEventListener('submit', e => {
    e.preventDefault()
    console.log('e+++' ,     e.target[0].value,
    )
    console.log(e.target.value)
    const auth = getAuth();
    const userInfo = {
      fullname: e.target[0].value,
      email: e.target[1].value,
      password: e.target[2].value
    }
  createUserWithEmailAndPassword(auth, userInfo.email , userInfo.password)
    .then((userCredential) => {
      // Signed up 
      window.location.href = 'main.html'
      const user = userCredential.user;
      console.log('user->', user)
        })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
      
      console.log(e);
    })

logInForm?.addEventListener('submit', e => {
    e.preventDefault()
    console.log(e.target[0].value)
    const userInfo = {
      email: e.target[0].value,
      password: e.target[1].value
    }
    signInWithEmailAndPassword(auth, userInfo.email, userInfo.password)
      .then((userCredential) => {
        window.location.href = 'main.html'
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
      });
})
logout?.addEventListener('click', () => {
  signOut(auth).then(() => {
      // Sign-out successful.
      console.log('signedout')
      window.location.href = 'index.html'
  }).catch((error) => {
      // An error happened.
      console.log('signedout', error)

  });
})

    
    console.log(app);
    console.log(auth);

//DB Section--->

addInfo?.addEventListener('click', async () => {
  if (!todoInput.value) return alert('Please add todo')
  try {
      const docAdded = await addDoc(todosCollectionRef, {
          todo: todoInput.value
      });
      todoInput.value = ''
      getTodos()
      console.log("Document written with ID: ", docAdded);
  } catch (e) {
      console.error("Error adding document: ", e);
  }
})

getTodos()


async function getTodos() {
  todosContainer.innerHTML = null
  const querySnapshot = await getDocs(todosCollectionRef);
  querySnapshot.forEach((todoDoc) => {
      const todoObj = todoDoc.data()
      const div = document.createElement('div')
      div.className = 'todo-div'
      const span = document.createElement('span')
      span.innerText = todoObj.todo
      const button = document.createElement('button')
      button.innerText = 'Delete'
      button.id = todoDoc.id

      button.addEventListener('click', async function () {
          console.log(this)

          const docRef = doc(db, 'todos', this.id)
          console.log(docRef)
          await deleteDoc(docRef)
          getTodos()
      })

      div.appendChild(span)
      div.appendChild(button)

      todosContainer.appendChild(div)

  });
}