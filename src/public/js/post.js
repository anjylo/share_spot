const resetForm = () => {
    document.getElementsByName('title')[0].value = ''
    document.getElementsByName('content')[0].value = ''
}

const createPost = async (event) => {
    event.preventDefault();

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