export async function getAllUsers() {

    const response = await fetch('/api/users');
    return await response.json();
}

export async function createUser(data) {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
      })
    return await response.json();
}

export async function checkMonzoAuth() {
    const response = await fetch('/api/monzoIsAuthenticated');
    return await response.json();
}

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