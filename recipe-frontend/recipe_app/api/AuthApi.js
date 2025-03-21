async function basicFetch(url, payload) {
    const res = await fetch(url, payload)
    const body = await res.json()
    return body
  }


export async function signup(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context)
}
  try {
    const body = await basicFetch("http://127.0.0.1:8000/signup", payload);
    if (body.token) {
        localStorage.setItem("token", body.token);
        return { success: true, token: body.token };
    } else {
        return { success: false, error: body.error || "Signup failed. Please try again." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function login(context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context)
}
try {
  const body = await basicFetch("http://127.0.0.1:8000/get-token", payload);
  if (body.token) {
      // Store the token in localStorage
      localStorage.setItem("token", body.token);
      return { success: true, token: body.token };
  } else {
      return { success: false, error: body.error || "Login failed. Please try again." };
  }
} catch (error) {
  return { success: false, error: error.message };
}
}

