import { useNavigate } from "react-router-dom";
import { login } from "../../api/AuthApi";


export default function Login() {

    const navigate = useNavigate();

  return (
    <>
        <h2>Login</h2>
        <br></br>
        <form>
          <div >
            <label>Email</label>
            <input
              type="text"
              name="username"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              required
            />
          </div>
          <div>
            <button>Submit</button>
            <button onClick={() => navigate('/')}>
                Cancel
            </button>
          </div>
        </form>
    </>
  );
}

