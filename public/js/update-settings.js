import axios from 'axios';
import { showAlert } from './alert';

export const updateSettings = async (type, data) => {
    try {
        const url =
            type === 'data'
                ? '/api/v1/users/update-data'
                : '/api/v1/users/update-password';

        const res = await axios({
            method: 'PATCH',
            url,
            data
        });

        if (res.data.status === 'success') {
            showAlert(
                'success',
                `${type.toUpperCase()} updated successfully`
            );

            window.setTimeout(() =>
                location.assign('/settings', 2000)
            );
        }
    } catch (err) {
        showAlert('error', err.response.data.message);
    }
};
