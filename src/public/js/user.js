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
        
        if (! email || ! username || ! password ) {
            window.alert('Fields cannot be empty');
            return;
        }

        const request = await fetch('/api/user', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, username, password })
        });
        
        const response = await request.json();

        window.alert('Update complete');

        return response.data;

    } catch (error) {
        return error
    }
}