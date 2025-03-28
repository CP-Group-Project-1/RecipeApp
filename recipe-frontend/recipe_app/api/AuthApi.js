export async function basicFetch(url, payload) {
    // console.log(`in basic fetch`)
    // console.log(`url = ${url} \n payload = ${JSON.stringify(payload)}`)
    const res = await fetch(url, payload)
    const body = await res.json()
    return body
  }


export async function signup(baseUrl, context) {
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify(context),
};
  try {
    // console.log(`in sign up`)
    // console.log(`baseUrl = ${baseUrl} \n payload = ${JSON.stringify(payload)}`)
    const body = await basicFetch(`${baseUrl}/user_accounts/signup`, payload);
    if (body.token) {
        localStorage.setItem("token", body.token);
        window.dispatchEvent(new Event("auth-change"));
        return { success: true, token: body.token };
    } else {
        return { success: false, error: body.error || "Signup failed. Please try again." };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}


export async function login(context, baseUrl) {
    // console.log(`in login`)
const payload = {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: context.email,
      password: context.password,
    }),
};
try {
  //const body = await basicFetch("http://127.0.0.1:8000/user_accounts/get-token", payload);
//   console.log(`baseUrl = ${baseUrl} \n payload = ${JSON.stringify(payload)}`)
  const body = await basicFetch(`${baseUrl}/user_accounts/get-token`, payload);
  
  if (body.token) {
      // Store the token in localStorage
      localStorage.setItem("token", body.token);
      window.dispatchEvent(new Event("auth-change"));
      return { success: true, token: body.token };
  } else {
      return { success: false, error: body.error || "Login failed. Invalid token." };
  }
} catch (error) {
  return { success: false, error: error.message };
}
}

export async function saveRecipe(userId, context, baseUrl) {
    /*console.log('IN_saveRecipe')
    console.log(`userId = ${userId}`)
    console.log(`Getting token from local storage => [${localStorage.getItem('token')}]`)
    console.log(`context = ${JSON.stringify(context)}`)
    console.log(`baseUrl = [${baseUrl}]`)*/
    const payload = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(context),  
    };
    //console.log(`payload = ${JSON.stringify(payload)}`)
    //console.log(`EP= ${`${baseUrl}/saved_recipes/user/${userId}/`}`)
    try {
        const body = await basicFetch(
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            `${baseUrl}/saved_recipes/user/${userId}/`,
            payload
        );
        if (body) {
            //console.log("Recipe saved successfully:", body);
            return { success: true, data: body };
        } else {
            console.log(`error ${body.error}`)
            return { success: false, error: body.error || "Failed to save recipe." };
        }
    } catch (error) {
        console.error("Error saving recipe:", error);
        return { success: false, error: error.message };
    }
}

export async function getRecipe(baseUrl, userId) {
    //console.log('IN_getRecipe')
    //console.log(`userId = ${userId}`)
    //console.log(`Getting token from local storage => [${localStorage.getItem('token')}]`)
  
    const payload = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
    };
    //console.log(`payload = ${JSON.stringify(payload)}`)
    try {
        const body = await basicFetch(
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/`, 
            `${baseUrl}/saved_recipes/user/${userId}/`,
            payload
        );
        if (body) {
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to get recipe." };
        }
    } catch (error) {
        console.error("Error getting recipe:", error);
        return { success: false, error: error.message };
    }
}

export async function deleteRecipe(baseUrl,userId, recipeId){

    const payload = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Token ${localStorage.getItem('token')}`
        },
    };
    try {
        const body = await basicFetch(
            //`http://127.0.0.1:8000/saved_recipes/user/${userId}/recipe/${recipeId}/`,
            `${baseUrl}/saved_recipes/user/${userId}/recipe/${recipeId}/`,
            payload
        );
        if (body) {
            return { success: true, data: body };
        } else {
            return { success: false, error: body.error || "Failed to delete recipe." };
        }
    } catch (error) {
        console.error("Error deleting recipe:", error);
        return { success: false, error: error.message };
    }

    

}


export const logout = (setAuth) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user_id");
  setAuth(false);
  // Trigger custom event
  window.dispatchEvent(new Event("auth-change"));
}



export async function saveShoppingList(token, meals, baseUrl) {
    console.log('IN_saveShoppingList')
  const payload = {
      method: "POST",
      headers: {
          "Content-Type": "application/json",  // Ensure the correct content type
          "Authorization": `Token ${token}`,  // Pass the auth token for authentication
      },
      body: JSON.stringify({ meals }),  // Send meals data as a JSON object
  };

  try {
      // COmmented out to support dynamically getting the 'api/v1', if not each time would need to remember to
      // update the string
      //const response = await fetch("http://127.0.0.1:8000/shopping_list/", payload);
      const response = await fetch(`${baseUrl}/shopping_list/`, payload)
      const textResponse = await response.text();
      console.log("Response Text:", textResponse);

      if (response.ok) {
          const data = JSON.parse(textResponse);  // Parse the response JSON
          return { success: true, data };
      } else {
          return { success: false, error: textResponse || "Failed to save ingredients." };
      }
  } catch (error) {
      console.error("Error saving ingredients:", error);
      return { success: false, error: error.message };
  }
}
