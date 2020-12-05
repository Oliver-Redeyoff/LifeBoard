export async function getMonzoRedirectLink() {
    const response = await fetch('/api/getMonzoRedirectLink');
    return await response.json();
}

export async function authenticateMonzo(data) {
    const response = await fetch('/api/authenticateMonzo', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({authCode: data})
    })
    return await response.json();
}