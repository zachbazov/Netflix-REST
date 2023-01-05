import axios from "axios";
import { showAlert } from "./alert";

export const signin = async (email, password) => {
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

export const signout = async () => {
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
