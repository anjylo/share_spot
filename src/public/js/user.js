const getUser = async () => {
    try {
        const request = await fetch('/api/user', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        const response = await request.json();

        return response.data;

    } catch (error) {
        return error
    }
}

const setUser = async (event) => {
    event.preventDefault();

    try {
        const form = document.querySelector('form');

        const email = form.email.value;
        const username = form.username.value;
        const password = form.password.value;
        
        if (! email || ! username) {
            window.alert('Username and Email cannot be empty');
            return;
        }

        const response = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        
        const data = await response.json();

        if (
            response.ok && 
            response.status === 200
        ) {
            window.alert('Update complete');
        } else {
            window.alert(Object.values(data.errors).map(error => error).join('\n'));
        }

        return data.data;

    } catch (error) {
        return error
    }
}