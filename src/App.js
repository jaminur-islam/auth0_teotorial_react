import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const {
    isLoading,
    isAuthenticated,
    getAccessTokenSilently,
    error,
    user,
    loginWithRedirect,
    logout,
    loginWithPopup,
  } = useAuth0();

  /*   // not secure api
  const callapi = () => {
    axios("http://localhost:5000/")
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 */

  const [token, setToken] = useState("");

  const callapi = async () => {
    try {
      const result = await axios("http://localhost:5000/");
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  const callapi2 = async () => {
    try {
      const result = await axios("http://localhost:5000/secure2");
      console.log(result.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  const getId = async () => {
    const token = await getAccessTokenSilently();
    setToken(token);
  };
  getId();

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/secure", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });
    }
  }, [token]);

  // secure api
  const callSecureApi = async () => {
    try {
      const token = await getAccessTokenSilently();
      const res = await axios("http://localhost:5000/secure", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
    } catch (error) {
      console.log(error.message);
    }

    /*    axios("http://localhost:5000/secure")
      .then((result) => {
        console.log(result.data);
      })
      .catch((error) => {
        console.log(error);
      }); */
  };

  if (isLoading) {
    return <h1> loading...</h1>;
  }

  return (
    <div style={{ width: "1140px", margin: "0 auto" }}>
      <h1> auth system</h1>
      <li>
        <button onClick={loginWithRedirect}>Login with popup </button>
      </li>
      <li>
        <button onClick={loginWithRedirect}>Login with redirect </button>
      </li>
      <li>
        <button onClick={logout}>Logout </button>
      </li>
      <h2> {isAuthenticated ? "user logged" : "user not logged"}</h2>
      {isAuthenticated && (
        <pre style={{ color: "red" }}> {JSON.stringify(user, null, 2)} </pre>
      )}

      <li>
        {" "}
        <button onClick={callapi}> Call api </button>
      </li>
      <li>
        <button onClick={callSecureApi}>Call secure api</button>
      </li>
      <li>
        <button onClick={callapi2}>Call secure api22</button>
      </li>
    </div>
  );
}

export default App;
