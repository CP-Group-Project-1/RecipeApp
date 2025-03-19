async function basicFetch(url, payload) {
    // original code below
    // const res = await fetch(url, payload)
    // const body = await res.json()
    // return body
    
    // updated with assuming we use cookies for token instead of local storage
    try {
      const res = await fetch(url, {
        ...payload,
        credentials: "include", // Ensures cookies are sent with requests
      });
  
      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }
  
      return await res.json();
    } catch (error) {
      console.error("API Fetch Error:", error);
      return { error: error.message };
    }
  }


export async function signup(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context),
    credentials: "include",
}
const body = await basicFetch("http://127.0.0.1:8000/user_accounts/signup",payload)

// Assuming token is stored via HTTP-cookies, token will not be store locally
// Storing token for authentication, can enable if we want local storage
// if (body.token) {
//   localStorage.setItem("token", body.token); 
// }

return body;
}


export async function login(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context),
    credentials: "include",
}
const body = await basicFetch("http://127.0.0.1:8000/user_accounts/login", payload)


// below is for local token storage, less secure
// if (body.token) {
//   localStorage.setItem("token", body.token); 
// }

return body
}


// for logout when we create it
export async function logout() {
  const response = await fetch("http://127.0.0.1:8000/user_accounts/logout", {
    method: "POST",
    credentials: "include",
  });

  return response.ok ? "Logged out" : "Logout failed";
}

