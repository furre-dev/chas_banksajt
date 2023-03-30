import {useEffect, useState} from "react"

function App() {
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [balanceInput, setBalanceInput] = useState();
  const [loggedIn, setLoggedIn] = useState(false)

  async function handleAdd(username, password, balance){
      try {
        const res = await fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({"username": username, "password": password, "balance": balance}),
        });

      } catch (error) {
        console.log(error);
      }
  }
  
  useEffect(() => {
    ebem()
    async function ebem(){
    const response = await fetch("http://localhost:5000/");
    const data = await response.json();
    console.log(data)
  }
  }) 

  return (
    <div className="w-screen h-screen flex justify-center items-center space-x-10">
      <div className="flex flex-col w-max space-y-3 justify-center items-center">
        <h1 className="text-2xl">Create new account!</h1>
      <input onChange={(e) => setUsernameInput(e.target.value)} className="p-1 rounded-lg border border-black" placeholder="Username" />
      <input onChange={(e) => setPasswordInput(e.target.value)} className="p-1 rounded-lg border border-black" placeholder="Password" type={"password"}/>
      <input onChange={(e) => setBalanceInput(e.target.value)} type={"number"} className="p-1 rounded-lg border border-black" placeholder="Balance" />
     <button 
     className="bg-red-400 px-2 py-1 text-white rounded-lg"
     onClick={() => handleAdd(usernameInput, passwordInput, balanceInput)}>Create</button>
     </div>
     <div className="h-[300px] w-[1px] bg-black" />
     <div className="flex flex-col justify-center items-center space-y-3">
      <h1 className="text-2xl">Log in</h1>
      <input className="p-1 rounded-lg border border-black" placeholder="Username" />
      <input className="p-1 rounded-lg border border-black" placeholder="Password" type={"password"}/>
      {!loggedIn ? <button 
     className="bg-red-500 px-2 py-1 text-white rounded-lg">Log in</button>
    :
    <button 
     className="bg-green-500 px-2 py-1 text-white rounded-lg">Logged in</button>
    }
     
     {loggedIn ? <div className="flex flex-col items-center">
     <button 
     className="bg-red-400 px-2 py-1 text-white rounded-lg">Hide balance</button>
     <p>Balance: 0</p>
     </div>:
     <div className="hidden">
     <button 
     className="bg-red-400 px-2 py-1 text-white rounded-lg">Hide balance</button>
     <p>Balance: 0</p>
     </div>
     }
     </div>
    </div>
  )
}

export default App
