import axios from "axios";
import { showAlert } from "../../utils/alert";

export const updateUserSettings = function (btn) {
    btn.addEventListener("click", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;

        updateSettings("data", { name, email });
    });
};

export const updatePassword = function (btn) {
    btn.addEventListener("click", async function (e) {
        e.preventDefault();

        document.querySelector(".btn--save-password").textContent =
            "Updating...";

        const passwordCurrent =
            document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const passwordConfirm =
            document.getElementById("password-confirm").value;

        await updateSettings("password", {
            passwordCurrent,
            password,
            passwordConfirm,
        });

        document.querySelector(".btn--save-password").textContent =
            "Save password";

        passwordCurrent.value = "";
        password.value = "";
        passwordConfirm.value = "";
    });
};

const updateSettings = async (type, data) => {
    try {
        const url =
            type === "data"
                ? "/api/v1/users/update-data"
                : "/api/v1/users/update-password";

        const res = await axios({
            method: "PATCH",
            url,
            data,
        });

        if (res.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully`);

            window.setTimeout(() => location.assign("/settings", 2000));
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};
