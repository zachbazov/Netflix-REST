import axios from "axios";
import { showAlert } from "../../utils/alert";

export const executeRequest = (request, el) => {
    switch (request) {
        case "signIn":
            el.addEventListener("click", function (e) {
                e.preventDefault();
                const email = document.getElementById("email").value;
                const password = document.getElementById("password").value;
                signInRequest(email, password);
            });
            break;
        case "signOut":
            el.addEventListener("click", function (e) {
                e.preventDefault();
                signOutRequest();
            });
            break;
    }
};

const signInRequest = async (email, password) => {
    try {
        const res = await axios({
            method: "POST",
            url: "api/v1/users/signin",
            data: {
                email,
                password,
            },
        });

        if (res.data.status === "success") {
            showAlert("success", "Signed in successfully");

            window.setTimeout(() => {
                location.assign("/");
            }, 1500);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};

const signOutRequest = async () => {
    try {
        const res = await axios({
            method: "GET",
            url: "api/v1/users/signout",
        });

        if (res.data.status === "success") {
            location.reload(true);
        }
    } catch (err) {
        showAlert("error", "Error occurred while signing out", err.message);
    }
};
