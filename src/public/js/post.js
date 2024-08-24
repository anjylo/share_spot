const createPost = async (event) => {
    event.preventDefault();

    const resetForm = () => {
        document.getElementsByName('title')[0].value = ''
        document.getElementsByName('content')[0].value = ''
    }

    try {
        const form = document.querySelector('form');

        const title = form.title.value;
        const content = form.content.value;

        if (! title.trim() || ! content.trim()) {
            window.alert('Title and content cannot be empty');
            resetForm()
            return;
        }

        const response = await fetch('/api/post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content })
        });

        const data = await response.json();

        if (
            response.ok && 
            response.status === 201
        ) {
            window.alert('Post created');
        } else {
            window.alert(Object.values(data.errors).map(error => error).join('\n'));
        }

        resetForm()
    } catch (error) {
        console.log(error)
    }
}

const getPosts = async (id = '', offset = 0) => {
    try {
        const request = await fetch(`/api/posts/?id=${id}&offset=${offset}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            }
        });
    
        const response = await request.json();
    
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const getPost = async (id) => {
    try {
        const request = await fetch(`/api/post/${id}`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json'
            }
        });

        const response = await request.json();
    
        return response.data;
    } catch (error) {
        console.log(error)
    }
}

const deletePost = async (id) => {
    const response = await fetch (`/api/post/${id}`, {
        method: 'DELETE',
        headers: { 
            'Content-Type': 'application/json'
        }
    });

    const data = await response.json();

    if (
        response.ok && 
        response.status === 200
    ) {
        window.alert('Post deleted');
    } else {
        window.alert(Object.values(data.errors).map(error => error).join('\n'));
    }

    return data.data;
} 