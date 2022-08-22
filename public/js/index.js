import '@babel/polyfill';
import { signin, signout } from './signin';
import { updateSettings } from './update-settings';

const signinForm = document.querySelector('.form');

const signOutButton = document.querySelector(
    '.nav__el--logout'
);

const userDataForm = document.querySelector(
    '.form-user-data'
);

const userPasswordForm = document.querySelector(
    '.form-user-password'
);

if (signinForm) {
    document
        .querySelector('.form')
        .addEventListener('submit', function (e) {
            e.preventDefault();

            const email =
                document.getElementById('email').value;
            const password =
                document.getElementById('password').value;

            signin(email, password);
        });
}

if (signOutButton) {
    signOutButton.addEventListener('click', signout);
}

if (userDataForm) {
    userDataForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email =
            document.getElementById('email').value;

        updateSettings('data', { name, email });
    });
}

if (userPasswordForm) {
    userPasswordForm.addEventListener(
        'submit',
        async (e) => {
            e.preventDefault();

            document.querySelector(
                '.btn--save-password'
            ).textContent = 'Updating...';

            const passwordCurrent = document.getElementById(
                'password-current'
            ).value;
            const password =
                document.getElementById('password').value;
            const passwordConfirm = document.getElementById(
                'password-confirm'
            ).value;
            'password-current'.value;

            await updateSettings('password', {
                passwordCurrent,
                password,
                passwordConfirm
            });

            document.querySelector(
                '.btn--save-password'
            ).textContent = 'Save password';

            passwordCurrent.value = '';
            password.value = '';
            passwordConfirm.value = '';
        }
    );
}
